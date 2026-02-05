import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { validateAdminKey, unauthorizedResponse } from "@/lib/auth";

interface Member {
  name: string;
  role: string;
  image: string;
}

interface MembersDocument {
  _id?: any;
  members: Member[];
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const members = await db.collection<Member>("members").find({}).toArray();
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const db = await getDatabase();

    const newMember: Member = {
      name: body.name,
      role: body.role,
      image: body.image,
    };

    await db.collection<Member>("members").insertOne(newMember as any);

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { originalName, ...updates } = body;

    if (!originalName)
      return NextResponse.json(
        { error: "Original Name required to identify member" },
        { status: 400 },
      );

    const db = await getDatabase();
    const result = await db
      .collection<Member>("members")
      .updateOne({ name: originalName }, { $set: updates });

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });

    const db = await getDatabase();
    const result = await db
      .collection<Member>("members")
      .deleteOne({ name: name });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    );
  }
}
