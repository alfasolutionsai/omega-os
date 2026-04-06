import { NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limiter';

// Configuration
const MAX_MESSAGE_LENGTH = 5000;
const SYSTEM_PROMPT = "Tu es l'assistant d'OMEGA OS. Tu aides les utilisateurs avec leurs demandes de manière précise et professionnelle.";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { message, context } = body;

    // 1. Validate input: prevent empty or too long messages
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // 2. Build system message with context injection
    const systemContent = context 
      ? `${SYSTEM_PROMPT}\n\nContexte de la conversation: ${JSON.stringify(context)}`
      : SYSTEM_PROMPT;

    // Use our rate limiter to wrap the external API call
    const result = await withRateLimit(async () => {
      // 4. Secure fetch call with AbortController timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      try {
        // Forward the request to your AI provider (Alibaba/OpenRouter)
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://omegasolutions.ca',
            'X-Title': 'OMEGA OS',
          },
          body: JSON.stringify({
            model: "alibaba/qwen-2.5-coder-32b-instruct",
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: message }
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        // 3. Improve HTTP error handling: distinguish 500, 401, 429
        if (!response.ok) {
          const errorData = await response.text().catch(() => 'Unknown error');
          
          let errorMessage: string;
          let statusCode: number;

          switch (response.status) {
            case 401:
              statusCode = 401;
              errorMessage = 'Authentication failed: Invalid API key';
              break;
            case 429:
              statusCode = 429;
              errorMessage = 'Rate limit exceeded: Too many requests';
              break;
            case 500:
              statusCode = 502; // Bad Gateway - upstream server error
              errorMessage = 'AI service error: Internal server error';
              break;
            default:
              statusCode = response.status >= 500 ? 502 : response.status;
              errorMessage = `AI API Error: ${response.status}`;
          }

          return NextResponse.json(
            { error: errorMessage, details: errorData },
            { status: statusCode }
          );
        }

        return response.json();
      } catch (fetchError: any) {
        clearTimeout(timeout);
        
        // Handle network errors and timeouts
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout: AI service did not respond in time');
        }
        
        throw fetchError;
      }
    });

    // Check if result is already a Response (error case from switch)
    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    // Handle rate limiter errors and other exceptions
    const isRateLimitError = error.message?.includes('Rate limit') || error.message?.includes('rate limit');
    const isAuthError = error.message?.includes('Authentication') || error.message?.includes('401');
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