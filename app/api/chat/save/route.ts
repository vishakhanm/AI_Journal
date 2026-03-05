import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {

    const { entryId, message } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection("chats").updateOne(
        { entryId: new ObjectId(entryId) },
        { $push: { messages: message } },
        { upsert: true }
    );

    return NextResponse.json({ success: true });
}