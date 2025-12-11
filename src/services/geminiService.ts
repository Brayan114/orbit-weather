import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const apiKey = (import.meta.env?.VITE_API_KEY as string) || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getRealtimeWeather = async (city: string): Promise<WeatherData | null> => {
  if (!ai) {
    console.error("API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the current weather and the 5-day forecast for ${city}.
      
      CRITICAL: You must output ONLY a valid JSON object. Do not include Markdown formatting (like \`\`\`json).
      
      The JSON must match this structure exactly:
      {
        "city": "City Name, Country Code",
        "temp": number (current temperature in Celsius),
        "condition": "string (one of exactly: 'sun', 'cloud', 'rain', 'storm', 'snow')",
        "high": number (today's high in Celsius),
        "low": number (today's low in Celsius),
        "humidity": number (percentage),
        "windSpeed": number (km/h),
        "description": "string (A short, witty, space-themed or futuristic one-sentence description of the weather. Max 15 words.)",
        "forecast": [
          { 
            "day": "string (Short day name, e.g., 'Mon')", 
            "temp": number (avg temp in Celsius), 
            "icon": "string (one of: 'sun', 'cloud', 'rain', 'storm', 'snow')" 
          }
          // ... 5 days total
        ]
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType/responseSchema are NOT allowed with googleSearch, 
        // so we rely on the prompt to enforce JSON structure.
      },
    });

    const text = response.text || "";

    // Clean up potential markdown code blocks if the model ignores the "no markdown" rule
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

    const data = JSON.parse(jsonString) as WeatherData;
    return data;

  } catch (error) {
    console.error("Weather Fetch Error:", error);
    return null;
  }
};