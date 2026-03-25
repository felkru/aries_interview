import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { analyzeArticle } from '@/lib/openai';

export async function POST(request) {
  try {
    const body = await request.json();
    const article = body.article;

    if (!article || !article.url) {
      return NextResponse.json({ error: 'Valid article object with url is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('smart-reviewer');
    const collection = db.collection('reviews');

    const cachedReview = await collection.findOne({ url: article.url });
    if (cachedReview) {
      return NextResponse.json({ review: cachedReview });
    }

    let analysis;
    try {
      analysis = await analyzeArticle(article);
    } catch (e) {
      console.error('OpenAI analysis error:', e);
      return NextResponse.json({ error: 'Analysis failed or refused' }, { status: 422 });
    }

    const newReview = {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      url: article.url,
      title: article.title,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      description: article.description,
      content: article.content,
      analyzedAt: new Date().toISOString()
    };

    await collection.insertOne(newReview);
    return NextResponse.json({ review: newReview });
  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
