"use client";
import Image from "next/image";
import { use, useState } from 'react';
import JournalEntry from '@/components/JournalEntry';
import VisualDisplay from '@/components/VisualDisplay';
import Timeline from '@/components/Timeline';
import Chat from '@/components/Chat';
import { EmotionData, JournalEntryData, VisualData } from "@/app/constants/interfaces";

export default function Home() {

  type View = 'entry' | 'visual' | 'timeline' | 'chat';

  // function App() {
  const [view, setView] = useState<View>('entry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [currentReflection, setCurrentReflection] = useState<string>('');
  const [visual, setCurrentVisuals] = useState<VisualData | null>(null);
  const [entries, setEntries] = useState<JournalEntryData[]>([
    {
      id: '1',
      date: new Date(2026, 1, 15),
      entry: 'Today was challenging but I made it through. The morning started rough but by afternoon I found my rhythm.',
      reflection: 'You navigated through difficulty with patience. Notice how you found your way back to balance.',
      emotion: {
        primaryEmotion: 'Resilient',
        secondaryEmotion: ['Determined', 'Tired'],
        intensity: 0.6,
        tone: 'Reflective',
        keywords: ['challenge', 'balance', 'patience'],
      },
      visual: {
        color_palette: ['#64748B', '#94A3B8', '#475569'],
        motion_style: 'flowing',
        shape_style: 'organic',
        contrast: 'medium',
        density: 0.5,
      },
    },
    {
      id: '2',
      date: new Date(2026, 1, 18),
      entry: 'Feeling overwhelmed with everything on my plate. Too many decisions, not enough time.',
      reflection: 'The weight you feel is real. Sometimes acknowledging the overwhelm is the first step to lightness.',
      emotion: {
        primaryEmotion: 'Overwhelmed',
        secondaryEmotion: ['Anxious'],
        intensity: 0.8,
        tone: 'Anxious',
        keywords: ['overwhelm', 'decisions', 'time'],
      },
      visual: {
        color_palette: ['#DC2626', '#F87171', '#B91C1C'],
        motion_style: 'turbulent',
        shape_style: 'sharp',
        contrast: 'high',
        density: 0.8,
      },
    },
    {
      id: '3',
      date: new Date(2026, 1, 20),
      entry: 'Lovely quiet day. Read a book, took a walk, felt at peace. These are the moments I want to remember.',
      reflection: 'You found stillness today. This peace is always available to you, even in small moments.',
      emotion: {
        primaryEmotion: 'Peaceful',
        secondaryEmotion: ['Content'],
        intensity: 0.3,
        tone: 'Calm',
        keywords: ['peace', 'stillness', 'contentment'],
      },
      visual: {
        color_palette: ['#34D399', '#6EE7B7', '#10B981'],
        motion_style: 'calm',
        shape_style: 'soft',
        contrast: 'low',
        density: 0.3,
      },
    },
  ]);

  const handleSubmitEntry = async (entry: string) => {
    setIsProcessing(true);
    setCurrentEntry(entry);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: entry }),
    });

    const data = await res.json();

    setCurrentEmotion(data.emotion);
    setCurrentReflection(data.reflection);
    setCurrentVisuals(data.visual);

    const newEntry: JournalEntryData = {
      id: Date.now().toString(),
      date: new Date(),
      entry,
      reflection: data.reflection,
      emotion: data.emotion,
      visual: data.visual,
    };

    setEntries(prev => [newEntry, ...prev]);
    setIsProcessing(false);
    setView('visual');
  }


  const handleViewEntry = (entry: JournalEntryData) => {
    setCurrentEntry(entry.entry);
    setCurrentEmotion(entry.emotion);
    setCurrentReflection(entry.reflection);
    setCurrentVisuals(entry.visual);
    setView('visual');
  };

  return (
    <>
      {view === 'entry' && (
        <JournalEntry
          onSubmit={handleSubmitEntry}
          onViewTimeline={() => setView('timeline')}
          isProcessing={isProcessing}
        />
      )}

      {view === 'visual' && currentEmotion && visual && (
        <VisualDisplay
          emotion={currentEmotion}
          reflection={currentReflection}
          entry={currentEntry}
          visualData={visual}
          onBack={() => setView('entry')}
          onChat={() => setView('chat')}
        />
      )}

      {view === 'chat' && (
        <Chat
          entry={currentEntry}
          reflection={currentReflection}
          onBack={() => setView('visual')}
        />
      )}

      {view === 'timeline' && (
        <Timeline
          entries={entries}
          onBack={() => setView('entry')}
          onSelectEntry={handleViewEntry}
        />
      )}
    </>
  );
  // }
}
