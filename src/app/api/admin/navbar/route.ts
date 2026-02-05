import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  validateAdminKey,
  getClientIP,
  checkRateLimit,
  rateLimitResponse,
  unauthorizedResponse,
} from "@/lib/auth";

export async function GET() {
  try {
    const db = await getDatabase();
    const navbar = await db.collection("navbar").findOne({});
    return NextResponse.json(navbar || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch navbar data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return rateLimitResponse();
  }

  if (!validateAdminKey(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const db = await getDatabase();

    // Remove _id from body if present to avoid immutable field error
    delete body._id;

    // Upsert navbar data (there's only one navbar)
    await db
      .collection("navbar")
      .updateOne({}, { $set: body }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating navbar:", error);
    return NextResponse.json(
      { error: "Failed to update navbar" },
      { status: 500 },
    );
  }
}
