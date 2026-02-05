import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  validateAdminKey,
  checkRateLimit,
  getClientIP,
  unauthorizedResponse,
  rateLimitResponse,
} from "@/lib/auth";

export async function GET() {
  try {
    const db = await getDatabase();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1, id: 1 })
      .toArray();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const db = await getDatabase();

    // Find max ID from existing projects
    const existingProjects = await db.collection("projects").find({}).toArray();
    const maxId = existingProjects.reduce(
      (max: number, p: any) => Math.max(max, p.id || 0),
      0,
    );

    const newProject = {
      id: maxId + 1,
      title: body.title,
      category: body.category || "Uncategorized",
      year: body.year || new Date().getFullYear().toString(),
      description: body.description,
      image: body.image,
      link: body.link,
      tech: body.tech || [],
      tags: body.tags || [],
      featured: body.featured || false,
      order: body.order || maxId + 1,
    };

    await db.collection("projects").insertOne(newProject);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id)
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );

    const db = await getDatabase();
    const result = await db
      .collection("projects")
      .updateOne({ id: id }, { $set: updates });

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDatabase();
    const result = await db.collection("projects").deleteOne({ id: id });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
