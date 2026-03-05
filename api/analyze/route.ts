import { NextRequest, NextResponse } from "next/server";
import { generateEmotion } from "../../lib/ai/emotion";
import { generateReflection } from "../../lib/ai/reflection";
import { EmotionSchema, VisualSchema } from "../../lib/ai/schema";
import { generateVisualParams } from "../../lib/ai/visual";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Invalid journal text" },
                { status: 400 }
            );
        }

        // STEP 1: Emotion Extraction
        const emotionRaw = await generateEmotion(text);

        let emotionParsed;

        try {
            // /emotionParsed = JSON.parse(emotionRaw);
            emotionParsed = EmotionSchema.parse(JSON.parse(emotionRaw));
        } catch (error) {
            return NextResponse.json(
                { error: "Emotion JSON parsing failed", raw: emotionRaw },
                { status: 500 }
            );
        }

        // STEP 2: Reflection Generation
        const reflection = await generateReflection(emotionParsed);

        // STEP 3: Visual Parameters
        const visualRaw = await generateVisualParams(emotionParsed);

        let visualParsed;

        try {
            visualParsed = VisualSchema.parse(JSON.parse(visualRaw));
        } catch (error) {
            return NextResponse.json(
                { error: "Visual JSON parsing failed", raw: visualRaw },
                { status: 500 }
            );
        }


        return NextResponse.json({
            emotion: emotionParsed,
            reflection: reflection,
            visual: visualParsed
        });

    } catch (error) {
        console.error("Analyze error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
