// import { NextRequest, NextResponse } from 'next/server';
// import Anthropic from '@anthropic-ai/sdk';

// interface ContentItem {
//   type: string;
//   text: string;
// }

// interface AnthropicResponse {
//   id: string;
//   type: string;
//   role: string;
//   model: string;
//   content?: ContentItem[]; // Array of content items as seen in your logs
//   stop_reason?: string;
//   stop_sequence?: string | null;
//   usage?: {
//     input_tokens: number;
//     output_tokens: number;
//   };
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { title, type, targetAudience, tone, duration, keyPoints, callToAction, scriptOption } = body;

//     const anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY || '',
//     });

//     const prompt = `
//       You are a scriptwriting assistant. Write a ${scriptOption} video script with the following details:
//       - Title: ${title || 'Untitled'}
//       - Type: ${type || 'General'}
//       - Target Audience: ${targetAudience || 'General Audience'}
//       - Tone: ${tone || 'Neutral'}
//       - Duration: ${duration || 'Not specified'}
//       - Key Points: ${keyPoints || 'None provided'}
//       - Call to Action: ${callToAction || 'None provided'}
//       Please create a detailed and engaging script.

//       \n\nHuman: ${scriptOption} video script based on the details provided above.
//       \nAssistant:
//     `;

//     // Call the Anthropics API
//     const response = await anthropic.messages.create({
//       model: 'claude-3-5-sonnet-20241022',
//       max_tokens: 1000,
//       temperature: 0.7,
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     }) as unknown as AnthropicResponse;

//     console.log('Anthropic API Response:', JSON.stringify(response, null, 2));

//     // Safely access content items from the response
//     let generatedContent = 'No content generated.';

//     if (response.content && Array.isArray(response.content)) {
//       generatedContent = response.content
//         .filter((item) => item.type === 'text') // Filter to get only items of type 'text'
//         .map((item) => item.text) // Map to get the text field
//         .join('\n'); // Join all text parts together
//     }

//     return NextResponse.json({ content: generatedContent });
//   } catch (error) {
//     console.error('Error generating script:', error);
//     return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
//   }
// }
