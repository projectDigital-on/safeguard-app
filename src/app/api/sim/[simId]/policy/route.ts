import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSimPolicy, applySimPolicy, pauseSimInternet, resumeSimInternet } from "@/lib/sim/gigs-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ simId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { simId } = await params;
  const policy = await getSimPolicy(simId);
  return NextResponse.json({ policy });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ simId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { simId } = await params;
  const body = await req.json();

  // Handle instant pause/resume
  if (body.action === "pause") {
    await pauseSimInternet(simId);
    return NextResponse.json({ success: true, action: "paused" });
  }

  if (body.action === "resume") {
    await resumeSimInternet(simId);
    return NextResponse.json({ success: true, action: "resumed" });
  }

  // Apply full policy update
  const policy = await applySimPolicy(simId, body);
  return NextResponse.json({ policy });
}
