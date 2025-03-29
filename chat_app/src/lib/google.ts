import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export const fetchGeminiResponse = async (
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[],
  apiKey: string,
  modelName: string,
  temperature: number,
  maxTokens: number
): Promise<string> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const generationConfig = {
    temperature: temperature,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: maxTokens,
    responseModalities: [],
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: messages,
  });

  const result = await chatSession.sendMessage(messages[messages.length - 1].content);
  const candidates = result.response.candidates;

  // 結果をコンソールに表示
  candidates.forEach((candidate, candidateIndex) => {
    candidate.content.parts.forEach((part, partIndex) => {
      if (part.inlineData) {
        console.log(`Candidate ${candidateIndex}, Part ${partIndex}:`, part.inlineData.data);
      }
    });
  });
  return result.response.text();
};