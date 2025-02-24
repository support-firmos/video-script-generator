import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { format } from 'date-fns';

interface ContentItem {
  type: string;
  text: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  model: string;
  content?: ContentItem[];
  stop_reason?: string;
  stop_sequence?: string | null;
  usage?: {
    input_tokens: number;
    output_tokens: number;
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

    // Initialize Anthropic API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    // Construct the prompt for Anthropic API
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

      \n\nHuman: ${scriptOption} video script based on the details provided above.
      \nAssistant:
    `;

    // Call the Anthropics API
    const response = (await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })) as unknown as AnthropicResponse;

    console.log('Anthropic API Response:', JSON.stringify(response, null, 2));

    // Extract the generated content
    let generatedContent = 'No content generated.';
    if (response.content && Array.isArray(response.content)) {
      generatedContent = response.content
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join('\n');
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
