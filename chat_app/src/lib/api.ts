// ===============================
//  API Logic (api.ts)
// ===============================

import { fetchOpenAIResponse } from "./openai";
import { fetchGeminiResponse } from "./google";

const fetchClaudeResponse = async (
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[],
  apiKey: string,
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> => {
  const url = 'https://api.anthropic.com/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2024-06-20', // APIバージョンを指定
  };

  // Claudeはsystemロールをサポート
  const anthropicMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user', // OpenAI/Claudeでrole名が異なる場合がある
    content: m.content
  }));

  const body = JSON.stringify({
    model,
    messages: anthropicMessages,
    temperature,
    max_tokens: maxTokens,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Claude API Error:', errorData);
    throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.content[0].text;
};


export const fetchLLMResponse = async (
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[],
  llmConfig: LLMConfig
): Promise<string> => {
  try {
    switch (llmConfig.model) {
      case 'gpt-4o':
      case 'o1-pro-2025-03-19':
        return await fetchOpenAIResponse(messages, llmConfig.apiKey, llmConfig.model, llmConfig.temperature, llmConfig.maxTokens);
      case 'gemini-pro':
        return await fetchGeminiResponse(messages, llmConfig.apiKey, llmConfig.model, llmConfig.temperature, llmConfig.maxTokens);
      case 'claude-3-sonnet':
        return await fetchClaudeResponse(messages, llmConfig.apiKey, llmConfig.model, llmConfig.temperature, llmConfig.maxTokens);
      default:
        throw new Error(`Unsupported LLM: ${llmConfig.model}`);
    }
  } catch (error: any) {
    // エラーハンドリングを共通化
    console.error(`Error fetching response from ${llmConfig.name}:`, error);
    throw error; // エラーを再throwして、呼び出し元で処理できるようにする
  }
};
