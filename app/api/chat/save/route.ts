import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ChatHistory } from "@/app/constants/interfaces";

export async function POST(req: Request) {

    const { entryId, messages } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection<ChatHistory>("chats").updateOne(
        { entryId: new ObjectId(entryId) },
        {
            $push: { messages: { $each: messages } },
            // $set: { updatedAt: new Date() }
        },
        { upsert: true }
    );

    return NextResponse.json({ success: true });
}