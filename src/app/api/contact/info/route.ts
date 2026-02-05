import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const contactInfo = await db.collection("contact_info").findOne({});

    if (!contactInfo) {
      // Return default data if not found
      return NextResponse.json({
        heading: "Ready to make waves?",
        subheading:
          "Let's build something extraordinary together. Reach out to us for your next digital venture.",
        socials: {
          twitter: "#",
          instagram: "#",
          linkedin: "#",
        },
        email: "hello@90sx.agency",
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 },
    );
  }
}
