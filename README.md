# ✦ Travora

**Discover places worth remembering.**

Travora isn't just a travel directory—it's a premium, AI-powered travel companion built as a modern web application. It combines cinematic UI, contextual AI chat, and intelligent structured itinerary generation to help users find and plan their next adventure.

🔗 **Live Demo**: [travora-ai.netlify.app](https://travora-ai.netlify.app)

---

## 🌟 Key Features

### 🎬 Cinematic UI & Animations
Built with Framer Motion, featuring staggered grid reveals, layout shifting, scroll-linked animations, and a premium typographic system using *Instrument Serif* for display headings and *Inter* for body text. The hero section includes a full-bleed background video with gradient overlays for an immersive first impression.

### 📍 Location Awareness
Gracefully requests browser Geolocation on first visit and reverse-geocodes the coordinates via OpenStreetMap Nominatim. Falls back to a manual search if permissions are denied. Location data integrates directly with the live weather widget and pre-fills the hero search bar.

### 🌤️ Live Global Weather
Open-Meteo integration displays real-time temperature, feels-like temperature, humidity, wind speed, and visibility for any destination worldwide—no API key required.

### 🤖 Waylo — The AI Travel Companion
A floating AI chatbot accessible from any page. Waylo is *context-aware*: when a user is viewing a specific destination (e.g., Tokyo), the system prompt is dynamically injected with that destination's metadata (name, country, famous places) so users can ask follow-up questions without repeating context.

### 🗺️ AI Itinerary Planner
Generates beautifully structured, day-by-day travel itineraries rendered in a staggered timeline UI. Users specify a destination, number of days, and optional preferences. The AI returns strict JSON which is parsed and mapped to interactive timeline components.

### 🔍 Smart Explore & Search
A full explore page with destination cards, mood-based filtering, and a dynamic search bar. Destinations are enriched with curated imagery, coordinates, weather data, and travel tips.

### 👤 User Profiles & Saved Destinations
Firebase Authentication enables user sign-in. Signed-in users can save destinations to their profile and manage their favorites. User data is persisted in Firestore.

### 🌐 Multi-Language Support
Integrated Google Translate widget enables on-the-fly language switching across the entire application.

---

## 🛠️ Architecture & Tech Stack

This project is built to production standards, adopting a **"Startup MVP"** mindset—shipping fast without sacrificing code quality, accessibility, or developer experience.

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** + **TypeScript** | UI framework with full type safety |
| **Vite 8** | Lightning-fast HMR and optimized production builds |
| **Tailwind CSS v4** | Utility-first styling with custom `@theme` design tokens |
| **Framer Motion** | Page transitions, scroll reveals, hover animations |
| **React Router DOM v7** | Client-side routing with `AnimatePresence` page transitions |
| **Lucide React** | Consistent, tree-shakeable icon library |
| **React Hot Toast** | Elegant toast notifications |
| **React Markdown** | Rendering AI responses with rich formatting |
| **React Helmet Async** | Dynamic meta tag management for SEO |

### Backend / APIs
| Service | Purpose |
|---|---|
| **Netlify** | Hosting, CI/CD, and Serverless Functions |
| **Groq API** (Qwen 3.8-27B) | Primary AI provider for Waylo chat and itinerary generation |
| **Google Gemini API** | Secondary AI fallback (retained for compatibility) |
| **Firebase** | Authentication (Google Sign-In) and Firestore for user data |
| **OpenStreetMap Nominatim** | Reverse geocoding (Free, no API key required) |
| **Open-Meteo** | Real-time weather data (Free, no API key required) |
| **Pollinations.ai** | Semantic prompt-to-image placeholders |

### AI Provider Decision

> **Note**: The initial implementation used Google Gemini 2.5 Flash as the primary AI provider. During production deployment, Gemini API free-tier quota limits were reached, resulting in service interruptions. To ensure uninterrupted availability and a reliable user experience, the AI backend was migrated to **Groq's inference API** running the **Qwen 3.8-27B** model, which offers generous free-tier throughput. The Gemini integration is retained as a secondary fallback in the codebase to support developers who have active Gemini API credits.

---

## 📁 Project Structure

```
travora/
├── index.html                  # Entry HTML with viewport & font preloads
├── netlify.toml                # Netlify build config, redirects & functions
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript project references
│
├── netlify/functions/          # Serverless API endpoints
│   ├── chat.ts                 # Waylo AI chat endpoint (Groq → Gemini fallback)
│   └── itinerary.ts            # AI itinerary generation endpoint
│
├── public/                     # Static assets (favicon, etc.)
│
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Route definitions & layout
    ├── index.css               # Global styles & Tailwind @theme tokens
    │
    ├── pages/                  # Route-level page components
    │   ├── Home.tsx            # Landing page with Hero
    │   ├── Explore.tsx         # Destination search & grid
    │   ├── Destination.tsx     # Individual destination deep-dive
    │   ├── Planner.tsx         # AI itinerary planner & timeline
    │   ├── Assistant.tsx       # Full-page Waylo chat interface
    │   └── Profile.tsx         # User profile & saved destinations
    │
    ├── components/
    │   ├── features/           # Feature-specific components
    │   │   ├── Hero.tsx        # Hero section with video background
    │   │   ├── ChatAssistant.tsx # Floating Waylo chat widget
    │   │   ├── WeatherWidget.tsx # Live weather display
    │   │   ├── DestinationCard.tsx # Explore grid card
    │   │   ├── PlaceCard.tsx   # Place-of-interest card
    │   │   ├── ItineraryTimeline.tsx # Day-by-day timeline
    │   │   ├── LocationPrompt.tsx # Geolocation permission UI
    │   │   └── MoodFilter.tsx  # Mood-based destination filter
    │   ├── layout/             # Navbar, Footer, wrappers
    │   └── ui/                 # Reusable UI primitives (Button, ErrorFallback, etc.)
    │
    ├── contexts/               # React Context providers (Auth)
    ├── data/                   # Static destination data & metadata
    ├── hooks/                  # Custom React hooks
    ├── lib/                    # Utilities (motion variants, Firestore helpers)
    ├── services/               # API service layer (ai.ts)
    └── types/                  # TypeScript type definitions
```

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** ≥ 18
- A **Groq API Key** (free at [console.groq.com](https://console.groq.com)) *or* a **Google Gemini API Key** (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/Adarsh-patil-07/Travora.git
cd Travora
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Duplicate the `.env.example` file and rename it to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your API key(s):
```env
# Primary AI provider (Recommended)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Secondary AI fallback (Optional — only if you have Gemini credits)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: Weather (Open-Meteo) and Geocoding (OpenStreetMap Nominatim) work out of the box with no API keys required.

### 4. Start the Development Server
```bash
npm run dev
```

> **Developer Note on Serverless**: In production, the AI tools hit `/.netlify/functions/*`. During local Vite development (without the Netlify CLI), the app intelligently catches the `404` and seamlessly falls back to querying the AI provider directly from the browser using your `.env.local` key. This guarantees a flawless local development experience without complex CLI setups.

---

## 🚢 Deployment (Netlify)

Travora is configured for zero-config Netlify deployment:

1. Push your code to GitHub.
2. Connect the repository to Netlify.
3. Add environment variables (`VITE_GROQ_API_KEY`) in the Netlify dashboard.
4. Netlify reads `netlify.toml` and handles everything:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
   - **SPA redirects**: All routes → `index.html`

---

## ♿ Accessibility & Polish

- Strict semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`).
- Comprehensive keyboard navigation (`Tab` index management, custom focus rings, `skip-to-content` links).
- Screen-reader ready (`aria-label`, `aria-hidden` on decorative media, ARIA dialog roles on modals).
- `loading="lazy"` on heavy media below the fold.
- Responsive design tested across mobile, tablet, and desktop breakpoints.
- iOS Safari auto-zoom prevention on input focus.

---

## 📜 License

This project is built for educational and portfolio purposes.

---

*Crafted with precision by [Adarsh Patil](https://github.com/Adarsh-patil-07).*
