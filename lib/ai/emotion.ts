// /lib/ai/emotion.ts

import { EMOTION_PROMPT } from "./prompts";

export async function generateEmotion(userText: string) {
    const prompt = EMOTION_PROMPT.replace("{{USER_TEXT}}", userText);

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "mistral",
            prompt,
            stream: false,
        }),
    });

    const data = await response.json();

    return data.response.trim();
}
