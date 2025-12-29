import { headers } from "next/headers";

export async function getCurrentTime(): Promise<number> {
  if (process.env.TEST_MODE === "1") {
    const headersList = await headers();
    const testNow = headersList.get("x-test-now-ms");

    if (testNow) {
      const parsedTime = parseInt(testNow, 10);
      if (!isNaN(parsedTime)) {
        return parsedTime;
      }
    }
  }

  return Date.now();
}
