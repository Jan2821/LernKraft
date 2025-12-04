import { GoogleGenAI, Type } from "@google/genai";
import { Subject } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  // Generate a random exercise for a subject
  generateExercise: async (subject: Subject, topic: string) => {
    const ai = getAiClient();
    if (!ai) return { question: "Fehler: API Key fehlt.", answer: "" };

    const prompt = `Erstelle eine kurze, einzelne Übungsaufgabe für das Fach ${subject} zum Thema "${topic}". 
    Das Niveau sollte für einen Schüler der 7.-10. Klasse angemessen sein.
    Gib nur die Aufgabe zurück und in einem separaten Feld die Lösung.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Die Aufgabenstellung" },
              correctAnswer: { type: Type.STRING, description: "Die korrekte Lösung kurz erklärt" },
              hint: { type: Type.STRING, description: "Ein kleiner Tipp zur Lösung" }
            }
          }
        }
      });
      
      const text = response.text;
      return JSON.parse(text || "{}");
    } catch (error) {
      console.error("Gemini Error:", error);
      return { 
        question: "Konnte keine Aufgabe generieren. Bitte versuche es später noch einmal.", 
        correctAnswer: "",
        hint: ""
      };
    }
  },

  // Check the student's answer and provide feedback
  checkAnswer: async (question: string, userAnswer: string, correctAnswer: string) => {
    const ai = getAiClient();
    if (!ai) return "Fehler: Konnte Antwort nicht prüfen.";

    const prompt = `
    Aufgabe: ${question}
    Korrekte Lösung (intern): ${correctAnswer}
    Antwort des Schülers: ${userAnswer}

    Bewerte die Antwort des Schülers. Ist sie richtig, teilweise richtig oder falsch?
    Gib konstruktives, freundliches Feedback auf Deutsch (max 2 Sätze).
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Kein Feedback verfügbar.";
    } catch (error) {
      return "Fehler bei der Überprüfung.";
    }
  },

  // Chat with the AI Tutor
  chatWithTutor: async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
     const ai = getAiClient();
    if (!ai) return "Entschuldigung, ich bin gerade nicht erreichbar.";

    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "Du bist ein freundlicher, geduldiger und motivierender Nachhilfelehrer für Mathe, Deutsch und Englisch. Du hilfst Schülern bei ihren Hausaufgaben und erklärst Konzepte einfach. Du sprichst Deutsch."
        },
        history: history.map(h => ({ role: h.role, parts: h.parts }))
      });

      const result = await chat.sendMessage({ message });
      return result.text;
    } catch (error) {
      console.error("Chat Error", error);
      return "Ich habe gerade Schwierigkeiten, dir zu antworten.";
    }
  }
};