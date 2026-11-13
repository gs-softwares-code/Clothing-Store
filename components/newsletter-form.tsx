"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { IconCheck } from "./ui/icon";

export function NewsletterForm() {
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setState("loading");
    try {
      const res = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setState("done");
      show("Thanks for subscribing — check your inbox.");
    } catch {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 border border-accent/30 bg-accent-tint px-4 py-3">
        <IconCheck size={18} className="text-accent" />
        <p className="text-sm text-accent-deep">You’re on the list. Welcome to FORME.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="h-11 flex-1 border border-line bg-canvas px-4 text-sm text-ink placeholder:text-faint focus:border-ink focus:outline-none"
      />
      <Button type="submit" disabled={state === "loading"} className="shrink-0">
        {state === "loading" ? "Subscribing…" : "Subscribe"}
      </Button>
      {error && <p className="text-xs text-sale">{error}</p>}
    </form>
  );
}
