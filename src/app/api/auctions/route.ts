export const runtime = "edge";

import { NextResponse } from "next/server";
import { auctions } from "@/core/instances/auctions";
import { createClient } from "@/utils/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    let user = null;

    // 1. Try Bearer Auth token from Request headers first
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
      const tempClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const { data: sessionData, error: sessionError } = await tempClient.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
      if (!sessionError && sessionData?.user) {
        user = sessionData.user;
      }
    }

    // 2. Fallback to default server cookie client
    if (!user) {
      const supabaseServer = await createClient();
      const { data: serverUserData } = await supabaseServer.auth.getUser();
      user = serverUserData?.user;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Only authenticated user allowed" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Call core auction service domain
    const auction = await auctions().create({
      ...body,
      ownerId: user.id,
      endAt: body.endAt ? new Date(body.endAt) : undefined,
    });

    return NextResponse.json({ success: true, data: auction });
  } catch (err: any) {
    console.error("API auction creation error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
