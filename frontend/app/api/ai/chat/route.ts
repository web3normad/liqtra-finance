import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are an AI assistant for Liqtra Finance, a DeFi portfolio management platform. 
You help users:
- Understand their portfolio performance
- Find the best yield opportunities
- Assess risks in DeFi protocols
- Optimize their investment strategies
- Explain DeFi concepts in simple terms

Be concise, helpful, and professional. Focus on actionable advice. When discussing yields or APYs, 
always mention associated risks. Don't make specific investment recommendations without context.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userAddress, portfolioData } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Add portfolio context if available
    let systemPrompt = SYSTEM_PROMPT;
    if (portfolioData) {
      systemPrompt += `\n\nUser's Portfolio Context:
- Total Balance: $${portfolioData.total_balance || 0}
- Vault Balance: $${portfolioData.vault_balance || 0}
- Current APY: ${portfolioData.current_apy || 0}%
- Total Earned: $${portfolioData.total_earned || 0}`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4' for better responses
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
