import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("entries").insertOne({
        date: new Date(),
        entry: body.entry,
        emotion: body.emotion,
        reflection: body.reflection,
        visual: body.visual
    });

    // console.log("Inserted entry with ID:", result.insertedId);


    return NextResponse.json({
        success: true,
        id: result.insertedId
    });
}