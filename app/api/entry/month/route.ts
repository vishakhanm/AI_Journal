import clientPromise from "@/lib/database/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { year, month } = await req.json();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const client = await clientPromise;
    const db = client.db();

    const entries = await db.collection("entries")
        .find({
            date: { $gte: start, $lt: end }
        })
        .project({
            entry: 1,
            reflection: 1,
            emotion: 1,
            date: 1
        })
        .toArray();

    return NextResponse.json(entries);
}