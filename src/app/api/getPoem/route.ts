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

    // Initialize OpenRouter API with timeout
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL,
        "X-Title": "Video Script Generator",
      },
      timeout: 60000 // 60 second timeout
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

    // Create a stream for the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Start processing in the background
    (async () => {
      try {
        // Call the OpenRouter API
        const response = await client.chat.completions.create({
          model: 'google/gemini-2.0-flash-001',
          max_tokens: 5000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true,
        });

        let generatedContent = '';
        
        // Stream the response chunks
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          generatedContent += content;
          await writer.write(new TextEncoder().encode(content));
        }

        // Generate a unique result_id
        const dateCreated = format(new Date(), 'MM/dd/yyyy|HH:mm');
        const result_id = `${title || 'Untitled'}|${dateCreated}`;

        // Save to Airtable in the background
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

        fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Prompt%20Automation%20Results`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(airtablePayload),
          }
        ).catch(err => console.error('Failed to save to Airtable:', err));

      } catch (error) {
        console.error('Error generating script:', error);
        await writer.write(new TextEncoder().encode('\n\nError: Failed to generate script'));
      } finally {
        await writer.close();
      }
    })();

    // Return the stream immediately
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/plain',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
}
