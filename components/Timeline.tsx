import { useState, useRef, useEffect, use } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { JournalEntryData, TimelineProps } from '@/app/constants/interfaces';


function MiniVisual({ entry }: { entry: JournalEntryData }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 120;
        canvas.height = 120;

        ctx.fillStyle = 'rgb(250, 250, 249)';
        ctx.fillRect(0, 0, 120, 120);

        const particles = Math.floor(entry.visual.density * 15);

        for (let i = 0; i < particles; i++) {
            const x = Math.random() * 120;
            const y = Math.random() * 120;
            const size = Math.random() * 15 + 5;
            const color = entry.visual.color_palette[Math.floor(Math.random() * entry.visual.color_palette.length)];

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.random() * 0.3 + 0.2;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }, [entry.visual]);

    return <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />;
}

export default function Timeline({ onBack, onSelectEntry }: TimelineProps) {
    const [entries, setEntries] = useState<JournalEntryData[]>([]);

    const fetchEntriesFromDB = async () => {
        const res = await fetch("/api/entry/month", {
            method: "POST",
            body: JSON.stringify({
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth()
            })
        });

        const data = await res.json();
        setEntries(data);
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getEntryForDate = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return entries.find(
            entry =>
                new Date(entry.date).toDateString() === date.toDateString()
        );
    };
    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        // fetchEntriesFromDB();
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        // fetchEntriesFromDB();
    };


    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
    const [showEntries, setShowEntries] = useState(true);
    const [highlightToday, setHighlightToday] = useState(false);
    const todayDate = new Date();

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    useEffect(() => {
        fetchEntriesFromDB();
    }, [currentMonth]);
    // console.log('Entries for month:', entries);

    const todayEntry = entries.find(
        entry => new Date(entry.date).toDateString() === todayDate.toDateString()
    );
    const displayDate = highlightToday ? todayDate : currentMonth;

    useEffect(() => {
        if (highlightToday) {
            setSelectedEntry(todayEntry ?? null);
        } else {
            setSelectedEntry(null);
        }
    }, [highlightToday]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
            <header className="px-6 py-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-stone-700 border border-stone-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </header>

            <main className="px-6 pb-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-light text-stone-800">
                                    {displayDate.toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </h2>

                                {!highlightToday && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={previousMonth}
                                            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-stone-600" />
                                        </button>
                                        <button
                                            onClick={nextMonth}
                                            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-stone-600" />
                                        </button>
                                    </div>
                                )}
                            </div>


                            {highlightToday ? (
                                /* ---------------- TODAY MODE ---------------- */
                                <div className="flex justify-center py-20">
                                    <button
                                        // onClick={() => setSelectedEntry(todayEntry ? todayEntry : null)}
                                        className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300
        ${todayEntry
                                                ? "bg-white border-4 border-amber-300 hover:scale-110 shadow-lg"
                                                : "bg-stone-100 border-2 border-stone-300"}
      `}
                                    >
                                        <div className="text-center">
                                            <div className="text-sm text-stone-500">Today</div>
                                            <div className="text-3xl font-light text-stone-800">
                                                {todayDate.getDate()}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                /* ---------------- CALENDAR MODE ---------------- */
                                <>
                                    <div className="grid grid-cols-7 gap-3">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center text-sm font-medium text-stone-500 pb-2">
                                                {day}
                                            </div>
                                        ))}

                                        {[...Array(startingDayOfWeek)].map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}

                                        {[...Array(daysInMonth)].map((_, i) => {
                                            const day = i + 1;
                                            const entry = getEntryForDate(day);

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => showEntries && setSelectedEntry(entry ?? null)}
                                                    className={`aspect-square rounded-2xl transition-all duration-300 ${showEntries && entry
                                                        ? "bg-white border-2 border-amber-200 hover:border-amber-400 hover:scale-105 cursor-pointer overflow-hidden"
                                                        : "bg-stone-50 border border-stone-200"
                                                        }`}
                                                >
                                                    {entry ? (
                                                        <div className="relative w-full h-full">
                                                            <MiniVisual entry={entry} />
                                                            <div className="absolute top-1 left-1 bg-white/90 px-1.5 py-0.5 rounded text-xs font-medium text-stone-700">
                                                                {day}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-stone-400 text-sm">{day}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            <div className="mt-6 flex items-center gap-4 text-sm">
                                {/* Has Entry Toggle */}
                                <button
                                    onClick={() => setShowEntries(prev => !prev)}
                                    className="flex items-center gap-2 group"
                                >
                                    <div
                                        className={`w-4 h-4 rounded border-2 transition-all ${showEntries
                                            ? "bg-amber-400 border-amber-400"
                                            : "bg-white border-stone-300"
                                            }`}
                                    />
                                    <span className="text-stone-600 group-hover:text-stone-800">
                                        Show entry
                                    </span>
                                </button>

                                {/* Today Toggle */}
                                <button
                                    onClick={() => setHighlightToday(prev => !prev)}
                                    className="flex items-center gap-2 group"
                                >
                                    <div
                                        className={`w-4 h-4 rounded border-2 transition-all ${highlightToday
                                            ? "bg-amber-400 border-amber-400"
                                            : "bg-white border-stone-300"
                                            }`}
                                    />
                                    <span className="text-stone-600 group-hover:text-stone-800">
                                        Today
                                    </span>
                                </button>

                            </div>
                        </div>
                    </div>

                    {
                        (showEntries || highlightToday) && (

                            <div className="lg:sticky lg:top-6 h-fit">
                                {selectedEntry ? (
                                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-stone-500 mb-2">
                                                {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </h3>
                                            <p className="text-stone-700 leading-relaxed text-sm line-clamp-6">
                                                {selectedEntry.entry}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-stone-500 mb-2">Reflection</h3>
                                            <p className="text-stone-600 leading-relaxed text-sm italic">
                                                {selectedEntry.reflection}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-stone-500 mb-2">Emotion</h3>
                                            <p className="text-stone-800 font-medium">{selectedEntry.emotion.primaryEmotion}</p>
                                        </div>

                                        <button
                                            onClick={() => onSelectEntry(selectedEntry)}
                                            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                                        >
                                            View Full Entry
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                                        <p className="text-stone-500 text-center">
                                            Select a day with an entry to view details
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    );
}
