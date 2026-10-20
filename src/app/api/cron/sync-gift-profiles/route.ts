import { connection } from "next/server";
import { syncGiftProfiles } from "@/lib/ai/sync";

export const maxDuration = 300;

// Run on a schedule (e.g. Vercel Cron) or by hand:
//   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-gift-profiles
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  try {
    const result = await syncGiftProfiles({
      force: url.searchParams.get("force") === "1",
      limit: Number(url.searchParams.get("limit")) || 50,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
