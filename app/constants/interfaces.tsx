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
    id: string;
    date: Date;
    entry: string;
    reflection: string;
    emotion: EmotionData;
    visual: VisualData;
};

export interface VisualDisplayProps {
    emotion: EmotionData;
    reflection: string;
    entry: string;
    visualData: VisualData;
    onBack: () => void;
    onChat: () => void;
};

export interface TimelineProps {
    // entries: JournalEntryData[];
    onBack: () => void;
    onSelectEntry: (entry: JournalEntryData) => void;
};

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export interface ChatProps {
    entry: string;
    reflection: string;
    onBack: () => void;
}