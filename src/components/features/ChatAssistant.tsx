import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, RefreshCw, MapPin, ArrowRight, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { destinations } from '../../data/destinations';
import { sendMessageToWaylo } from '../../services/ai';
import { useAuth } from '../../contexts/AuthContext';
import type { ChatMessage } from '../../types';

export default function ChatAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : null;

  const welcomeContent = `Hey ${firstName ? firstName : 'there'}! 👋 I'm **Waylo**, your personal AI travel companion.

Ask me for **custom itineraries**, **hidden gems**, **local food spots**, or travel tips across the globe! ✈️`;

  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: welcomeContent,
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

  const handleResetConversation = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeContent,
      timestamp: new Date()
    }]);
    setInput('');
    setError(null);
  };

  const handleSend = async (text: string = input) => {
    const messageToSend = text.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = currentDest ? [
    { text: `Best local food in ${currentDest.name}`, emoji: '🍜' },
    { text: `Plan a 3-day itinerary for ${currentDest.name}`, emoji: '🗺️' },
    { text: `Top hidden gems around ${currentDest.name}`, emoji: '💎' },
    { text: `Best photo spots in ${currentDest.name}`, emoji: '📸' }
  ] : [
    { text: 'Plan a 3-day trip to Bali', emoji: '🏝️' },
    { text: 'Top hidden gems in Tokyo', emoji: '🌸' },
    { text: 'Best street food spots in Rome', emoji: '🍝' },
    { text: 'Budget-friendly European destinations', emoji: '🎒' }
  ];

  return (
    <>
      {/* Floating Action Button - Advanced Glassmorphism with Brand Gradient & Ambient Glow */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[#5538EE]/20 rounded-full blur-md scale-110 pointer-events-none" />

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className="relative bg-white/95 hover:bg-white backdrop-blur-xl text-gray-900 pl-2.5 pr-4 py-2 rounded-full shadow-[0_8px_32px_rgba(85,56,238,0.22),0_2px_8px_rgba(0,0,0,0.06)] border border-purple-200/90 hover:border-purple-400/80 transition-all duration-300 group flex items-center gap-2.5 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          {/* Glowing Gradient Avatar with Gold Shimmer */}
          <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-[#5538EE] to-[#8C65F7] flex items-center justify-center text-white shadow-xs group-hover:shadow-[0_0_12px_rgba(85,56,238,0.5)] transition-shadow">
            <Sparkles size={13} className="text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
          </div>

          <span className="font-bold text-xs tracking-tight text-gray-900 pr-1">
            Ask Waylo
          </span>
        </motion.button>
      </div>

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
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Chat Window - Light, Clean, Website-Matching Theme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-0 right-0 z-50 w-full h-[85vh] md:w-[370px] md:h-[540px] lg:w-[380px] lg:h-[560px] md:bottom-6 md:right-6 bg-white text-gray-900 flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/80 rounded-t-3xl"
            >
              {/* Header */}
              <div className="bg-white px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Waylo Avatar with Online Status */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5538EE] to-[#8C65F7] flex items-center justify-center text-white shadow-xs">
                      <Sparkles size={16} className="text-amber-300" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm leading-tight text-gray-900">Waylo</h3>
                      <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase">
                        AI
                      </span>
                    </div>
                    <p className="text-emerald-600 text-[10px] font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleResetConversation}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    title="Restart conversation"
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Context Banner */}
              {currentDest && (
                <div className="bg-purple-50 px-3.5 py-1.5 text-[11px] text-purple-700 border-b border-purple-100 flex items-center gap-1.5 font-medium">
                  <MapPin size={12} className="shrink-0 text-purple-600" />
                  <span className="truncate">Context: Looking at {currentDest.name}</span>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF7] no-scrollbar">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5538EE] to-[#8C65F7] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                        <Sparkles size={13} className="text-amber-300" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#5538EE] text-white rounded-tr-xs shadow-xs font-medium' 
                          : 'bg-white text-gray-800 border border-gray-100 shadow-xs rounded-tl-xs'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div className="prose prose-xs max-w-none prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-purple-600 prose-ul:my-1 prose-li:my-0">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={13} />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5538EE] to-[#8C65F7] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Sparkles size={13} className="text-amber-300" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs flex gap-1 items-center">
                      <motion.div className="w-1.5 h-1.5 bg-purple-500 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-purple-500 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-purple-500 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-center my-2">
                    <div className="bg-red-50 text-red-700 text-[11px] px-3 py-2 rounded-xl border border-red-100 flex items-center justify-between gap-2 w-full">
                      <span className="truncate">{error}</span>
                      <button onClick={() => handleSend(messages[messages.length-1].content)} className="flex items-center gap-1 font-semibold text-red-700 hover:underline shrink-0">
                        <RefreshCw size={12} /> Retry
                      </button>
                    </div>
                  </div>
                )}

                {/* SUGGESTED QUESTIONS (Shown when on welcome state) */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-0.5">
                      Suggested Questions
                    </p>
                    <div className="space-y-1.5">
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q.text)}
                          className="w-full bg-white hover:bg-purple-50/60 border border-gray-200/80 hover:border-purple-300 text-gray-800 hover:text-purple-950 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs font-medium cursor-pointer transition-all text-left group shadow-2xs"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span>{q.text}</span>
                            <span className="text-xs">{q.emoji}</span>
                          </span>
                          <ArrowRight size={13} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2 relative"
                >
                  <div className="flex-1 bg-gray-50 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white rounded-2xl flex items-center px-3.5 py-1 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Waylo anything..."
                      className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400 py-1.5"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 flex items-center justify-center bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-xl disabled:opacity-40 transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    <Send size={13} className="ml-0.5" />
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
