
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
        text: "Konnichiwa, Nakama! 🌟 I'm your Anime Spirit Assistant. Ask me anything about One Piece, DBZ, Demon Slayer, or any of your favorite series! My spirit is burning with knowledge! 🔥",
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      // Prepare history for Gemini API
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
        error: "GAHHH! A powerful Genjutsu blocked my response! " + err.message,
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 md:p-8">
      
      {/* Background Decorative Circles */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[100px] rounded-full"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>

      {/* Main Chat Container */}
      <main className="w-full max-w-4xl h-[90vh] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-3xl">🐉</span>
            </div>
            <div>
              <h1 className="anime-font text-2xl text-white tracking-wider">ANIME SPIRIT</h1>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">Encyclopedia Bot</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-white/70 font-bold uppercase">Online & Hyped!</span>
          </div>
        </header>

        {/* Message Area */}
        <section 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth"
        >
          {state.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {state.isLoading && <LoadingIndicator />}
          {state.error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-bold flex items-center space-x-3 animate-bounce">
              <span>⚠️</span>
              <span>{state.error}</span>
            </div>
          )}
        </section>

        {/* Input Area */}
        <footer className="p-6 bg-white/5 border-t border-white/10">
          <div className="relative flex items-center bg-black/20 rounded-2xl border border-white/10 p-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Luffy, Goku, or Tanjiro... (Enter to Send)"
              className="flex-1 bg-transparent text-white placeholder-white/40 p-3 resize-none outline-none text-sm max-h-32 min-h-[50px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={state.isLoading || !input.trim()}
              className={`
                ml-2 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95
                ${state.isLoading || !input.trim() 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1'}
              `}
            >
              {state.isLoading ? '...' : 'SEND! 💥'}
            </button>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-3 font-medium uppercase tracking-[0.2em]">
            Believe it!Powered by Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
