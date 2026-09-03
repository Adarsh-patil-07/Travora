import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Send, Map, Loader2, User, Plus, MessageSquare, Paperclip, Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { pageTransition } from '../lib/motion';
import { generateItinerary, sendMessageToWaylo } from '../services/ai';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../types';

export default function Assistant() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [destInput, setDestInput] = useState('');
  const [daysInput, setDaysInput] = useState('3');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destInput) return;
    
    setIsGenerating(true);
    const loadingId = toast.loading('Crafting your itinerary...');
    try {
      const data = await generateItinerary(destInput, parseInt(daysInput) || 3, '');
      toast.success('Itinerary generated!', { id: loadingId });
      navigate('/planner', { state: { itineraryData: data } });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate itinerary', { id: loadingId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
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
      // Remove the user message if it failed
      setMessages(prev => prev.filter(m => m.id !== newUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setDestInput('');
    setDaysInput('3');
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-[100dvh] pt-[76px] bg-white w-full overflow-hidden"
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
          
          <button onClick={startNewConversation} className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors mb-8 text-base font-medium">
            <span className="flex items-center gap-3"><MessageSquare size={18} className="text-gray-400" /> New conversation</span>
            <Plus size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-5">Suggested</h3>
          <ul className="space-y-5 text-base text-gray-600 font-medium">
            {['Best time to visit Japan', 'Top places to see in Kyoto', 'What to eat in Tokyo?', 'Is Tokyo expensive?'].map((item, i) => (
              <li 
                key={i} 
                onClick={() => { setInputText(item); }}
                className="flex items-center gap-3 hover:text-purple-600 cursor-pointer group"
              >
                <Sparkles size={16} className="text-purple-300 group-hover:text-purple-500 transition-colors" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative w-full max-w-full">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth">
          <div className="flex flex-col items-center max-w-3xl mx-auto w-full h-full min-h-[40vh] pt-6 md:pt-8">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full my-auto">
                {/* Mobile Centered Branding */}
                <div className="lg:hidden flex flex-col items-center mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-2 md:mb-3 shadow-sm border border-purple-100">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg md:text-xl leading-none mb-1">Waylo</h2>
                  <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-semibold">AI travel companion</p>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">Generate an Itinerary</h3>
                <p className="text-gray-500 text-sm md:text-base text-center max-w-lg leading-relaxed mb-8 md:mb-10">
                  Tell me where you want to go and how many days you have, and I'll generate a comprehensive day-by-day plan. Or, just start chatting below!
                </p>
                
                {/* Itinerary Generator Form */}
                <form onSubmit={handleGenerate} className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="mb-6">
                    <label className="block text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">Destination</label>
                    <div className="relative">
                      <Map size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={destInput}
                        onChange={e => setDestInput(e.target.value)}
                        placeholder="e.g. Paris, France" 
                        required
                        className="w-full bg-gray-50 border-none rounded-xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 text-sm md:text-base focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">Duration (Days)</label>
                    <input 
                      type="number" 
                      min="1" max="14"
                      value={daysInput}
                      onChange={e => setDaysInput(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-none rounded-xl py-3.5 md:py-4 px-5 text-sm md:text-base focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-xl py-4 md:py-4 text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <><Loader2 size={18} className="animate-spin" /> Generating Plan...</>
                    ) : (
                      <><Sparkles size={18} /> Plan My Trip</>
                    )}
                  </button>
                </form>
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

        {/* Flex-based Input Area */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 pt-4 pb-20 md:pb-6 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="bg-white border border-gray-200 rounded-3xl p-2 pl-4 pr-2 flex items-center shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Waylo anything..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1"
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
                  className="w-10 h-10 ml-1 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white flex items-center justify-center transition-colors"
                >
                  {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-1" />}
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
