import clientPromise from "@/lib/database/mongodb";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { NextResponse } from "next/server";
import { cosineSimilarity } from "@/lib/utilities/analyses";


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