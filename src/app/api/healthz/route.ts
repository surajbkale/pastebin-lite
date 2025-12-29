import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    await redis.ping();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Health Check failed: ", error);

    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 503 }
    );
  }
}
