import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { THREAD_TONE_PROMPTS, ThreadTone } from '@/types/threadTone';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { transcript, tone } = await req.json();

    if (!transcript || !tone) {
      return NextResponse.json(
        { error: 'Transcript and tone are required' },
        { status: 400 }
      );
    }

    if (!Object.keys(THREAD_TONE_PROMPTS).includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone selected' },
        { status: 400 }
      );
    }

    const prompt = THREAD_TONE_PROMPTS[tone as ThreadTone];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: transcript }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedThread = completion.choices[0]?.message?.content;

    if (!generatedThread) {
      throw new Error('No response from OpenAI');
    }

    // Split the generated thread into individual posts
    const posts = generatedThread.split('\n\n').filter((post: string) => post.trim());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error generating thread:', error);
    return NextResponse.json(
      { error: 'Failed to generate thread' },
      { status: 500 }
    );
  }
} 