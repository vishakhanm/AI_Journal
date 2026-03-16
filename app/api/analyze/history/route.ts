import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { clusterVectors, groupChatsByEntry } from "@/lib/utilities/analyses";
import { generateHistoryAnalysis } from "@/lib/ai/analyzeHistory";

export async function POST(req: Request) {

    const { startDate, endDate } = await req.json();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const client = await clientPromise;
    const db = client.db();

    const vectors = await db
        .collection("vectors")
        .find({
            date: { $gte: start, $lte: end }
        })
        .toArray();

    const entryIds = vectors.map(v => v.entryId);

    const chats = await db
        .collection("chats")
        .find({
            entryId: { $in: entryIds }
        })
        .toArray();

    const chatMap = groupChatsByEntry(chats);

    const embeddedChats = [];

    for (const chat of chats) {

        const text = chat.messages
            .map((m: any) => m.content)
            .join(" ");

        const embedding = await generateEmbedding(text);

        embeddedChats.push({
            entryId: chat.entryId,
            embedding
        });

    }

    const clusters = clusterVectors(vectors);

    const clusterSummary = clusters.map(c => ({

        emotion: c[0].emotion,
        count: c.length

    }));

    const context = `
  Emotional clusters:
  ${JSON.stringify(clusterSummary)}

  Chats:
  ${JSON.stringify(chatMap)}
  `;

    const llmRes = await generateHistoryAnalysis(context);

    const result = JSON.parse(llmRes.response);

    return NextResponse.json(result);
}