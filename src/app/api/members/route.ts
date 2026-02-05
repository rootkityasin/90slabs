import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const members = await db.collection("members").find({}).toArray();

    if (!members || members.length === 0) {
      return NextResponse.json({ error: "Members not found" }, { status: 404 });
    }

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}
