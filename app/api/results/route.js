import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
    
    const limiter = await rateLimit(ip);
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!validateApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db('smart-reviewer');
    const collection = db.collection('reviews');

    const results = await collection.find({}).sort({ analyzedAt: -1 }).toArray();

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
