"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Users,
    Cpu,
    Send,
    Loader2,
    AlertTriangle,
    Settings,
    GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material'; // MUIのTextFieldをインポート
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchLLMResponse } from '@/lib/api';

import { startTeamDiscussionAction } from '@/lib/actions';

// ===============================
//  型定義
// ===============================

interface Message {
    id: string;
    role: 'user' | 'manager' | 'member';
    content: string;
    sender?: string;
    timestamp: number;
}

interface LLMConfig {
    name: string;
    model: string;
    apiKey: string;
    temperature: number;
    maxTokens: number;
}

// ===============================
//  定数
// ===============================

const O1_API_KEY = process.env.NEXT_PUBLIC_O1_API_KEY || 'sk-O1-API-KEY';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'gemini-api-key';
const SONNET_API_KEY = process.env.NEXT_PUBLIC_SONNET_API_KEY || 'sonnet-api-key';
const FOUR_API_KEY = process.env.NEXT_PUBLIC_FOUR_API_KEY || 'four-api-key';

const llmConfigs: LLMConfig[] = [
    { name: '4o', model: 'gpt-4o', apiKey: FOUR_API_KEY, temperature: 0.7, maxTokens: 2000 },
    { name: 'Gemini', model: 'gemini-2.0-flash', apiKey: GEMINI_API_KEY, temperature: 0.7, maxTokens: 2000 },
    { name: 'Sonnet', model: 'claude-3-sonnet', apiKey: SONNET_API_KEY, temperature: 0.7, maxTokens: 2000 },
];

const MANAGER_CONFIG = { name: 'O1', model: 'gpt-4o', apiKey: O1_API_KEY, temperature: 0.2, maxTokens: 2000 };


// ===============================
//  UI Components (components/ui.ts)
// ===============================

const ChatMessage: React.FC<Message> = ({ role, content, sender, timestamp }) => {
    // ... (前のコードと同じ)
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'user':
                return <Users className="w-4 h-4 mr-1 text-blue-500" />;
            case 'manager':
                return <Cpu className="w-4 h-4 mr-1 text-purple-500" />;
            case 'member':
                return <Cpu className="w-4 h-4 mr-1 text-green-500" />;
            default:
                return null;
        }
    };

    const getSenderBadge = (sender?: string) => {
        if (!sender) return null;
        let color = 'bg-gray-500 text-white';
        switch (sender) {
            case '4o':
                color = 'bg-blue-500 text-white';
                break;
            case 'Gemini':
                color = 'bg-green-500 text-white';
                break;
            case 'Sonnet':
                color = 'bg-purple-500 text-white';
                break;
            case 'DeepSeek':
                color = 'bg-yellow-500 text-white';
                break;
            case 'O1':
                color = 'bg-pink-500 text-white';
                break;
        }

        return (
            <Badge className={cn(color, "mr-2")}>
                {sender}
            </Badge>
        );
    };

    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg',
                role === 'user'
                    ? 'bg-blue-500/10 text-blue-100 justify-end'
                    : role === 'manager'
                        ? 'bg-purple-500/10 text-purple-100'
                        : 'bg-green-500/10 text-green-100'
            )}
        >
            {role !== 'user' && getRoleIcon(role)}
            <div className="flex-1">
                {getSenderBadge(sender)}
                <p className="whitespace-pre-wrap break-words">{content}</p>
                <div className="text-xs opacity-70 mt-1 text-right">{formattedTime}</div>
            </div>
            {role === 'user' && getRoleIcon(role)}
        </motion.div>
    );
};

