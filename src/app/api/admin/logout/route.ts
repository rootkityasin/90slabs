import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("admin_key");
  return NextResponse.json({ success: true });
}
