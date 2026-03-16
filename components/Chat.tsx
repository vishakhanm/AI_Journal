// TODO: tight prompt for chat to avoid advice
"use client";
import { useState, useRef, useEffect, use } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { ChatProps, ChatMessage, ChatHistory } from '@/app/constants/interfaces';
import { SYSTEM_CONTEXT } from '@/lib/ai/systemContext';



export default function Chat({ entry, reflection, entryId, onBack }: ChatProps) {

    // const fetchChatHistory = async (entryId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            // id: '0',
            role: 'user',
            content: entry,
        },
        {
            // id: '1',
            role: 'assistant',
            content: reflection,
        },
        {
            // id: Date.now().toString(),
            role: 'assistant',
            content: `I'm here to listen and explore what you wrote. Feel free to share more about what you experienced or how you're feeling right now.`,
        },
    ]);

    let systemMessage = "";


    useEffect(() => {
        let ignore = false;
        fetch("/api/vector/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: entry
            })
        }).then(res => res.json())
            .then(vectorContext => {
                const similarHistory = vectorContext
                    .map((v: any) =>
                        `Past emotion: ${v.emotion} (similarity ${v.score.toFixed(2)})`
                    )
                    .join("\n");
                // sys msg
                systemMessage = SYSTEM_CONTEXT.replace("{{similarHistory}}", similarHistory);
            });


        console.log('Fetching chat history for entryId:', entryId);
        fetch(`/api/chat/${entryId}`)
            .then(res => res.json())
            .then(history => {

                if (!ignore && history.length > 0) {
                    setMessages(prev => [...prev, ...history]);
                }
            });

        return () => {
            ignore = true; // Set to true when component unmounts
        };
    }, [entryId]);


    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        // console.log('Sending message:', input);
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            // id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        // console.log('Updated messages:', messages);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = "http://localhost:11434/api/chat";
            const system = {
                role: "system",
                content: systemMessage
            };
            const fullHistory = [
                system,
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: userMessage.role, content: userMessage.content } // Add the new message here
            ];

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mistral',
                    messages: fullHistory,
                    stream: false,
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            const aiResponse = data.message.content;

            const assistantMessage: ChatMessage = {
                // id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
            };

            setMessages(prev => [...prev, assistantMessage]);
            await fetch("/api/chat/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entryId,
                    messages: [userMessage, assistantMessage]
                })
            });

        } catch (error) {
            console.error('Chat error:', error);

            const mockResponse = `I hear what you're saying. It sounds like you're exploring something important here. What stands out most to you about that?`;

            const assistantMessage: ChatMessage = {
                // id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: mockResponse,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex flex-col">
            <header className="sticky top-0 px-6 py-6 border-b border-stone-200/50 backdrop-blur-sm z-50 ">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-stone-700 border border-stone-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {messages.map(message => (
                        <div
                            // key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-sm lg:max-w-md px-6 py-4 rounded-2xl ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-stone-900 rounded-br-none'
                                    : 'bg-white/70 backdrop-blur-sm text-stone-700 rounded-bl-none border border-white/50 shadow-lg'
                                    }`}
                            >
                                <p className="leading-relaxed">{message.content}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/70 backdrop-blur-sm text-stone-700 px-6 py-4 rounded-2xl rounded-bl-none border border-white/50 shadow-lg">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="px-6 py-6 border-t border-stone-200/50 backdrop-blur-sm bg-white/30 sticky bottom-0">
                <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Share more thoughts..."
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-stone-200 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
