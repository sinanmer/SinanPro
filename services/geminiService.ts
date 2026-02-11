
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStrongPassword = async (platform: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a highly secure, 16-character complex password for the platform: ${platform}. Return only the password string, no other text.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini password generation failed:", error);
    // Fallback locally if API fails
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
};

export const getSecurityTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Şifre güvenliği hakkında çok kısa, 1 cümlelik Türkçe bir ipucu ver.",
    });
    return response.text.trim();
  } catch (error) {
    return "Güçlü şifreler için semboller ve rakamlar kullanın.";
  }
};
