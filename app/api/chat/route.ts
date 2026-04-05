import { NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Use our rate limiter to wrap the external API call
    const result = await withRateLimit(async () => {
      // Forward the request to your AI provider (Alibaba/OpenRouter)
      // This is where you protect your upstream provider
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://omegasolutions.ca',
          'X-Title': 'OMEGA OS',
        },
        body: JSON.stringify({
          model: "alibaba/qwen-2.5-coder-32b-instruct", // Example model
          messages: [
            { role: "system", content: "Tu es l'assistant d'OMEGA OS." },
            { role: "user", content: message }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`AI API Error: ${response.status} - ${errorData}`);
      }

      return response.json();
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Rate limit exceeded or internal error' },
      { status: 429 }
    );
  }
}