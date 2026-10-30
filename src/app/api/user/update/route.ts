export const runtime = "edge";

import { NextResponse } from "next/server";
import { users } from "@/core/instances/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedUser = await users().update(body);
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("API update error:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
