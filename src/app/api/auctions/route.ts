export const runtime = "edge";

import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createWithServiceRoleSupabaseClient } from "@/utils/supabase/with-service-role-client";

export async function POST(request: Request) {
  try {
    let user = null;

    // 1. Extract Bearer Token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Only authenticated user allowed" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // 2. Validate token using anon client
    const tempClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: userData, error: userError } =
      await tempClient.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json(
        { success: false, message: "Only authenticated user allowed" },
        { status: 401 },
      );
    }

    user = userData.user;
    const body = await request.json();

    const adminClient = createWithServiceRoleSupabaseClient();

    // 3. Ensure public user profile exists to satisfy foreign key constraint (auctions_owner_id_fkey)
    await adminClient
      .from("users") // or users_public depending on your schema; upsert prevents duplicates
      .upsert(
        {
          id: user.id,
          email: user.email,
          first_name:
            user.user_metadata?.first_name ||
            user.email?.split("@")[0] ||
            "User",
          last_name: user.user_metadata?.last_name || "",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

    // 4. Insert auction record
    const { data: auction, error: dbError } = await adminClient
      .from("auctions")
      .insert({
        owner_id: user.id,
        title: body.title,
        description: body.description,
        starting_price: body.startingPrice,
        category: body.category,
        status: body.status,
        end_at: body.endAt ? new Date(body.endAt).toISOString() : null,
        storage_id: body.storageId,
        images: body.images || [],
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json(
        { success: false, message: dbError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: auction });
  } catch (err: any) {
    console.error("API auction creation error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
