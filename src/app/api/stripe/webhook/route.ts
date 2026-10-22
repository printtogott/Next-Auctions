export const runtime = "edge";
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Webhook received event type:", body?.type);
    
    return Response.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return new Response("Webhook Error", { status: 400 });
  }
}

export async function GET() {
  return new Response("OK", { status: 200 });
}
