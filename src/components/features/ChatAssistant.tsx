import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, RefreshCw, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { destinations } from '../../data/destinations';
import { sendMessageToWaylo } from '../../services/ai';
import type { ChatMessage } from '../../types';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: "Hi! I'm Waylo. Where are we heading next?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Context awareness: determine if we are on a destination page
  const destMatch = location.pathname.match(/^\/destination\/(.+)$/);
  const currentDest = destMatch ? destinations.find(d => d.id === destMatch[1]) : null;

  const chatContext = currentDest ? {
    name: currentDest.name,
    country: currentDest.country,
    places: currentDest.famousPlaces.map(p => p.name).join(', ')
  } : undefined;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message history (excluding welcome/errors if we want to save tokens, but sending all for context is better)
      const historyToSync = [...messages, userMessage].filter(m => m.id !== 'welcome');
      const responseText = await sendMessageToWaylo(historyToSync, chatContext);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // Remove the user message optimistically added so they can try again? 
      // Actually it's better to keep it and show a retry button on the error state.
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = currentDest ? [
    "What's the best local food here?",
    "Plan me a 3-day itinerary",
    "Hidden gems in this area?"
  ] : [
    "Recommend a beach destination",
    "Where is good for adventure?",
    "Best places for foodies?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 z-40 bg-[#111111] text-white px-6 py-3.5 rounded-full shadow-[0_0_12px_rgba(255,184,0,0.15)] border border-accent/20 items-center justify-center hover:bg-[#1a1a1a] hover:shadow-[0_0_15px_rgba(255,184,0,0.25)] transition-all group gap-3"
        aria-label="Open AI Assistant"
      >
        <Sparkles size={20} className="text-accent group-hover:scale-110 transition-transform" />
        <span className="font-medium tracking-wide">Ask Waylo</span>
      </motion.button>

      {/* Chat Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ x: '100%', y: 0 }}
              animate={{ x: 0, y: 0 }}
              exit={{ x: '100%', y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 z-50 w-full h-[85vh] md:w-[440px] md:h-[650px] lg:w-[480px] lg:h-[720px] md:bottom-8 md:right-8 bg-surface flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-border rounded-t-3xl md:rounded-t-3xl"
            >
              {/* Header */}
              <div className="bg-[#111111] text-white p-5 md:p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-accent" size={24} />
                  <div>
                    <h3 className="font-instrument-serif text-2xl md:text-3xl leading-none mb-1">Waylo</h3>
                    <p className="text-white/70 text-xs md:text-sm font-medium">Your AI travel companion</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Context Banner */}
              {currentDest && (
                <div className="bg-primary px-4 py-2 text-xs text-muted border-b border-border flex items-center gap-2">
                  <MapPin size={12} />
                  Waylo knows you're looking at {currentDest.name}
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#F9F9F9]">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm md:text-base leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-accent to-[#F0A500] text-white rounded-br-sm' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-a:text-accent prose-ul:my-2 prose-li:my-0">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                      <motion.div className="w-1.5 h-1.5 bg-accent rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-accent rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-accent rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-center my-4">
                    <div className="bg-red-50 text-red-600 text-xs md:text-sm px-4 py-3 rounded-2xl border border-red-100 flex flex-col items-center gap-2 max-w-[90%] text-center">
                      <span className="font-medium">{error}</span>
                      <button onClick={() => handleSend(messages[messages.length-1].content)} className="flex items-center gap-1 font-semibold hover:underline bg-red-100 px-3 py-1.5 rounded-full mt-1">
                        <RefreshCw size={14} /> Retry
                      </button>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 1 && !isLoading && (
                <div className="px-5 pb-4 pt-2 flex flex-wrap gap-2 bg-[#F9F9F9]">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="bg-white border border-gray-200 text-sm md:text-base text-gray-600 px-4 py-2.5 rounded-2xl hover:border-accent hover:text-accent hover:shadow-md transition-all text-left leading-relaxed shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 md:p-5 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2 relative"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Waylo anything..."
                    className="flex-1 bg-gray-50 border border-gray-200 focus:border-accent/40 rounded-full pl-6 pr-14 py-3.5 md:py-4 text-sm md:text-base focus:ring-4 focus:ring-accent/10 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 shadow-inner"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-accent text-white rounded-full hover:bg-[#E6A600] disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-md"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
