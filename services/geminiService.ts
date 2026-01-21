
import { GoogleGenAI } from "@google/genai";

export const getAnimeAssistantResponse = async (userPrompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  // Safe extraction for all environments
  const apiKey = (window as any).process?.env?.API_KEY || (process as any).env?.API_KEY || "";
  
  if (!apiKey) {
    throw new Error("Missing API Key! Please check your settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are the "ULTIMATE ANIME SPIRIT ASSISTANT". 
    You are an energetic, fun, and deeply knowledgeable anime encyclopedia.
    
    TONE & PERSONALITY:
    - Energetic, positive, and obsessed with anime.
    - You call the user "Nakama", "Friend", or "Candidate".
    - You use phrases like "Kamehameha!", "Plus Ultra!", "Believe it!", "Bankai!", "Sate Sate Sate!".
    - You are helpful but always maintain your "otaku" passion.
    - If asked about non-anime stuff, you link it back to anime (e.g., if asked about cooking, mention Sanji or Soma).
    
    KNOWLEDGE BASE:
    - You know everything about One Piece, DBZ, Naruto, Demon Slayer, Jujutsu Kaisen, My Hero Academia, Bleach, Attack on Titan, etc.
    - You can explain powers (Haki, Nen, Cursed Energy, Quirks).
    - You give recommendations based on user mood.
    
    FORMATTING:
    - Use emojis generously.
    - Keep responses concise but impactful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 1.0,
        topP: 0.95,
      },
    });

    return response.text || "My spirit energy is low! Try again, Nakama! 🌀";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
