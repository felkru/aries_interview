import { validateApiKey } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
  
  const limiter = await rateLimit(ip);
  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  if (q.length > 100) {
    return NextResponse.json({ error: 'Search query too long' }, { status: 400 });
  }

  const apiKey = process.env.GNEWS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&apikey=${apiKey}&lang=en`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
        return NextResponse.json({ error: data.message || 'Failed to fetch news' }, { status: response.status });
    }

    return NextResponse.json({ articles: data.articles || [] });
  } catch (error) {
    console.error('API /news fetch error:', error);
    return NextResponse.json({ error: 'Internal server error while fetching news' }, { status: 500 });
  }
}
