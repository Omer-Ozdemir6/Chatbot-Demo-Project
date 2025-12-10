import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      'Cevapları mutlaka gerçek markdown yeni satırlarıyla üret.Madde işaretli liste verirken her maddenin başında gerçek satır başı olmalı; "\n*" şeklinde yazmanı istemiyorum, bizzat yeni satır karakteri kullanmalısın.Aynı satırda iki madde bulunamaz, her madde kendi satırında olmalı.Listeyi tek satıra sıkıştırma.En fazla 3 cümleyle yanıt ver.'
  });

  async function sendMessage(prompt) {
    setLoading(true);
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error("Gemini API Hatası:", err);
      return "Üzgünüm, API isteği sırasında bir hata oluştu.";
    } finally {
      setLoading(false);
    }
  }

  return { sendMessage, loading };
}
