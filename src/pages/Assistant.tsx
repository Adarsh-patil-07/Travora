import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Loader2, User, Plus, Compass, MapPin, Coffee, Utensils
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { pageTransition } from '../lib/motion';
import { sendMessageToWaylo } from '../services/ai';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../types';

const SUGGESTED_PROMPTS = [
  { icon: MapPin, text: 'Top 5 hidden gems in Tokyo' },
  { icon: Compass, text: 'Best time to visit Bali and what to pack' },
  { icon: Utensils, text: 'Must-try street foods in Rome' },
  { icon: Coffee, text: 'Cute cafes and vintage spots in Paris' },
];

export default function Assistant() {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect virtual keyboard open/close via visualViewport API
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const keyboardOpen = viewport.height < window.innerHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
    };

    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : inputText.trim();
    if (!query || isSending) return;

    // Blur input on mobile to dismiss keyboard after sending
    if (window.innerWidth < 768) {
      inputRef.current?.blur();
    }

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const responseText = await sendMessageToWaylo(
        [...messages, newUserMsg],
        { currency: `${currency.name}` }
      );
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
      setMessages(prev => prev.filter(m => m.id !== newUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setInputText('');
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-[100svh] pt-16 md:pt-20 bg-[#FAFAF7] w-full overflow-hidden"
    >
      {/* LEFT SIDEBAR - Unified with #FAFAF7 page background */}
      <div className="hidden lg:flex flex-col w-[320px] xl:w-[350px] bg-[#FAFAF7] border-r border-gray-200/70 h-full flex-shrink-0 overflow-y-auto no-scrollbar">
        <div className="pl-8 lg:pl-12 pr-6 pt-6 pb-2">
          <h4 className="text-[11px] font-bold tracking-widest text-[#5538EE] uppercase mb-4">AI Assistant</h4>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs border border-purple-200/60">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Waylo</h2>
              <p className="text-xs text-gray-500">Your AI travel companion</p>
            </div>
          </div>
          
          {/* Compact, neatly proportioned New Conversation Button */}
          <button 
            onClick={startNewConversation} 
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200/80 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all mb-4 text-xs font-semibold text-gray-700 cursor-pointer shadow-2xs group"
          >
            <Plus size={14} className="text-purple-600 group-hover:rotate-90 transition-transform duration-200" />
            <span>New conversation</span>
          </button>
        </div>

        <div className="pl-8 lg:pl-12 pr-6 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3.5">Suggested Topics</h3>
          <ul className="space-y-1.5 text-gray-700 font-medium text-sm">
            {['Best time to visit Japan', 'Top places to see in Kyoto', 'What to eat in Tokyo?', 'Is Tokyo expensive?', 'Packing tips for tropical trips'].map((item, i) => (
              <li 
                key={i} 
                onClick={() => { handleSendMessage(item); }}
                className="flex items-center gap-3 hover:text-[#5538EE] cursor-pointer group p-2 rounded-xl hover:bg-white transition-all shadow-2xs/0 hover:shadow-2xs"
              >
                <Sparkles size={16} className="text-purple-400 group-hover:text-purple-600 group-hover:scale-110 transition-all shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#FAFAF7] relative w-full max-w-full">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar scroll-smooth">
          <div className="flex flex-col items-center max-w-2xl mx-auto w-full h-full pt-2 md:pt-4">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full flex-1 my-auto text-center px-4 py-6">
                {/* Branding Avatar */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center text-purple-600 mb-3 md:mb-4 shadow-xs border border-purple-100">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2 tracking-tight">
                  Where would you like to go?
                </h2>
                <p className="text-gray-500 text-xs md:text-sm max-w-md mb-6 md:mb-8 leading-relaxed">
                  I'm Waylo, your personal AI travel assistant. Ask me for destination recommendations, local food spots, travel tips, or packing advice.
                </p>

                {/* Suggested prompt chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                  {SUGGESTED_PROMPTS.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200/80 bg-white hover:bg-purple-50/50 hover:border-purple-200 text-left transition-all group cursor-pointer shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                          <Icon size={14} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-purple-900 line-clamp-1">
                          {prompt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-4 pb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2.5 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-2xs">
                          {msg.role === 'user' ? (
                            user?.photoURL ? (
                              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-purple-100 to-indigo-100 text-[#5538EE] font-bold text-xs flex items-center justify-center">
                                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={15} />}
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#5538EE] to-[#8C65F7] text-white flex items-center justify-center">
                              <Sparkles size={14} className="text-amber-300" />
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'text-[13.5px] md:text-sm bg-[#5538EE] text-white rounded-tr-xs shadow-xs font-medium' : 'text-[13.5px] md:text-sm bg-white border border-gray-200/80 shadow-xs text-gray-800 rounded-tl-xs leading-relaxed'}`}>
                          {msg.role === 'user' ? (
                            msg.content
                          ) : (
                            <div className="prose prose-sm max-w-none text-[13.5px] md:text-sm leading-relaxed prose-p:my-1.5 prose-p:leading-relaxed prose-headings:my-2 prose-headings:text-sm md:prose-headings:text-base prose-headings:font-bold prose-strong:text-gray-900 prose-a:text-purple-600 prose-ul:my-1 prose-li:my-0.5">
                              <ReactMarkdown>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isSending && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                      <div className="flex gap-2.5 max-w-[85%] md:max-w-[75%]">
                        <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-purple-100 text-purple-600">
                          <Sparkles size={15} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200/80 shadow-xs text-gray-800 rounded-tl-xs flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
            
          </div>
        </div>

        {/* Input Area */}
        <div className={`flex-shrink-0 bg-[#FAFAF7] border-t border-gray-200/60 pt-3 px-3 md:px-6 transition-[padding] duration-200 ${isKeyboardOpen ? 'pb-2' : 'pb-[4.5rem] md:pb-4'}`}>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-1.5 pl-4 pr-1.5 flex items-center shadow-xs focus-within:border-purple-500 focus-within:shadow-sm transition-all">
              <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Waylo anything..." 
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs md:text-sm text-gray-800 placeholder:text-gray-400 py-1.5 min-w-0"
                disabled={isSending}
              />
              <div className="flex items-center shrink-0">
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isSending}
                  className="w-8 h-8 md:w-9 md:h-9 ml-1 rounded-xl bg-[#5538EE] hover:bg-[#4A2699] disabled:bg-gray-300 disabled:text-gray-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                >
                  {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="ml-0.5" />}
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-2 hidden md:block">
              Waylo can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
