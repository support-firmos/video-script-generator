import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { format } from 'date-fns';

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      type,
      targetAudience,
      tone,
      duration,
      keyPoints,
      callToAction,
      scriptOption,
    } = body;

    // Initialize OpenRouter API
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL,
        "X-Title": "Video Script Generator",
      },
    });

    // Construct the prompt for OpenRouter API
    const prompt = `
      You are a scriptwriting assistant. Write a ${scriptOption} video script with the following details:
      - Title: ${title || 'Untitled'}
      - Type: ${type || 'General'}
      - Target Audience: ${targetAudience || 'General Audience'}
      - Tone: ${tone || 'Neutral'}
      - Duration: ${duration || 'Not specified'}
      - Key Points: ${keyPoints || 'None provided'}
      - Call to Action: ${callToAction || 'None provided'}
      Please create a detailed and engaging script.
    `;

    // Call the OpenRouter API
    const response = (await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      max_tokens: 5000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })) as unknown as OpenRouterResponse;

    console.log('Anthropic API Response:', JSON.stringify(response, null, 2));

    // Extract the generated content
    let generatedContent = 'No content generated.';
    if (response.choices && response.choices.length > 0) {
      generatedContent = response.choices[0].message.content;
    }

    // Generate a unique result_id
    const dateCreated = format(new Date(), 'MM/dd/yyyy|HH:mm');
    const result_id = `${title || 'Untitled'}|${dateCreated}`;

    // Save to Airtable
    const airtablePayload = {
      fields: {
        result_id,
        title,
        script_type: scriptOption,
        video_type: type,
        target_audience: targetAudience,
        tone,
        duration,
        key_points: keyPoints,
        cta: callToAction,
        generated_result: generatedContent,
        date_created: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      },
    };

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Prompt%20Automation%20Results`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtablePayload),
      }
    );

    if (!airtableResponse.ok) {
      const airtableError = await airtableResponse.text();
      console.error('Failed to save to Airtable:', airtableError);
      throw new Error('Failed to save to Airtable.');
    }

    console.log('Saved to Airtable successfully.');

    // Return the generated script
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
}
