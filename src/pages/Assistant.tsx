import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Loader2, User, Plus, MessageSquare, Paperclip, Image as ImageIcon, Compass, MapPin, Coffee, Utensils
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { pageTransition } from '../lib/motion';
import { sendMessageToWaylo } from '../services/ai';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../types';

const SUGGESTED_PROMPTS = [
  { icon: MapPin, text: 'Top 5 hidden gems in Tokyo' },
  { icon: Compass, text: 'Best time to visit Bali and what to pack' },
  { icon: Utensils, text: 'Must-try street foods in Rome' },
  { icon: Coffee, text: 'Cute cafes and vintage spots in Paris' },
];

export default function Assistant() {
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
      const responseText = await sendMessageToWaylo([...messages, newUserMsg]);
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
      className="flex h-[100svh] pt-[76px] bg-white w-full overflow-hidden"
    >
      {/* LEFT SIDEBAR */}
      <div className="hidden lg:flex flex-col w-[360px] bg-[#FCFCFD] border-r border-gray-100 h-full flex-shrink-0 overflow-y-auto no-scrollbar">
        <div className="p-8 pb-4">
          <h4 className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-5">AI Assistant</h4>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">Waylo</h2>
              <p className="text-sm text-gray-500">Your AI travel companion</p>
            </div>
          </div>
          
        </div>

        <div className="px-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-5">Suggested Topics</h3>
          <ul className="space-y-4 text-base text-gray-600 font-medium">
            {['Best time to visit Japan', 'Top places to see in Kyoto', 'What to eat in Tokyo?', 'Is Tokyo expensive?', 'Packing tips for tropical trips'].map((item, i) => (
              <li 
                key={i} 
                onClick={() => { handleSendMessage(item); }}
                className="flex items-center gap-3 hover:text-purple-600 cursor-pointer group text-sm"
              >
                <Sparkles size={16} className="text-purple-300 group-hover:text-purple-500 transition-colors shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative w-full max-w-full">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth">
          <div className="flex flex-col items-center max-w-3xl mx-auto w-full h-full pt-4 md:pt-8">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full flex-1 my-auto text-center px-4">
                {/* Branding Avatar */}
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 md:mb-6 shadow-sm border border-purple-100">
                  <Sparkles className="w-7 h-7 md:w-10 md:h-10" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight">
                  Where would you like to go?
                </h2>
                <p className="text-gray-500 text-xs md:text-base max-w-md mb-8 md:mb-10 leading-relaxed">
                  I'm Waylo, your personal AI travel assistant. Ask me for destination recommendations, local food spots, travel tips, or packing advice.
                </p>

                {/* Suggested prompt chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 w-full max-w-lg">
                  {SUGGESTED_PROMPTS.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-purple-50/50 hover:border-purple-200 text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-purple-900 line-clamp-1">
                          {prompt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-6 pb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-600'}`}>
                          {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm md:text-base ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-tr-sm' : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'}`}>
                          {msg.role === 'user' ? (
                            msg.content
                          ) : (
                            <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-a:text-purple-600 prose-ul:my-2 prose-li:my-0">
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
                      <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-purple-100 text-purple-600">
                          <Sparkles size={18} />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
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

        {/* Input Area — sticks above bottom nav, collapses padding when keyboard is open */}
        <div className={`flex-shrink-0 bg-white border-t border-gray-100 pt-3 md:pt-4 px-3 md:px-8 transition-[padding] duration-200 ${isKeyboardOpen ? 'pb-2' : 'pb-[4.5rem] md:pb-6'}`}>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-1.5 md:p-2 pl-3 md:pl-4 pr-1.5 md:pr-2 flex items-center shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
              <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Waylo anything..." 
                className="flex-1 bg-transparent border-none outline-none text-base text-gray-700 placeholder:text-gray-400 py-1 min-w-0"
                disabled={isSending}
              />
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 hidden sm:block">
                  <Paperclip size={18} />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 hidden sm:block">
                  <ImageIcon size={18} />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isSending}
                  className="w-9 h-9 md:w-10 md:h-10 ml-1 rounded-xl md:rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white flex items-center justify-center transition-colors"
                >
                  {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-3 hidden md:block">
              Waylo can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
