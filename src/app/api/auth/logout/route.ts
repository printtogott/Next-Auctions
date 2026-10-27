export const runtime = "edge";

import { NextResponse } from "next/server";
import { users } from "@/core/instances/users";

export async function POST() {
  try {
    await users().logout();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API logout error:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
