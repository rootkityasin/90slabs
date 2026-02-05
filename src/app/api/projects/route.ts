import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: "Projects not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
