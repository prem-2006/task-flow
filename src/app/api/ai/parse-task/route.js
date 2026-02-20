import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import openai from '@/lib/openai';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'AI features are not configured' }, { status: 503 });
    }

    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a task parser. Extract structured task details from natural language input.
Today's date is ${today}. When users mention relative dates like "tomorrow", "next Friday", "in 3 days", convert them to actual dates.

Return a JSON object with these fields:
- title (string, required): Clear, concise task title
- description (string): Additional details if mentioned
- priority (string): one of "low", "medium", "high", "urgent" — infer from language
- dueDate (string|null): ISO date string if mentioned
- tags (array of strings): Extract relevant tags/categories
- estimatedMinutes (number|null): Rough time estimate if inferable
- subtasks (array of {title: string}): Break down if the task is complex`,
        },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ parsed });
  } catch (error) {
    console.error('AI parse-task error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