const Sidebar: React.FC<{
    isOpen: boolean;
    toggleSidebar: () => void;
    messages: Message[];
    currentTask: string | null;
    llmConfigs: LLMConfig[];
}> = ({ isOpen, toggleSidebar, messages, currentTask, llmConfigs }) => {
    // ... (前のコードと同じ)
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-64 bg-gray-800 border-r border-gray-700 p-4 space-y-6"
                >
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-100">設定</h2>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">LLM モデル</h3>
                        <div className="space-y-2">
                            {llmConfigs.map((llm) => (
                                <Card key={llm.name} className="bg-gray-700 border-gray-600">
                                    <CardHeader className="p-2">
                                        <h4 className="text-sm font-medium text-gray-100">{llm.name}</h4>
                                    </CardHeader>
                                    <CardContent className="p-2 text-sm text-gray-300">
                                        モデル: {llm.model}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">タスク</h3>
                        <div className="space-y-2">
                            {currentTask ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse"
                                >
                                    {currentTask}
                                </Badge>
                            ) : (
                                <Badge className="bg-gray-700 text-gray-400">
                                    タスクなし
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">ログ</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {messages.slice().reverse().map((message) => (
                                <li key={message.id} className="text-xs text-gray-300 truncate">
                                    {message.role}: {message.content.substring(0, 20)}...
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ChatHeader: React.FC<{ toggleSidebar: () => void; llmConfigs: LLMConfig[] }> = ({ toggleSidebar, llmConfigs }) => {
    // ... (前のコードと同じ)
    return (
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="text-gray-400 hover:text-gray-300"
                >
                    <GripVertical className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-gray-400" />
                    <h1 className="text-xl font-semibold text-gray-100">LLM Team Chat</h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-gray-700 text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    メンバー: {llmConfigs.length}
                </Badge>
            </div>
        </div>
    );
};

const ChatInput: React.FC<{
    input: string;
    isProcessing: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSendMessage: () => void;
}> = ({ input, isProcessing, handleInputChange, handleKeyDown, handleSendMessage }) => {
    return (
        <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex gap-3">
                <TextField
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="質問を入力してください..."
                    variant="outlined"
                    multiline
                    rows={1}
                    maxRows={5} // 最大行数を制限
                    fullWidth
                    InputProps={{
                        className: 'bg-gray-700 text-gray-100 border-gray-600 rounded-lg resize-none min-h-[2.5rem] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    }}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={isProcessing || !input.trim()}
                    className={cn(
                        'bg-blue-500 text-white rounded-lg px-6 py-3',
                        isProcessing && 'opacity-50 cursor-not-allowed',
                        'hover:bg-blue-600 transition-colors duration-200'
                    )}
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

// メインコンポーネント
const LLMTeamChatApp = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<string | null>(null);

    const addMessage = useCallback((message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
        setMessages(prevMessages =>
            prevMessages.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
        );
    }, []);

    const startTeamDiscussion = useCallback(async (userInput: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setError(null);
        setInput('');
        setCurrentTask('チーム討論');
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: userInput,
            timestamp: Date.now()
        };
        addMessage(userMessage);

        const initialMessages = [
            { role: 'user', content: userInput },
            {
                role: 'system',
                content:
                    'あなたは優秀なマネージャーです。以下のメンバーをまとめて、ユーザーの質問について議論し、結論を出してください。\n' +
                    'メンバー：\n' +
                    '- 4o (gpt-4o)\n' +
                    '- Gemini\n' +
                    '- Sonnet\n' +
                    '議論の進め方:\n' +
                    '1. ユーザーの質問を要約し、メンバーに提示します。質問はメンバーに答えさせるため、回答しない。\n' +
                    '2. 各メンバーに意見を聞き、発言内容と発言者を記録します。\n' +
                    '3. 必要に応じて、追加の情報を提供したり、議論を促したりします。\n' +
                    '4. 議論がまとまったら、結論を述べ、ユーザーに提示します。\n' +
                    '5. 結論に至るまでの議論の過程をまとめ、議事録として提示します。\n' +
                    '必ず日本語で回答してください。'
            },
        ];

        try {
            // Server Actionを呼び出す
            const { managerResponse, memberResponses, finalManagerResponse } = await startTeamDiscussionAction(
                userInput,
                initialMessages,
                llmConfigs,
                MANAGER_CONFIG
            );

            const managerMessage: Message = {
                id: crypto.randomUUID(),
                role: 'manager',
                content: managerResponse,
                sender: 'O1',
                timestamp: Date.now()
            };
            addMessage(managerMessage);

            memberResponses.forEach(memberResponse => {
                const memberMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'member',
                    content: memberResponse.response,
                    sender: memberResponse.name,
                    timestamp: Date.now()
                };
                addMessage(memberMessage);
            });

            const finalManagerMessage: Message = {
                id: crypto.randomUUID(),
                role: 'manager',
                content: finalManagerResponse,
                sender: 'O1',
                timestamp: Date.now()
            };
            addMessage(finalManagerMessage);
            setCurrentTask(null);
            setIsProcessing(false);
        } catch (error: any) {
            setError(error.message);
            setIsProcessing(false);
            setCurrentTask(null);
        }
    }, [addMessage, isProcessing, llmConfigs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (input.trim() && !isProcessing) {
            startTeamDiscussion(input);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* サイドバー */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                messages={messages}
                currentTask={currentTask}
                llmConfigs={llmConfigs}
            />

            {/* メインコンテンツ */}
            <div className="flex-1 flex flex-col">
                {/* ヘッダー */}
                <ChatHeader toggleSidebar={toggleSidebar} llmConfigs={llmConfigs} />

                {/* メッセージ表示エリア */}
                <ScrollArea className="flex-1 p-4 overflow-y-auto">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <div key={message.id} className="mb-4 relative">
                                <ChatMessage {...message} />
                            </div>
                        ))}
                    </AnimatePresence>
                    {isProcessing && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-800 text-gray-300">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <p>LLMチームが議論中です...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                            <p>エラー: {error}</p>
                        </div>
                    )}
                </ScrollArea>

                {/* 入力エリア */}
                <ChatInput
                    input={input}
                    isProcessing={isProcessing}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    handleSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default LLMTeamChatApp;
