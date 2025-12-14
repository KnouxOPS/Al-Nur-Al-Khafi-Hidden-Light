import { GoogleGenAI } from "@google/genai";

// Note: In production, API keys should be handled via backend proxy or securely
const apiKey = import.meta.env.VITE_AI_API_KEY || '';

// System instruction to guide the model
const SYSTEM_INSTRUCTION = `
You are a knowledgeable, respectful, and spiritual assistant dedicated to the "Hidden Light" project.
Your purpose is to provide accurate information about the life, teachings, and character of Prophet Muhammad ﷺ.
Always maintain a tone of high respect. Use "ﷺ" (Peace Be Upon Him) after mentioning the Prophet's name.
Base your answers on authentic sources (Quran and Sahih Hadith) where possible.
If asked about controversial topics, answer with wisdom, historical context, and balance.
Your responses should be concise but profound, suitable for a general audience including non-Muslims.
Do not engage in political debates or sectarian arguments. Focus on the universal values of mercy, ethics, and spirituality.
`;

let aiClient = null;

const getClient = () => {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("API Key is missing. AI features will not work.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateResponse = async (prompt) => {
  if (!apiKey) {
    return "Please configure the VITE_AI_API_KEY in your environment to use the AI features.";
  }

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I could not generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the knowledge base. Please try again later.";
  }
};