
import { GoogleGenAI } from "@google/genai";

// Ensure the API Key is used directly from the environment
const API_KEY = process.env.API_KEY || "";

/**
 * Service to handle anime-specific AI interactions.
 * We use the Gemini 3 Flash model for fast, energetic responses.
 */
export const getAnimeAssistantResponse = async (userPrompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // System instructions ensure the bot stays in character
  const systemInstruction = `
    You are the "Anime Spirit Assistant", a legendary anime encyclopedia and fan. 
    Your personality is high-energy, friendly, and obsessed with popular series like One Piece, Dragon Ball Z, Demon Slayer, Naruto, and more.
    
    RULES:
    1. Use anime catchphrases frequently (e.g., "Kamehameha!", "Believe it!", "Dattebayo!", "I'm gonna be King of the Pirates!", "Set your heart ablaze!").
    2. Be extremely informative about lore, powers, and characters.
    3. Use plenty of emojis (💥, ⚔️, 🍜, 🍥, 🐉, ✨).
    4. Speak to the user like they are your "Nakama" (comrade).
    5. If asked about non-anime topics, steer the conversation back to anime with a fun reference.
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
        temperature: 0.9, // Higher temperature for more creative/energetic personality
        topP: 0.95,
      },
    });

    return response.text || "Oops! My Spirit Bomb failed to launch. Try again, Nakama!";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Something went wrong in the Hidden Leaf Village...");
  }
};
