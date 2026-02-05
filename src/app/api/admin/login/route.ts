import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    if (!password || !timingSafeEqual(password, ADMIN_SECRET_KEY)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Set cookie
    (await cookies()).set("admin_key", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
