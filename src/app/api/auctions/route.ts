export const runtime = "edge";

import { NextResponse } from "next/server";
import { auctions } from "@/core/instances/auctions";
import { createClient } from "@/utils/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    let user = null;

    // 1. Extract and validate Bearer Token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
      const tempClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      
      const { data: userData, error: userError } = await tempClient.auth.getUser(token);
      if (!userError && userData?.user) {
        user = userData.user;
      }
    }

    // 2. Fallback to server cookies client
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
