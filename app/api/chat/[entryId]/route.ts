import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { entryId: string } }
) {

    const client = await clientPromise;
    const db = client.db();

    const chat = await db.collection("chats").findOne({
        entryId: new ObjectId(params.entryId)
    });

    return NextResponse.json(chat?.messages || []);
}