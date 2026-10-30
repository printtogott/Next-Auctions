export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const action = searchParams.get("action");

  if (!userId || !action || !["VERIFIED", "REJECTED"].includes(action)) {
    return new NextResponse("Invalid verification parameters", { status: 400 });
  }

  try {
    const supabase = await createClient();

    // 1. Update DB record
    await supabase
      .from("users")
      .update({ verification_status: action })
      .eq("id", userId);

    // 2. Update Supabase Auth metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { verificationStatus: action },
    });

    const actionText = action === "VERIFIED" ? "Approved" : "Rejected";

    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f4f4f5;">
          <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center;">
            <h1 style="color: ${action === "VERIFIED" ? "#16a34a" : "#dc2626"}; font-size: 1.5rem;">User Verification ${actionText}</h1>
            <p>User ID <code>${userId}</code> status has been successfully updated to <strong>${action}</strong>.</p>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  } catch (err) {
    console.error("Error updating user verification:", err);
    return new NextResponse("Failed to update user verification state", {
      status: 500,
    });
  }
}
