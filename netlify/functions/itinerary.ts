import type { Context } from '@netlify/functions';

export default async function (req: Request, _context: Context) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { destination, days, preferences } = await req.json();
    const groqApiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      return new Response(JSON.stringify({ error: 'API key is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemText = `You are an expert travel planner. Create a highly curated ${days}-day itinerary for ${destination}. 
User preferences: ${preferences || 'Show me the best highlights and local secrets.'}

You must respond ONLY with a valid JSON object strictly matching this exact structure, with no markdown formatting around it:
{
  "destination": "String",
  "duration": "${days} Days",
  "days": [
    {
      "day": 1,
      "title": "String (Theme of the day)",
      "activities": [
        {
          "time": "String (e.g., 09:00 AM)",
          "title": "String (Activity name)",
          "description": "String (Rich, editorial description of what to do)"
        }
      ]
    }
  ]
}
Each day should have 3-5 logical activities (morning, afternoon, evening). Ensure realistic travel times between activities.`;

    if (groqApiKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemText },
            { role: 'user', content: 'Generate the itinerary JSON now.' }
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return new Response(JSON.stringify({ error: errorData?.error?.message || 'Failed to generate itinerary with Groq' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error('Empty response from AI');
      }

      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemText }] },
          contents: [{ role: 'user', parts: [{ text: 'Generate the itinerary JSON now.' }] }],
          generationConfig: {
            response_mime_type: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to generate itinerary' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from AI');
    }

    // Since we forced application/json, the text is a JSON string
    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Itinerary API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
