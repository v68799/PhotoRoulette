
import { GoogleGenAI } from "@google/genai";

// Gebruik altijd de Gemini 3 Flash voor snelle, efficiënte tekst- en beeldtaken
const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeSnap = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Beschrijf kort wat er op deze foto staat in één korte, poëtische zin in het Nederlands. Noem de sfeer van de plek." }
        ]
      },
      config: {
        maxOutputTokens: 60,
      }
    });
    return response.text || "Een prachtig moment ergens ter wereld.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Moment vastgelegd op de wereldkaart.";
  }
};

export const getCityName = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Welke stad of regio hoort bij de coördinaten ${lat}, ${lng}? Antwoord met alleen de stad en het land in het Nederlands.`
    });
    return response.text?.trim() || "Onbekende Locatie";
  } catch {
    return "Wereldlocatie";
  }
};
