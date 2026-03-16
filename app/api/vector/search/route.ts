import clientPromise from "@/lib/database/mongodb";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { NextResponse } from "next/server";

function cosineSimilarity(a: number[], b: number[]) {

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export async function POST(req: Request) {

    const { text } = await req.json();

    const queryEmbedding = await generateEmbedding(text);

    const client = await clientPromise;
    const db = client.db();

    const vectors = await db.collection("vectors").find({}).toArray();

    const results = vectors.map(v => ({
        entryId: v.entryId,
        emotion: v.emotion,
        score: cosineSimilarity(queryEmbedding, v.embedding)
    }));

    results.sort((a, b) => b.score - a.score);

    return NextResponse.json(results.slice(0, 5));
}