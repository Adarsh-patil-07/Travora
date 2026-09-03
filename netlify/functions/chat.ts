import type { Context } from '@netlify/functions';

export default async function (req: Request, _context: Context) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, context: chatContext } = await req.json();
    const groqApiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      return new Response(JSON.stringify({ error: 'API key is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the context-aware system instruction for Waylo
    const systemText = chatContext
      ? `You are Waylo, Travora's AI travel companion. The user is currently viewing the destination page for ${chatContext.name}, ${chatContext.country}. Famous places here include: ${chatContext.places}. 
      CRITICAL INSTRUCTIONS: Be highly engaging and visually appealing. Always use emojis 🌴✨ for different sections. Use short, scannable paragraphs. Use bold text for emphasis. If providing an itinerary, use bold headers with emojis for days. Keep responses concise and fast to read. Do not use large markdown headers.`
      : `You are Waylo, Travora's AI travel companion. 
      CRITICAL INSTRUCTIONS: Be highly engaging and visually appealing. Always use emojis 🌍✈️ for different sections. Format lists cleanly. Use short, scannable paragraphs. Use bold text for emphasis. If planning a trip, format it beautifully with emojis for morning/afternoon/evening. Keep responses concise and fast to read. Do not use large markdown headers.`;

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
            ...messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return new Response(JSON.stringify({ error: errorData?.error?.message || 'Failed to communicate with Groq AI' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map our messages to Gemini's expected format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemText }],
          },
          contents,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: errorData?.error?.message || 'Failed to communicate with Gemini AI' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
