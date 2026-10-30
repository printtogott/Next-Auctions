import { NextResponse } from "next/server";
import { signUp } from "@/actions/auth/sign-up";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await signUp(body);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
