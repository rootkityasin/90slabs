import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const navbarData = await db.collection("navbar").findOne({});

    if (!navbarData) {
      // Return default data if not found in DB
      return NextResponse.json({
        logo: { text: "90sLabs", image: "" },
        links: [
          { name: "Home", href: "/" },
          { name: "About", href: "#about" },
          { name: "Services", href: "#services" },
          { name: "Projects", href: "#projects" },
          { name: "Members", href: "#members" },
          { name: "Contact Us", href: "#contact" },
        ],
        cta: { text: "Let's Talk", href: "#contact" },
      });
    }

    return NextResponse.json(navbarData);
  } catch (error) {
    console.error("Error fetching navbar:", error);
    return NextResponse.json(
      { error: "Failed to fetch navbar data" },
      { status: 500 },
    );
  }
}
