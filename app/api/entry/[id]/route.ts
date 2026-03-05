import clientPromise from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {

    const client = await clientPromise;
    const db = client.db();

    const entry = await db.collection("entries").findOne({
        _id: new ObjectId(params.id)
    });

    return NextResponse.json(entry);
}