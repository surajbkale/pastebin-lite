import { redis } from "@/lib/redis";
import { getCurrentTime } from "@/lib/time";

export async function getAndTrackPaste(id: string) {
  const key = `paste:${id}`;

  const paste = await redis.hgetall(key);

  if (!paste || Object.keys(paste).length === 0) {
    return { status: "NOT_FOUND" };
  }

  if (paste.expires_at) {
    const expiresAt = parseInt(paste.expires_at as string, 10);
    const now = await getCurrentTime();

    if (expiresAt > 0 && now > expiresAt) {
      return { status: "EXPIRED" };
    }
  }

  let remainingViews = null;
  if (paste.max_views) {
    const maxViews = parseInt(paste.max_views as string, 10);
    const currentViews = await redis.hincrby(key, "current_views", 1);

    if (currentViews > maxViews) {
      return { status: "LIMIT_EXCEEDED" };
    }
    remainingViews = maxViews - currentViews;
  } else {
    await redis.hincrby(key, "current_views", 1);
  }

  return {
    status: "SUCCESS",
    data: {
      content: paste.content as string,
      remaining_views: remainingViews,
      expires_at: paste.expires_at,
    },
  };
}
