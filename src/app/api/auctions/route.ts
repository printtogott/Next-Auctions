export const runtime = "edge";

import { NextResponse } from "next/server";
import { auctions } from "@/core/instances/auctions";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Call the core auction service domain
    const auction = await auctions().create({
      ...body,
      ownerId: user.id,
      endAt: body.endAt ? new Date(body.endAt) : undefined,
    });

    return NextResponse.json({ success: true, data: auction });
  } catch (err: any) {
    console.error("API auction creation error:", err);
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
  }
}
