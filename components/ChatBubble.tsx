
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // UI Colors for different roles
  const bubbleBg = isUser 
    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_16px_rgba(249,115,22,0.2)]" 
    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_8px_16px_rgba(99,102,241,0.2)]";

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex items-start max-w-[85%] md:max-w-[70%] space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-white/20 shadow-lg ${isUser ? 'bg-orange-400' : 'bg-indigo-400'} mt-1`}>
          <span className="text-xl">{isUser ? '⚡' : '🔥'}</span>
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-4 rounded-3xl ${bubbleBg}`}>
          {/* Role Header */}
          <div className="flex items-center justify-between mb-1 space-x-4">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
              {isUser ? 'Nakama' : 'Spirit Assistant'}
            </span>
          </div>

          {/* Text Content */}
          <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
            {message.text}
          </div>

          {/* Timestamp */}
          <div className={`text-[8px] mt-2 opacity-60 font-bold ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {/* Custom Tail SVG */}
          <div className={`absolute bottom-[-2px] w-4 h-4 ${isUser ? 'right-4' : 'left-4'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={isUser ? "M16 0L16 16L0 0H16Z" : "M0 0V16L16 0H0Z"} fill="currentColor" className={isUser ? 'text-orange-600' : 'text-purple-600'} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
