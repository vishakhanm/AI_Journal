"use client";

import { AnalyzeHistoryProps } from "@/app/constants/interfaces";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AnalyzeHistory({ onBack }: AnalyzeHistoryProps) {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [isRangeValid, setIsRangeValid] = useState(false);

    useEffect(() => {
        const diffDays =
            (Date.parse(endDate) - Date.parse(startDate)) /
            (1000 * 60 * 60 * 24);
        setIsRangeValid(diffDays >= 0 && diffDays <= 90);
    }, [startDate, endDate]);

    const handleSubmit = async () => {

        if (!loading) {

            setLoading(true);

            const res = await fetch("/api/analyze/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate, endDate })
            });

            const data = await res.json();

            setResult(data);

            setLoading(false);
        }
    };

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


            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4 text text-black">
                    Analyze Emotional Patterns
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Select a date range. Maximum range allowed is 90 days.
                </p>
                <div className="space-y-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-400 text-gray-700 p-2 w-full rounded"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-400 text-gray-700 p-2 w-full rounded"
                    />
                    <button
                        disabled={!isRangeValid}
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-black text-white rounded-lg"
                    >
                        {loading ? "Analyzing..." : "Submit"}
                    </button>
                </div>
                {result && (
                    <div className="mt-10 space-y-6">
                        <h2 className="text-xl font-semibold text-black">
                            AI Insights
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line">
                            {result.analysis}
                        </p>
                        <div className="space-y-10">
                            {result.emotion_distribution.length > 0 && (

                                <div>

                                    <h3 className="font-semibold mb-2">
                                        Emotion Distribution
                                    </h3>

                                    <ResponsiveContainer width="100%" height={300}>

                                        <BarChart data={result.emotion_distribution}>

                                            <XAxis dataKey="emotion" />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar dataKey="count" />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>)}

                            {result.dominant_themes.length > 0 && (
                                <div>

                                    <h3 className="font-semibold mb-2">
                                        Dominant Themes
                                    </h3>

                                    <span className="font-medium text-stone-800 text-right max-w-[60%]">
                                        {result.dominant_themes.join(', ')}
                                    </span>

                                </div>)}



                        </div>

                    </div>
                )}
            </main>

        </div>


    );
}