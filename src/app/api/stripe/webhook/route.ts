export const runtime = "edge";
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    return Response.json(
      { received: true, bodyLength: text.length },
      { status: 200 },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET() {
  return new Response("Webhook is live", { status: 200 });
}
