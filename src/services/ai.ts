import type { ChatMessage } from '../types';

interface ChatContext {
  name?: string;
  country?: string;
  places?: string;
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

  const systemText = context
    ? `You are Waylo, Travora's AI travel companion. The user is currently viewing the destination page for ${context.name}, ${context.country}. Famous places here include: ${context.places}. 
    CRITICAL INSTRUCTIONS: Be highly engaging and visually appealing. Always use emojis 🌴✨ for different sections. Use short, scannable paragraphs. Use bold text for emphasis. If providing an itinerary, use bold headers with emojis for days. Keep responses concise and fast to read.`
    : `You are Waylo, Travora's AI travel companion. 
    CRITICAL INSTRUCTIONS: Be highly engaging and visually appealing. Always use emojis 🌍✈️ for different sections. Format lists cleanly. Use short, scannable paragraphs. Use bold text for emphasis. If planning a trip, format it beautifully with emojis for morning/afternoon/evening. Keep responses concise and fast to read.`;

  if (groqApiKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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
export async function generateItinerary(destination: string, days: number, preferences: string = ''): Promise<any> {
  try {
    const response = await fetch('/.netlify/functions/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, days, preferences }),
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 404) {
      console.warn('Serverless endpoint /.netlify/functions/itinerary not found. Falling back to direct Gemini API call.');
      return await fallbackDirectItineraryCall(destination, days, preferences);
    }

    throw new Error('Serverless request failed');
  } catch (error) {
    console.warn('Network error hitting Netlify function, falling back to direct Gemini API call.', error);
    return await fallbackDirectItineraryCall(destination, days, preferences);
  }
}

/**
 * Local development fallback for itinerary generation.
 */
async function fallbackDirectItineraryCall(destination: string, days: number, preferences: string): Promise<any> {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!groqApiKey && !geminiApiKey) throw new Error('API key is missing.');

  const systemText = `You are an expert travel planner. Create a highly curated ${days}-day itinerary for ${destination}. 
User preferences: ${preferences || 'Show me the best highlights and local secrets.'}

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
        model: 'llama-3.3-70b-versatile',
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
