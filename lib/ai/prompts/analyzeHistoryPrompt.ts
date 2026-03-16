export const ANALYZE_HISTORY_PROMPT =
    `
You are analyzing emotional patterns from a journaling application.

You must return ONLY valid JSON.

The response must follow this structure:

{
  "analysis": "3-4 sentence summary describing emotional trends during this period.",
  "emotion_distribution": [
    { "emotion": "overwhelmed", "count": 4 },
    { "emotion": "calm", "count": 2 }
  ],
    "dominant_themes": ["work stress", "family time"]
}

Rules:
- Return ONLY JSON
- Do not include explanations outside JSON
- The "analysis" field must be short (3–4 lines)
- Values must reflect the provided data

Data:
{{context}}

`