import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSimUsage } from "@/lib/sim/gigs-client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ simId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { simId } = await params;
  const period = (req.nextUrl.searchParams.get("period") ?? "today") as "today" | "week" | "month";
  const usage = await getSimUsage(simId, period);
  return NextResponse.json({ usage });
}
