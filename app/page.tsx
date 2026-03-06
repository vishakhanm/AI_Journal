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
  const [journalEntry, setJournalEntry] = useState<JournalEntryData | null>(null);


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
      // id: Date.now().toString(),
      date: new Date(),
      entry,
      reflection: data.reflection,
      emotion: data.emotion,
      visual: data.visual,
    };
    setJournalEntry(newEntry);

    const id = await fetch("/api/entry/create", {
      method: "POST",
      body: JSON.stringify({
        entry,
        emotion: data.emotion,
        reflection: data.reflection,
        visual: data.visual
      })
    });

    newEntry._id = (await id.json()).id;
    setJournalEntry(newEntry);

    // setEntries(prev => [newEntry, ...prev]);
    setIsProcessing(false);
    setView('visual');
  }


  const handleViewEntry = (entry: JournalEntryData) => {
    // const res = await fetch(`/api/entry/${id}`);
    // const data = await res.json();
    setCurrentEntry(entry.entry);
    setCurrentEmotion(entry.emotion);
    setCurrentReflection(entry.reflection);
    setCurrentVisuals(entry.visual);
    setJournalEntry(entry);
    console.log('Selected entry:', entry);
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

      {view === 'visual' && journalEntry && (
        <VisualDisplay
          journalEntry={journalEntry}
          onBack={() => setView('entry')}
          onChat={() => setView('chat')}
        />
      )}

      {view === 'chat' && (
        <Chat
          entry={currentEntry}
          reflection={currentReflection}
          entryId={journalEntry?._id || ''}
          onBack={() => setView('visual')}
        />
      )}

      {view === 'timeline' && (
        <Timeline
          // entries={entries}
          onBack={() => setView('entry')}
          onSelectEntry={handleViewEntry}
        />
      )}
    </>
  );
  // }
}
