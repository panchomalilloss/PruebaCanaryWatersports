"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/catalog";
import type { Copy } from "@/content/ui";
import { money } from "@/lib/format";

export type WidgetVariant = {
  id: string;
  name: string;
  blurb: string;
  priceCents: number;
  pricingUnit: string;
  durationMinutes: number;
  bufferMinutes: number;
  minParticipants: number;
  maxParticipants: number;
  participantStep: number;
  allowSpectators: boolean;
};

export type WidgetPart = {
  variantId: string;
  name: string;
  slotMode: "one" | "perPair";
  durationMinutes: number;
  bufferMinutes: number;
};

type Slot = { startMinutes: number; label: string; occupiedUntil: number };

function monthLabel(month: string, locale: Locale) {
  const [year, mon] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : locale === "es" ? "es-ES" : "en-GB", { month: "long", year: "numeric" }).format(new Date(Date.UTC(year, mon - 1, 1)));
}

function shiftMonth(month: string, delta: number) {
  const [year, mon] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, mon - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function BookingWidget({
  locale,
  copy,
  bookable,
  isPack,
  variants,
  parts,
  checkoutPath,
  inventoryNotice,
}: {
  locale: Locale;
  copy: Copy;
  bookable: boolean;
  isPack: boolean;
  variants: WidgetVariant[];
  parts: WidgetPart[];
  checkoutPath: string;
  inventoryNotice: boolean;
}) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const variant = variants.find((item) => item.id === variantId) ?? variants[0];
  const [participants, setParticipants] = useState(variant?.minParticipants ?? 1);
  const [spectators, setSpectators] = useState(0);
  const [weightOk, setWeightOk] = useState(false);
  const [month, setMonth] = useState(currentMonth());
  const [days, setDays] = useState<Record<string, string>>({});
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [start, setStart] = useState<number | null>(null);
  const [packDates, setPackDates] = useState<Record<string, string>>({});
  const [packSlots, setPackSlots] = useState<Record<string, Slot[]>>({});
  const [packPicks, setPackPicks] = useState<Record<string, number[]>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [safety, setSafety] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pairs = Math.max(1, participants / 2);

  useEffect(() => {
    if (!variant) return;
    setParticipants(variant.minParticipants);
    setStart(null);
    setDate("");
  }, [variantId]);

  useEffect(() => {
    if (isPack || !variant) return;
    const url = `/api/availability/month/?variantId=${variant.id}&month=${month}&participants=${participants}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setDays(data.days ?? {}))
      .catch(() => setDays({}));
  }, [variant, month, participants, isPack]);

  useEffect(() => {
    if (isPack || !variant || !date) return;
    setLoading(true);
    const ignore = variant.id === "jetboat-20" ? "" : "";
    fetch(`/api/availability/slots/?variantId=${variant.id}&date=${date}&participants=${participants}&spectators=${spectators}${ignore}`)
      .then((response) => response.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setError(data.reason === "closed" ? copy.closed : "");
      })
      .finally(() => setLoading(false));
  }, [variant, date, participants, spectators, isPack, copy.closed]);

  async function loadPack(part: WidgetPart, day: string) {
    setPackDates((current) => ({ ...current, [part.variantId]: day }));
    const people = part.slotMode === "perPair" ? 2 : participants;
    const ignoreMin = part.variantId === "jetboat-20" ? "&ignoreMin=1" : "";
    const response = await fetch(`/api/availability/slots/?variantId=${part.variantId}&date=${day}&participants=${people}${ignoreMin}`);
    const data = await response.json();
    setPackSlots((current) => ({ ...current, [part.variantId]: data.slots ?? [] }));
  }

  const price = useMemo(() => {
    if (!variant) return 0;
    if (isPack || variant.pricingUnit === "person") return variant.priceCents * participants + (variant.allowSpectators ? spectators * 1500 : 0);
    return variant.priceCents + (variant.allowSpectators ? spectators * 1500 : 0);
  }, [variant, participants, spectators, isPack]);

  function grid(monthKey: string) {
    const [year, mon] = monthKey.split("-").map(Number);
    const first = new Date(Date.UTC(year, mon - 1, 1));
    const startWeekday = (first.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(year, mon, 0)).getUTCDate();
    const cells: ({ day: number; iso: string } | null)[] = Array.from({ length: startWeekday }, () => null);
    for (let day = 1; day <= count; day++) cells.push({ day, iso: `${monthKey}-${String(day).padStart(2, "0")}` });
    return cells;
  }

  function togglePack(part: WidgetPart, startMinutes: number) {
    setPackPicks((current) => {
      const list = current[part.variantId] ?? [];
      const exists = list.includes(startMinutes);
      const limit = part.slotMode === "perPair" ? pairs : 1;
      const next = exists ? list.filter((item) => item !== startMinutes) : [...list, startMinutes].slice(-limit);
      return { ...current, [part.variantId]: next };
    });
  }

  async function submit() {
    setError("");
    if (!safety || !terms) {
      setError(copy.terms);
      return;
    }
    if (variant?.id === "parasail-triple" && !weightOk) {
      setError(copy.weight);
      return;
    }
    const lines = isPack
      ? parts.flatMap((part) => {
          const day = packDates[part.variantId];
          const picks = packPicks[part.variantId] ?? [];
          return picks.map((startMinutes) => ({
            variantId: part.variantId,
            date: day,
            startMinutes,
            participants: part.slotMode === "perPair" ? 2 : participants,
          }));
        })
      : date && start != null
        ? [{ variantId: variant.id, date, startMinutes: start, participants, spectators }]
        : [];
    if (!lines.length) {
      setError(copy.noSlots);
      return;
    }
    const intervals = lines.map((line) => {
      const part = parts.find((item) => item.variantId === line.variantId);
      const duration = part ? part.durationMinutes + part.bufferMinutes : (variant?.durationMinutes ?? 0) + (variant?.bufferMinutes ?? 0);
      return { date: line.date, start: line.startMinutes, end: line.startMinutes + duration };
    });
    for (let i = 0; i < intervals.length; i++) {
      for (let j = i + 1; j < intervals.length; j++) {
        if (intervals[i].date === intervals[j].date && intervals[i].start < intervals[j].end && intervals[j].start < intervals[i].end) {
          setError(copy.overlap);
          return;
        }
      }
    }
    setLoading(true);
    const response = await fetch("/api/bookings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerNotes: notes,
        acceptTerms: terms,
        acceptSafety: safety,
        lines,
        packVariantId: isPack ? variant.id : undefined,
        participants,
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error === "SLOT_UNAVAILABLE" || data.error === "SLOT_OVERLAP" ? copy.holdFail : data.error || copy.holdFail);
      return;
    }
    router.push(`${checkoutPath}?ref=${data.reference}`);
  }

  if (!bookable || !variant) {
    return <aside className="rounded-[1.75rem] border border-brand-yellow/40 bg-white p-6 shadow-card"><p className="font-semibold">{copy.unavailable}</p></aside>;
  }

  const cells = grid(month);
  return (
    <aside className="rounded-[1.75rem] border border-brand-yellow/50 bg-white p-5 shadow-lift lg:sticky lg:top-24">
      <p className="h-1 w-10 rounded-full bg-brand-yellow" />
      <h2 className="mt-3 font-display text-4xl uppercase leading-none">{copy.book}</h2>
      {inventoryNotice ? <p className="mt-3 rounded-2xl bg-paper p-3 text-sm text-muted">{copy.inventory}</p> : null}
      {!isPack && variants.length > 1 ? (
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">{copy.modality}</legend>
          <div className="mt-2 grid gap-2">
            {variants.map((item) => (
              <label key={item.id} className={`cursor-pointer rounded-2xl border p-3 transition duration-200 ${item.id === variant.id ? "border-brand-blue bg-[#eef6fc] shadow-card" : "border-line hover:border-brand-blue/50"}`}>
                <input className="sr-only" type="radio" name="variant" checked={item.id === variant.id} onChange={() => setVariantId(item.id)} />
                <span className="block font-semibold">{item.name}</span>
                <span className="text-sm text-muted">{item.blurb}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        {copy.people}
        <input
          className="mt-1 w-full rounded-2xl border border-line px-3 py-3"
          type="number"
          min={variant.minParticipants}
          max={variant.maxParticipants}
          step={variant.participantStep}
          value={participants}
          onChange={(event) => setParticipants(Number(event.target.value))}
        />
      </label>
      {variant.allowSpectators ? (
        <label className="mt-3 block text-sm font-semibold">
          {copy.spectators} · {money(1500, locale)}
          <input className="mt-1 w-full rounded-2xl border border-line px-3 py-3" type="number" min={0} max={6} value={spectators} onChange={(event) => setSpectators(Number(event.target.value))} />
        </label>
      ) : null}
      {variant.id === "parasail-triple" ? (
        <label className="mt-3 flex gap-2 text-sm"><input type="checkbox" checked={weightOk} onChange={(event) => setWeightOk(event.target.checked)} /> {copy.weight}</label>
      ) : null}

      {isPack ? (
        <div className="mt-4 space-y-4">
          {parts.map((part) => (
            <div key={part.variantId} className="rounded-2xl border border-line p-3">
              <p className="font-semibold">{part.name}</p>
              <p className="text-sm text-muted">{part.slotMode === "perPair" ? copy.pairTimes : copy.chooseTime}</p>
              <input className="mt-2 w-full rounded-2xl border border-line px-3 py-3" type="date" value={packDates[part.variantId] ?? ""} onChange={(event) => loadPack(part, event.target.value)} />
              <div className="mt-2 flex flex-wrap gap-2">
                {(packSlots[part.variantId] ?? []).map((slot) => {
                  const selected = (packPicks[part.variantId] ?? []).includes(slot.startMinutes);
                  return (
                    <button key={slot.startMinutes} type="button" aria-pressed={selected} className={`min-h-11 rounded-full px-4 transition ${selected ? "bg-brand-blue text-white shadow-card" : "bg-paper hover:bg-brand-yellow"}`} onClick={() => togglePack(part, slot.startMinutes)}>
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Calendar month={month} locale={locale} cells={cells} days={days} date={date} onMonth={setMonth} onDate={(iso) => { setDate(iso); setStart(null); }} label={monthLabel(month, locale)} />
      )}
      {!isPack ? (
        <div className="mt-3">
          <p className="text-sm font-semibold">{copy.chooseTime}</p>
          {loading ? <p className="text-sm text-muted">{copy.loading}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button key={slot.startMinutes} type="button" aria-pressed={start === slot.startMinutes} className={`min-h-11 rounded-full px-4 transition ${start === slot.startMinutes ? "bg-brand-blue text-white shadow-card" : "bg-paper hover:bg-brand-yellow"}`} onClick={() => setStart(slot.startMinutes)}>
                {slot.label}
              </button>
            ))}
          </div>
          {date && !loading && slots.length === 0 ? <p className="mt-2 text-sm">{copy.noSlots}</p> : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        <input className="rounded-2xl border border-line px-3 py-3" placeholder={copy.name} aria-label={copy.name} value={name} onChange={(event) => setName(event.target.value)} required />
        <input className="rounded-2xl border border-line px-3 py-3" placeholder={copy.email} aria-label={copy.email} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input className="rounded-2xl border border-line px-3 py-3" placeholder={copy.phone} aria-label={copy.phone} value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <textarea className="rounded-2xl border border-line px-3 py-3" placeholder={copy.notes} aria-label={copy.notes} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>
      <label className="mt-3 flex gap-2 text-sm"><input type="checkbox" checked={safety} onChange={(event) => setSafety(event.target.checked)} /> {copy.safety}</label>
      <label className="mt-2 flex gap-2 text-sm"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /> {copy.terms}</label>
      <p className="mt-4 font-display text-4xl">{money(price, locale)}</p>
      {error ? <p className="mt-2 text-sm text-red-700" role="alert">{error}</p> : null}
      <button type="button" disabled={loading} onClick={submit} className="btn btn-yellow mt-3 w-full disabled:opacity-60">
        {copy.hold}
      </button>
    </aside>
  );
}

function Calendar({ month, cells, days, date, onMonth, onDate, label }: { month: string; locale: Locale; cells: ({ day: number; iso: string } | null)[]; days: Record<string, string>; date: string; onMonth: (value: string) => void; onDate: (iso: string) => void; label: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button type="button" className="min-h-11 rounded-full px-3" onClick={() => onMonth(shiftMonth(month, -1))} aria-label="Previous month">←</button>
        <p className="font-semibold capitalize">{label}</p>
        <button type="button" className="min-h-11 rounded-full px-3" onClick={() => onMonth(shiftMonth(month, 1))} aria-label="Next month">→</button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm" role="grid" aria-label={label}>
        {cells.map((cell, index) => cell ? (
          <button
            key={cell.iso}
            type="button"
            role="gridcell"
            disabled={days[cell.iso] !== "open"}
            aria-pressed={date === cell.iso}
            aria-label={cell.iso}
            onClick={() => onDate(cell.iso)}
            className={`min-h-11 rounded-xl transition ${date === cell.iso ? "bg-brand-blue text-white shadow-card" : days[cell.iso] === "open" ? "bg-paper hover:bg-brand-yellow" : "text-line"} disabled:cursor-not-allowed`}
          >
            {cell.day}
          </button>
        ) : <span key={`e-${index}`} />)}
      </div>
    </div>
  );
}
