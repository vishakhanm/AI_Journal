import { ObjectId } from "mongodb";

export interface EmotionData {
    primaryEmotion: string;
    secondaryEmotion: string[];
    intensity: number;
    tone: string;
    keywords: string[];
};

export interface VisualData {
    color_palette: string[];
    motion_style: string;
    shape_style: string;
    contrast: 'low' | 'medium' | 'high';
    density: number;
};

export interface JournalEntryData {
    _id?: string;
    date: Date;
    entry: string;
    reflection: string;
    emotion: EmotionData;
    visual: VisualData;
};

export interface VisualDisplayProps {
    journalEntry: JournalEntryData;
    onBack: () => void;
    onChat: () => void;
};

export interface TimelineProps {
    // entries: JournalEntryData[];
    onBack: () => void;
    onSelectEntry: (entry: JournalEntryData) => void;
};

export interface ChatMessage {
    // id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export interface ChatHistory {
    entryId: ObjectId;
    messages: ChatMessage[]
}

export interface ChatProps {
    entry: string;
    reflection: string;
    entryId: string;
    onBack: () => void;
}

export interface VectorDocument {
    entryId: ObjectId;
    date: Date;
    emotion: string;
    embedding: number[];
    metadata?: {
        secondaryEmotion?: string[];
        intensity?: number;
    };
}