import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { analyzeArticle } from '@/lib/openai';
import { extractArticleContent } from '@/lib/scraper';

export async function POST(request) {
  try {
    const body = await request.json();
    const article = body.article;
    const force = body.force === true;

    if (!article || !article.url) {
      return NextResponse.json({ error: 'Valid article object with url is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('smart-reviewer');
    const collection = db.collection('reviews');

    // Return cached review unless force-refresh is requested
    if (!force) {
      const cachedReview = await collection.findOne({ url: article.url });
      if (cachedReview) {
        return NextResponse.json({ review: cachedReview });
      }
    } else {
      // Re-analyze: delete old entry first
      await collection.deleteMany({ url: article.url });
    }

    // Scrape full article text; fall back to truncated GNews content on failure
    const fullContent = await extractArticleContent(article.url);
    const enrichedArticle = {
      ...article,
      content: fullContent || article.content,
      _contentSource: fullContent ? 'scraped' : 'api',
    };

    let analysis;
    try {
      analysis = await analyzeArticle(enrichedArticle);
    } catch (e) {
      console.error('OpenAI analysis error:', e);
      const message = e.message?.includes('non-English')
        ? 'Analysis could not produce an English summary. Please try again.'
        : 'Analysis failed or refused';
      return NextResponse.json({ error: message }, { status: 422 });
    }

    const newReview = {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      url: article.url,
      title: article.title,
      source: article.source?.name,
      image: article.image || null,
      publishedAt: article.publishedAt,
      description: article.description,
      content: enrichedArticle.content,
      contentSource: enrichedArticle._contentSource,
      analyzedAt: new Date().toISOString()
    };

    await collection.insertOne(newReview);
    return NextResponse.json({ review: newReview });
  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
