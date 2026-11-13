import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

// Demo subscribers (in-memory). Swap for the newsletter_subscribers
// table when the Postgres adapter is enabled.
const subscribers = new Set<string>();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  if (subscribers.has(email)) {
    return NextResponse.json(
      { message: "Already subscribed — welcome back!" },
      { status: 200 },
    );
  }
  subscribers.add(email);
  return NextResponse.json({ message: "Subscribed" }, { status: 201 });
}
