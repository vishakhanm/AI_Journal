import { useState } from 'react';
import { Sparkles, Calendar } from 'lucide-react';

interface JournalEntryProps {
    onSubmit: (entry: string) => void;
    onViewTimeline: () => void;
    isProcessing: boolean;
}

export default function JournalEntry({ onSubmit, onViewTimeline, isProcessing }: JournalEntryProps) {
    const [entry, setEntry] = useState('');
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEntry(e.target.value);
        setCharCount(e.target.value.length);
    };

    const handleSubmit = () => {
        if (entry.trim() && !isProcessing) {
            onSubmit(entry);
            setEntry('');
            setCharCount(0);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex flex-col">
            <header className="px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-light text-stone-800">Visual Journal</h1>
                </div>
                <button
                    onClick={onViewTimeline}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-stone-700 border border-stone-200"
                >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Timeline</span>
                </button>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-3xl">
                    <div className="mb-6 text-center">
                        <p className="text-stone-600 text-lg font-light">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="text-stone-500 text-sm mt-2">How are you feeling today?</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                        <textarea
                            value={entry}
                            onChange={handleChange}
                            placeholder="Write freely about your day, your thoughts, your feelings..."
                            className="w-full h-96 px-8 py-8 bg-transparent resize-none focus:outline-none text-stone-800 placeholder-stone-400 text-lg leading-relaxed"
                            disabled={isProcessing}
                        />

                        <div className="px-8 py-6 border-t border-stone-200/50 flex justify-between items-center">
                            <span className="text-sm text-stone-500">{charCount} characters</span>
                            <button
                                onClick={handleSubmit}
                                disabled={!entry.trim() || isProcessing}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    'Reflect'
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-stone-400 text-sm mt-6">
                        Your entries are private and processed locally
                    </p>
                </div>
            </main>
        </div>
    );
}
