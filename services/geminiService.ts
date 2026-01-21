
import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle anime-specific AI interactions.
 * Uses the Gemini 3 Flash model for fast, energetic responses.
 */
export const getAnimeAssistantResponse = async (userPrompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  // Use the API key provided by the environment
  const apiKey = process.env.API_KEY || "";
  
  if (!apiKey) {
    throw new Error("API Key is missing! Please make sure your environment is configured correctly, Nakama!");
  }

  // Create a fresh instance for the request
  const ai = new GoogleGenAI({ apiKey });
  
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
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const text = response.text;
    return text || "My Spirit Bomb failed to launch! My energy is low, please try again! ☄️";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide user-friendly anime-themed error feedback
    const message = error.message || "";
    if (message.includes("401") || message.includes("403")) {
      return "GAHHH! My Chakra is blocked! (Invalid or missing API Key) 🛑";
    }
    if (message.includes("429")) {
      return "Too much power! I need to rest my eyes like Kakashi. (Rate limit reached) 💤";
    }
    
    throw new Error("Something went wrong in the Grand Line... Check the console for clues!");
  }
};
