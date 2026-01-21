
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 animate-pulse">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      <span className="text-white/70 font-bold italic ml-2">Charging Spirit Energy...</span>
    </div>
  );
};
