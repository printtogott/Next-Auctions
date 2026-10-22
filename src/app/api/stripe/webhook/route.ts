export const runtime = "edge";

import type { NextRequest } from "next/server";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  try {
    const parts = sigHeader.split(",");
    let timestamp = "";
    let signature = "";

    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }

    if (!timestamp || !signature) return false;

    // Check timestamp tolerance (e.g., 5 minutes)
    const timeDiff = Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp, 10));
    if (timeDiff > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );

    const expectedSignature = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedSignature === signature;
  } catch (err) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const bodyText = await req.text();
    const isValid = await verifyStripeSignature(bodyText, signature, STRIPE_WEBHOOK_SECRET);

    if (!isValid) {
      return new Response("Webhook Signature Verification Failed", { status: 400 });
    }

    const event = JSON.parse(bodyText);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // TODO: fulfill order / update supabase
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
