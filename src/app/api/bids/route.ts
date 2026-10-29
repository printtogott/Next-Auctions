export const runtime = "edge";

import { NextResponse } from "next/server";
import { bids } from "@/core/instances/bids";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { lang, ...rest } = body;

    const bid = await bids().create(rest);

    return NextResponse.json({ success: true, data: bid });
  } catch (err) {
    console.error("Bid creation API error:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
