import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "@/server/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  const user = await signIn(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: "DENIED" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
