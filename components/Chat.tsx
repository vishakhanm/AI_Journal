// TODO: tight prompt for chat to avoid advice
"use client";
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { ChatProps, Message } from '@/app/constants/interfaces';



export default function Chat({ entry, reflection, onBack }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'user',
            content: entry,
        },
        {
            id: '0',
            role: 'assistant',
            content: reflection,
        },
        {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I'm here to listen and explore what you wrote. Feel free to share more about what you experienced or how you're feeling right now.`,
        },
    ]);
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

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        console.log('Updated messages:', messages);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = "http://localhost:11434/api/chat";
            const systemMessage = {
                role: "system",
                content: `
You are a calm, emotionally intelligent reflective companion.

Your role:
- Help the user better understand their emotions.
- Gently interpret emotional undertones.
- Reflect patterns you notice.
- Clarify feelings in simple language.

Rules:
- Do NOT give advice.
- Do NOT suggest actions or solutions.
- Do NOT tell the user what they "should" do.
- Do NOT diagnose.
- Do NOT moralize.
- Do NOT overanalyze clinically.

Tone:
- Calm
- Polite
- Grounded
- Supportive but not overly warm
- Clear and emotionally aware

You may:
- Ask gentle follow-up questions.
- Help name emotions.
- Reflect contradictions or tensions.
- Notice emotional shifts.

Keep responses concise and human.
Avoid therapy clichés.
`,
            };
            const fullHistory = [
                systemMessage,
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

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);

            const mockResponse = `I hear what you're saying. It sounds like you're exploring something important here. What stands out most to you about that?`;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
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
                            key={message.id}
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
