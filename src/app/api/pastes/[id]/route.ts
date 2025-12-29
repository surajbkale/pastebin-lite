import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getCurrentTime } from "@/lib/time";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const key = `paste:${id}`;

    const paste = await redis.hgetall(key);

    if (!paste || Object.keys(paste).length === 0) {
      return NextResponse.json(
        {
          error: "Paste not found",
        },
        { status: 404 }
      );
    }

    if (paste.expires_at) {
      const expiresAt = parseInt(paste.expires_at as string, 10);
      const now = await getCurrentTime();

      if (now > expiresAt) {
        return NextResponse.json(
          {
            error: "Paste expired",
          },
          { status: 404 }
        );
      }
    }

    let remainingViews = null;

    if (paste.max_views) {
      const maxViews = parseInt(paste.max_views as string, 10);

      const currentViews = await redis.hincrby(key, "current_views", 1);

      if (currentViews > maxViews) {
        return NextResponse.json(
          {
            eror: "views limit exceeded",
          },
          { status: 404 }
        );
      }

      remainingViews = maxViews - currentViews;
    } else {
      await redis.hincrby(key, "current_views", 1);
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: paste.expires_at || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Paste Error: ", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
