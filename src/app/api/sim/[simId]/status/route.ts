import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSimById, suspendSim, resumeSim } from "@/lib/sim/gigs-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ simId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { simId } = await params;
  const sim = await getSimById(simId);
  if (!sim) return NextResponse.json({ error: "SIM not found" }, { status: 404 });
  return NextResponse.json({ sim });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ simId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { simId } = await params;
  const { action } = await req.json();
  if (action === "suspend") { const sim = await suspendSim(simId); return NextResponse.json({ sim }); }
  if (action === "resume") { const sim = await resumeSim(simId); return NextResponse.json({ sim }); }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}