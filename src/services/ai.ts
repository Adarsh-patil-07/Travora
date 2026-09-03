import type { ChatMessage } from '../types';

export interface ChatContext {
  name?: string;
  country?: string;
  places?: string;
  currency?: string;
}

/**
 * Sends a message to the Waylo AI assistant.
 * In production, this hits our secure Netlify serverless function.
 * In local development (if Netlify CLI isn't running), it falls back to calling Gemini directly 
 * using the local Vite environment variable to ensure a seamless developer experience.
 */
export async function sendMessageToWaylo(messages: ChatMessage[], context?: ChatContext): Promise<string> {
  try {
    // 1. Try hitting the serverless endpoint
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, context }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
    
    // If we get a 404, we are likely running the raw Vite dev server without Netlify CLI.
    if (response.status === 404) {
      console.warn('Serverless endpoint /.netlify/functions/chat not found. Falling back to direct Gemini API call (Local Dev Mode).');
      return await fallbackDirectGeminiCall(messages, context);
    }

    throw new Error('Serverless request failed');
  } catch (error) {
    // Catch network errors (e.g., if /.netlify/functions doesn't exist at all locally)
    console.warn('Network error hitting Netlify function, falling back to direct Gemini API call.', error);
    return await fallbackDirectGeminiCall(messages, context);
  }
}

/**
 * Local development fallback: Calls Gemini API directly from the browser.
 * Requires VITE_GEMINI_API_KEY in .env.local.
 */
async function fallbackDirectGeminiCall(messages: ChatMessage[], context?: ChatContext): Promise<string> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!groqApiKey && !geminiApiKey) {
    throw new Error('API key is missing. Please add VITE_GROQ_API_KEY or VITE_GEMINI_API_KEY to .env.local');
  }

  const currencyClause = context?.currency 
    ? `\n- USER PREFERRED CURRENCY: ${context.currency}. Whenever you mention any prices, costs, budget estimates, food, taxi fares, entrance tickets, or hotel rates, ALWAYS calculate and quote them in ${context.currency}.`
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

  const systemText = context?.name
    ? `${baseRules}
The user is currently viewing the destination page for ${context.name}, ${context.country}. Famous places here include: ${context.places}.`
    : baseRules;

  if (groqApiKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemText },
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
        ]
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Direct Groq API call failed');
    }
    
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "I couldn't process that.";
  }

  // Fallback to Gemini if no Groq key
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents,
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Gemini API Error:', errorData);
    throw new Error(errorData?.error?.message || 'Direct Gemini API call failed');
  }
  
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
}

/**
 * Generates a structured JSON itinerary using the Netlify serverless function.
 */
export async function generateItinerary(destination: string, days: number, preferences: string = '', currency: string = 'INR (₹)'): Promise<any> {
  try {
    const response = await fetch('/.netlify/functions/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, days, preferences, currency }),
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 404) {
      console.warn('Serverless endpoint /.netlify/functions/itinerary not found. Falling back to direct Gemini API call.');
      return await fallbackDirectItineraryCall(destination, days, preferences, currency);
    }

    throw new Error('Serverless request failed');
  } catch (error) {
    console.warn('Network error hitting Netlify function, falling back to direct Gemini API call.', error);
    return await fallbackDirectItineraryCall(destination, days, preferences, currency);
  }
}

/**
 * Local development fallback for itinerary generation.
 */
async function fallbackDirectItineraryCall(destination: string, days: number, preferences: string, currency: string = 'INR (₹)'): Promise<any> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!groqApiKey && !geminiApiKey) throw new Error('API key is missing.');

  const systemText = `You are an expert travel planner. Create a highly curated ${days}-day itinerary for ${destination}. 
User preferences: ${preferences || 'Show me the best highlights and local secrets.'}
User preferred currency: ${currency}. Whenever mentioning estimated costs, ticket fees, taxi fares, or food prices in activity descriptions, ALWAYS quote them in ${currency}.

You must respond ONLY with a valid JSON object strictly matching this exact structure:
{
  "destination": "String",
  "duration": "${days} Days",
  "days": [
    {
      "day": 1,
      "title": "String",
      "activities": [
        {
          "time": "String",
          "title": "String",
          "description": "String"
        }
      ]
    }
  ]
}`;

  if (groqApiKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemText },
          { role: 'user', content: 'Generate the itinerary JSON now.' }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Failed to connect to Groq API');
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response');
    return JSON.parse(text);
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents: [{ role: 'user', parts: [{ text: 'Generate the itinerary JSON now.' }] }],
        generationConfig: { response_mime_type: 'application/json' },
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to connect to Gemini API');
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response');
  
  return JSON.parse(text);
}
