# ✦ Travora

**Discover places worth remembering.**

Travora isn't just a travel directory—it's a premium, AI-powered travel companion built as a modern web application. It combines cinematic UI, contextual AI chat, and intelligent structured itinerary generation to help users find and plan their next adventure.

---

## 🌟 Key Features

- **Cinematic UI & Animations**: Built with Framer Motion, featuring staggered grid reveals, layout shifting, scroll-linked animations, and premium typographic layout (using *Instrument Serif* and *Inter*).
- **Location Awareness**: Gracefully asks for browser Geolocation or falls back to an OpenStreetMap manual search. Location data integrates directly with our live UI widgets.
- **Live Global Weather**: Open-Meteo integration displays real-time weather, feels-like temperatures, and dynamic weather conditions for any destination worldwide.
- **Waylo — The AI Companion**: A floating AI chatbot powered by Google Gemini 2.5 Flash. Waylo is *context-aware*: if you are looking at Tokyo, Waylo automatically injects Tokyo's data into its system prompt so you can chat seamlessly without reiterating your location.
- **AI Itinerary Planner**: Utilizing Gemini's strict JSON response capabilities, Travora generates gorgeous, customized day-by-day travel itineraries and maps them to a staggered timeline UI.

---

## 🛠️ Architecture & Tech Stack

This project is built to production standards, adopting a "Startup MVP" mindset.

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (using `@theme` tokens)
- **Routing**: React Router DOM (with `AnimatePresence` page transitions)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend / APIs
- **Hosting / Serverless**: Netlify Edge Functions (`netlify/functions`). We securely proxy all Gemini API requests through a Netlify serverless backend so the API keys are **never** exposed in the browser network tab.
- **AI**: Google Gemini API (2.5 Flash)
- **Geocoding**: OpenStreetMap Nominatim API (Free, no key required)
- **Weather**: Open-Meteo API (Free, no key required)
- **Image placeholders**: Pollinations.ai (Semantic prompt-to-image placeholders)

---

## 🚀 Running Locally

To run Travora on your local machine, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Duplicate the `.env.example` file and rename it to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your Google Gemini API Key. (You do not need keys for the Weather or Maps features).

### 3. Start the Development Server
```bash
npm run dev
```

> **Developer Note on Serverless**: In production, the AI tools hit `/.netlify/functions/*`. During local Vite development (without the Netlify CLI), the app intelligently catches the `404` and seamlessly falls back to querying the Gemini API directly from the browser using your `.env.local` key. This guarantees a flawless local development experience without complex CLI setups!

---

## ♿ Accessibility & Polish

- Strict semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`).
- Comprehensive keyboard navigation (`Tab` index checking, custom focus rings, `skip-to-content` links).
- Screen-reader ready (`aria-label`, `aria-hidden` on decorative media, ARIA dialog roles).
- `loading="lazy"` on heavy media below the fold.

---

*Crafted with precision.*
