import OpenAI from "openai";

export const fetchOpenAIResponse = async (
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[],
  apiKey: string,
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> => {
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  
  const response = await openai.responses.create({
    model: model,
    input: messages,
    max_output_tokens: maxTokens,
    text: {
      "format": {
        "type": "text"
      }
    },
    tools: [],
    store: true
  });
  return response.output_text;
};
