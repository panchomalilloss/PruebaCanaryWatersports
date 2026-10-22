"use client";

import { useState } from "react";
import type { Locale } from "@/content/catalog";
import type { Copy } from "@/content/ui";
import { money } from "@/lib/format";

export function CheckoutPanel({ reference, locale, copy, total, testMode }: { reference: string; locale: Locale; copy: Copy; total: number; testMode: boolean }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay(mode: "full" | "deposit", depositCents?: number) {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/payments/start/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, mode, depositCents }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || copy.holdFail);
      setBusy(false);
      return;
    }
    if (data.mode === "stripe" && data.url) {
      window.location.href = data.url;
      return;
    }
    const confirm = await fetch("/api/payments/test/confirm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: data.paymentId }),
    });
    const confirmed = await confirm.json();
    setBusy(false);
    if (!confirm.ok) {
      setMessage(confirmed.error || copy.holdFail);
      return;
    }
    const root = locale === "en" ? "" : `/${locale}`;
    window.location.href = `${root}/booking/${confirmed.reference}/`;
  }

  return (
    <div className="mt-6 border-t border-line pt-4">
      {testMode ? <p className="rounded-2xl bg-paper p-3 text-sm">{copy.testPay}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => pay("full")} className="rounded-full bg-brand-yellow px-4 py-3 font-semibold text-black">{copy.payFull} · {money(total, locale)}</button>
        {[2000, 3000, 5000].filter((amount) => amount < total).map((amount) => (
          <button key={amount} type="button" disabled={busy} onClick={() => pay("deposit", amount)} className="rounded-full border border-line px-4 py-3">{copy.payDeposit} {money(amount, locale)}</button>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{copy.restCash}</p>
      {message ? <p className="mt-2 text-sm text-red-700" role="alert">{message}</p> : null}
    </div>
  );
}
