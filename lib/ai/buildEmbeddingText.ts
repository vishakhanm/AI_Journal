import { JournalEntryData } from "@/app/constants/interfaces";

export function buildEmbeddingText(entry: JournalEntryData) {

    return `
Entry: ${entry.entry}

Primary emotion: ${entry.emotion.primaryEmotion}

Secondary emotions: ${entry.emotion.secondaryEmotion.join(", ")}

Reflection: ${entry.reflection}
`;
}