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
    const contact = await db.collection("contact_info").findOne({});

    if (!contact) {
      // Return default data if not found
      return NextResponse.json({
        heading: "Ready to make waves?",
        subheading:
          "Let's build something extraordinary together. Reach out to us for your next digital venture.",
        email: "hello@90sx.agency",
        socials: {
          twitter: "#",
          instagram: "#",
          linkedin: "#",
        },
      });
    }

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
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

    await db
      .collection("contact_info")
      .updateOne({}, { $set: body }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 },
    );
  }
}
