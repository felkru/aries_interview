import { validateApiKey } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { analyzeArticle } from '@/lib/openai';
import { extractArticleContent } from '@/lib/scraper';
import { NextResponse } from 'next/server';

const articleSchema = z.object({
  url: z.string().url(),
  title: z.string().max(500),
  content: z.string().optional(),
  source: z.object({ name: z.string() }).optional(),
  image: z.string().url().nullable().optional(),
  publishedAt: z.string().optional(),
  description: z.string().optional(),
});

const requestSchema = z.object({
  article: articleSchema,
  force: z.boolean().optional(),
});

/**
 * Canonicalizes a URL for consistent caching.
 */
function canonicalizeUrl(urlString) {
  try {
    const url = new URL(urlString);
    url.hash = '';
    // Remove common tracking params
    url.searchParams.delete('utm_source');
    url.searchParams.delete('utm_medium');
    url.searchParams.delete('utm_campaign');
    return url.toString().replace(/\/$/, '').toLowerCase();
  } catch (e) {
    return urlString;
  }
}

export async function POST(request) {
  try {
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
    
    const limiter = await rateLimit(ip, 'analyze');
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!validateApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error.format() }, { status: 400 });
    }

    const { article, force = false } = result.data;
    const url = canonicalizeUrl(article.url);

    const client = await clientPromise;
    const db = client.db('smart-reviewer');
    const collection = db.collection('reviews');

    // Return cached review unless force-refresh is requested
    if (!force) {
      const cachedReview = await collection.findOne({ url });
      if (cachedReview) {
        return NextResponse.json({ review: cachedReview });
      }
    } else {
      // Re-analyze: delete old entry first
      await collection.deleteMany({ url });
    }

    // Scrape full article text; fall back to truncated GNews content on failure
    const fullContent = await extractArticleContent(url);
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
      url: url,
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
