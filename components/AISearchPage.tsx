import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Bot } from 'lucide-react';
import { generateResponse } from '../services/gemini';
import ParticleBackground from './ParticleBackground';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AISearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Peace be upon you. I am your spiritual assistant for the "Hidden Light" project. Ask me anything about the life, character, or teachings of Prophet Muhammad ﷺ.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    const responseText = await generateResponse(query);

    const aiMessage: Message = { role: 'assistant', content: responseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative pt-6 pb-20 flex flex-col items-center">
      <ParticleBackground />
      
      <div className="relative z-10 w-full max-w-4xl px-4 flex-1 flex flex-col">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gold-500/10 rounded-full mb-4">
                <Sparkles className="text-gold-400" size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gold-100">AI Spiritual Guide</h2>
            <p className="text-slate-400 text-sm mt-2">Powered by Gemini • Knowledge from authentic sources</p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-deep-800/50 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-[600px] shadow-2xl">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl p-5 ${
                    msg.role === 'user' 
                      ? 'bg-gold-600 text-deep-900 rounded-br-none' 
                      : 'bg-white/10 text-slate-100 rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-gold-400 text-xs uppercase tracking-wider font-bold">
                        <Bot size={14} /> Hidden Light AI
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white/5 rounded-2xl rounded-bl-none p-5 flex items-center gap-3">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-slate-400">Consulting knowledge base...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-deep-900/50 border-t border-white/5">
             <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about the Prophet's patience, his family, or battles..."
                  className="flex-1 bg-deep-900 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-600"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !query.trim()}
                  className="bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-deep-900 p-3 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-gold-900/20"
                >
                  <Send size={20} />
                </button>
             </form>
             <div className="flex items-start gap-2 mt-3 text-xs text-slate-500 px-1">
                <AlertCircle size={12} className="mt-0.5" />
                <p>AI can make mistakes. Please verify important religious rulings with qualified scholars.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchPage;