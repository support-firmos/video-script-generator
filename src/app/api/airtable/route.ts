import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      result_id,
      title,
      script_type,
      video_type,
      target_audience,
      tone,
      duration,
      key_points,
      cta,
      generated_result,
    } = body;

    const date_created = new Date().toISOString(); // Standard date format

    const AIRTABLE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Prompt%20Automation%20Results`;

    const payload = {
      fields: {
        result_id,
        title,
        script_type,
        video_type,
        target_audience,
        tone,
        duration,
        key_points,
        cta,
        generated_result,
        date_created,
      },
    };

    const response = await fetch(AIRTABLE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Failed to save to Airtable:', errorDetails);
      throw new Error(errorDetails || 'Failed to save to Airtable.');
    }

    const data = await response.json();
    console.log('Airtable API Response:', data);

    return NextResponse.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data to Airtable:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
