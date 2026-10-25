import { NextResponse } from "next/server";
import { auctions } from "@/core/instances/auctions";
import { UpdateAuctionParamsSchema } from "@/core/domains/auction";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    
    const parsedParams = UpdateAuctionParamsSchema.parse({
      ...json,
      id,
    });

    const updatedAuction = await auctions().update(parsedParams);

    return NextResponse.json({ success: true, data: updatedAuction });
  } catch (err) {
    console.error("API auction update error:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
