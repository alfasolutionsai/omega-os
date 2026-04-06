import { NextResponse } from 'next/server';
import { searchMemory } from '@/lib/rag-search';
import { withRateLimit } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and cannot be empty' },
        { status: 400 }
      );
    }

    const results = await withRateLimit(() => searchMemory(query));
    return NextResponse.json({ results });
  } catch (error: any) {
    const isRateLimitError =
      error.message?.includes('Rate limit') ||
      error.message?.includes('rate limit');
    const isAuthError =
      error.message?.includes('Authentication') ||
      error.message?.includes('401');
    const isTimeoutError = error.message?.includes('timeout');

    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (isRateLimitError) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
    } else if (isAuthError) {
      statusCode = 401;
      errorMessage = 'Authentication failed';
    } else if (isTimeoutError) {
      statusCode = 504;
      errorMessage = error.message || 'Request timeout';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}