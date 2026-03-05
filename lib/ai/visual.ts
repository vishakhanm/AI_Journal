import { VISUAL_PROMPT } from "./visualPrompt";

export async function generateVisualParams(emotionJson: object) {
    const prompt = VISUAL_PROMPT.replace(
        "{{EMOTION_JSON}}",
        JSON.stringify(emotionJson, null, 2)
    );

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
