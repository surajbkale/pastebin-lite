import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getCurrentTime } from "@/lib/time";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "Content is required",
        },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          {
            error: "ttl_seconds must be positive integer",
          },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          {
            error: "max_views must be a positive integer",
          },
          { status: 400 }
        );
      }
    }

    const id = nanoid(8);
    const now = await getCurrentTime();

    let expiresAt: number | null = null;
    if (ttl_seconds) {
      expiresAt = now + ttl_seconds * 1000;
    }

    const pasteData: Record<string, string | number> = {
      id,
      content,
      created_at: now,
      current_views: 0,
    };

    if (max_views) {
      pasteData.max_views = max_views;
    }

    if (expiresAt) {
      pasteData.expires_at = expiresAt;
    }

    const key = `paste:${id}`;
    await redis.hset(key, pasteData);

    if (ttl_seconds) {
      await redis.expire(key, ttl_seconds);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://locahost:3000";

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (error) {
    console.error("Create Paste Error: ", error);
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}
