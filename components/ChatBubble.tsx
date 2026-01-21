
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // DBZ-inspired Orange for User, Demon Slayer-inspired Green/Purple for Bot
  const bubbleStyles = isUser 
    ? "bg-orange-500 text-white rounded-br-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" 
    : "bg-emerald-500 text-white rounded-bl-none shadow-[-4px_4px_0px_0px_rgba(0,0,0,0.3)]";

  const containerStyles = isUser 
    ? "flex-row-reverse text-right" 
    : "flex-row text-left";

  return (
    <div className={`flex w-full mb-6 items-end space-x-2 ${containerStyles} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar Placeholder */}
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white shadow-md ${isUser ? 'bg-blue-600 ml-2' : 'bg-pink-500 mr-2'}`}>
        <span className="text-xl">{isUser ? '👤' : '🤖'}</span>
      </div>

      <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl relative ${bubbleStyles}`}>
        {/* Label */}
        <p className="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest">
          {isUser ? 'You (Nakama)' : 'Anime Spirit'}
        </p>
        
        {/* Message Content */}
        <div className="whitespace-pre-wrap leading-relaxed font-medium">
          {message.text}
        </div>

        {/* Timestamp */}
        <p className="text-[9px] mt-2 opacity-60">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Decorative "Speech Bubble" tail via CSS classes is tricky, using a simpler approach for stability */}
      </div>
    </div>
  );
};
