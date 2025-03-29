 "use server";

import { fetchLLMResponse } from "@/lib/api";

export const startTeamDiscussionAction = async (
    userInput: string,
    initialMessages: { role: 'user' | 'system' | 'assistant'; content: string }[],
    llmConfigs: any[],
    MANAGER_CONFIG: any
) => {
    try {
        const managerResponse = await fetchLLMResponse(initialMessages, MANAGER_CONFIG);

        const memberMessages = [
            ...initialMessages,
            { role: 'assistant', content: managerResponse },
            {
                role: 'system',
                content:
                    'あなたはチームメンバーです。マネージャーの指示に従い、議論に参加してください。\n' +
                    '自分の名前を名乗り、日本語で発言してください。'
            },
        ];

        const memberResponses = await Promise.all(
            llmConfigs.map(async (llmConfig) => {
                try {
                    const response = await fetchLLMResponse(memberMessages, llmConfig);
                    return { name: llmConfig.name, response };
                } catch (error) {
                    return { name: llmConfig.name, response: `[${llmConfig.name} エラー]: ${(error as Error).message}` };
                }
            })
        );

        const finalSummaryMessages = [
            ...initialMessages,
            { role: 'assistant', content: managerResponse },
            ...memberResponses.map(res => ({ role: 'assistant', content: res.response })),
            {
                role: 'system',
                content: 'これまでの議論をまとめ、最終的な結論と議事録を日本語で提示してください。'
            }
        ];
        const finalManagerResponse = await fetchLLMResponse(finalSummaryMessages, MANAGER_CONFIG);

        return {
            managerResponse,
            memberResponses,
            finalManagerResponse
        };
    } catch (error: any) {
        console.error("Server Action Error:", error);
        throw new Error(error.message);
    }
};