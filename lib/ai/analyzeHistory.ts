import { ANALYZE_HISTORY_PROMPT } from "./prompts/analyzeHistoryPrompt";


export async function generateHistoryAnalysis(context: string) {
    const prompt = ANALYZE_HISTORY_PROMPT.replace("{{context}}", context);

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

    return data;
}