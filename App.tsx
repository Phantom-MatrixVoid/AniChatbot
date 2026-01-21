
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types';
import { getAnimeAssistantResponse } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { LoadingIndicator } from './components/LoadingIndicator';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        text: "OSS! Nakama! 🌟 I've recharged my Spirit Energy and I'm ready to help! Ask me anything about the world of Anime—from the Grand Line to the Soul Society! My knowledge is OVER 9000!! 🔥",
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.messages, state.isLoading]);

  const handleSend = async () => {
    if (!input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));
    setInput('');

    try {
      const history = state.messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const botResponseText = await getAnimeAssistantResponse(input, history);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: botResponseText,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "NANII?! A powerful Genjutsu blocked me! Check the console or API Key, Nakama!",
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4">
      {/* Main Glassmorphic Container */}
      <main className="w-full max-w-5xl h-[95vh] sm:h-[85vh] flex flex-col bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden relative">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] transform -rotate-6">
                <span className="text-3xl">🍥</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-[#1e1b4b] rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="anime-font text-2xl text-white tracking-widest leading-none">ANIME SPIRIT</h1>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.3em]">Encyclopedia 2.0</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center space-x-2">
              <span className="text-white/60 text-xs font-bold italic">POWER LEVEL:</span>
              <span className="text-orange-500 font-black anime-font">9001</span>
            </div>
          </div>
        </header>

        {/* Chat Content */}
        <section 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 space-y-4 scroll-smooth bg-black/10"
        >
          {state.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {state.isLoading && <LoadingIndicator />}
          {state.error && (
            <div className="mx-auto max-w-md p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm font-medium text-center animate-bounce">
              ❌ {state.error}
            </div>
          )}
        </section>

        {/* Footer / Input Area */}
        <footer className="p-6 bg-black/30 border-t border-white/5">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your favorite characters or series..."
                className="w-full bg-white/5 text-white placeholder-white/20 p-4 pr-12 rounded-2xl border border-white/10 outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all resize-none text-sm min-h-[58px] max-h-32"
                rows={1}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-orange-500/50 transition-colors">
                ⌨️
              </div>
            </div>
            
            <button
              onClick={handleSend}
              disabled={state.isLoading || !input.trim()}
              className="super-button w-full sm:w-auto px-10 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{state.isLoading ? 'Charging...' : 'Release! 💥'}</span>
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-6 opacity-30">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Believe it!</span>
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Plus Ultra!</span>
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Bankai!</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
