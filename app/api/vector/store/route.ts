import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { buildEmbeddingText } from "@/lib/ai/buildEmbeddingText";

export async function POST(req: Request) {

    const entry = await req.json();

    const text = buildEmbeddingText(entry);

    const embedding = await generateEmbedding(text);

    const client = await clientPromise;
    const db = client.db();

    await db.collection("vectors").insertOne({
        entryId: new ObjectId(entry._id),
        date: new Date(entry.date),
        emotion: entry.emotion.primaryEmotion,
        embedding: embedding,
        metadata: {
            secondaryEmotion: entry.emotion.secondaryEmotion,
            intensity: entry.emotion.intensity
        }
    });

    return NextResponse.json({ success: true });
}