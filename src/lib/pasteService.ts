// src/lib/pasteService.ts
import { redis } from "@/lib/redis";
import { getCurrentTime } from "@/lib/time";

export async function getAndTrackPaste(id: string) {
  const key = `paste:${id}`;

  // LOG 1: Check what we are fetching
  console.log(`[DEBUG] Fetching key: ${key}`);

  const paste = await redis.hgetall(key);

  // LOG 2: Check what Redis returned
  console.log(`[DEBUG] Redis Raw Data:`, paste);

  // 1. Check Existence
  if (!paste || Object.keys(paste).length === 0) {
    console.log(`[DEBUG] Result: NOT_FOUND (Empty object)`);
    return { status: "NOT_FOUND" };
  }

  // 2. Check Expiry
  if (paste.expires_at) {
    const expiresAt = parseInt(paste.expires_at as string, 10);
    const now = await getCurrentTime();

    // FIX: Only expire if expiresAt is POSITIVE and we have passed it.
    // This prevents '0' (or invalid dates) from killing the paste.
    if (expiresAt > 0 && now > expiresAt) {
      console.log(`[DEBUG] Result: EXPIRED`);
      return { status: "EXPIRED" };
    }
  }

  // 3. Check & Increment Views
  let remainingViews = null;
  if (paste.max_views) {
    const maxViews = parseInt(paste.max_views as string, 10);
    const currentViews = await redis.hincrby(key, "current_views", 1);

    // LOG 4: Check View Counts
    console.log(
      `[DEBUG] Views -> Max: ${maxViews}, Current (after inc): ${currentViews}`
    );

    if (currentViews > maxViews) {
      console.log(`[DEBUG] Result: LIMIT_EXCEEDED`);
      return { status: "LIMIT_EXCEEDED" };
    }
    remainingViews = maxViews - currentViews;
  } else {
    await redis.hincrby(key, "current_views", 1);
  }

  console.log(`[DEBUG] Result: SUCCESS`);
  return {
    status: "SUCCESS",
    data: {
      content: paste.content as string,
      remaining_views: remainingViews,
      expires_at: paste.expires_at,
    },
  };
}
