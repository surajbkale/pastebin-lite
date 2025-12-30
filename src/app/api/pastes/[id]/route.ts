import { NextResponse } from "next/server";
import { getAndTrackPaste } from "@/lib/pasteService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAndTrackPaste(id);

  if (result.status === "NOT_FOUND") {
    return NextResponse.json(
      {
        error: "Paste not found",
      },
      { status: 404 }
    );
  }
  if (result.status === "EXPIRED") {
    return NextResponse.json(
      {
        error: "Paste expired",
      },
      { status: 404 }
    );
  }
  if (result.status === "LIMIT_EXCEEDED") {
    return NextResponse.json(
      {
        error: "View limit exceeded",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    content: result.data?.content,
    remaining_views: result.data?.remaining_views,
    expires_at: result.data?.expires_at,
  });
}
