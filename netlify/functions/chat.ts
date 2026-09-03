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
    const currencyClause = chatContext?.currency 
      ? `\n- USER PREFERRED CURRENCY: ${chatContext.currency}. Whenever you mention any prices, costs, budget estimates, food, taxi fares, entrance tickets, or hotel rates, ALWAYS calculate and quote them in ${chatContext.currency}.`
      : `\n- USER PREFERRED CURRENCY: INR (₹). Whenever you mention any prices or travel budgets, ALWAYS quote them in the active currency.`;

    const baseRules = `You are Waylo, Travora's friendly and knowledgeable AI travel companion.
STRICT SCOPE & DOMAIN RESTRICTION:
- You are EXCLUSIVELY a Travel & Tourism Assistant.
- You must ONLY answer questions directly related to travel, destinations, itineraries, places to visit, hotels, flights, local food, culture, packing, weather, travel budgets, sightseeing, and geography.
- If the user asks ANY question that is NOT related to travel (e.g. iPhone or smartphone prices, electronic gadgets, programming/coding, mathematics, crypto, medical advice, celebrity gossip, or general trivia unrelated to travel), you MUST politely decline and steer them back to travel with a friendly response like:
  "I'm Waylo, your dedicated AI travel companion! 🌍✈️ I can only help with travel-related topics like destination guides, trip planning, places to visit, flight/hotel tips, and local cultures. Where would you like to travel next? Let's plan a trip! 🌴🎒"
- Do NOT answer non-travel questions (do NOT give iPhone prices, gadget specs, or non-travel advice).
${currencyClause}

FORMATTING INSTRUCTIONS:
- Keep answers engaging, structured, and visually clean.
- Use emojis 🌍✈️🌴 appropriately.
- Use short, scannable paragraphs and bullet points.
- Keep responses compact and fast to read. Avoid massive paragraphs.`;

    const systemText = chatContext?.name
      ? `${baseRules}
The user is currently viewing the destination page for ${chatContext.name}, ${chatContext.country}. Famous places here include: ${chatContext.places}.`
      : baseRules;

    if (groqApiKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
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
