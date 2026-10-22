import { DateTime } from "luxon";

export const TZ = "Atlantic/Canary";

export function localNow(now?: DateTime) {
  return (now ?? DateTime.now()).setZone(TZ);
}

export function dateKey(dt: DateTime) {
  return dt.setZone(TZ).toFormat("yyyy-MM-dd");
}

export function slotDateTime(date: string, minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return DateTime.fromObject(
    { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)), day: Number(date.slice(8, 10)), hour: hours, minute: mins },
    { zone: TZ },
  );
}

export function formatClock(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function monthBounds(month: string) {
  const start = DateTime.fromISO(`${month}-01`, { zone: TZ });
  const end = start.endOf("month");
  return { start, end, from: start.toFormat("yyyy-MM-dd"), to: end.toFormat("yyyy-MM-dd") };
}

export type BuiltSlot = { startMinutes: number; endMinutes: number; occupiedUntil: number };

export function buildSlots(opts: {
  openMinutes: number;
  closeMinutes: number;
  interval: number;
  duration: number;
  buffer: number;
  rule: string;
  extras?: number[];
}): BuiltSlot[] {
  const seen = new Set<number>();
  const slots: BuiltSlot[] = [];
  const push = (start: number) => {
    if (seen.has(start) || start < 0) return;
    const end = start + opts.duration;
    const occupiedUntil = end + opts.buffer;
    if (start < opts.openMinutes) return;
    if (opts.rule === "endByClose") {
      if (end > opts.closeMinutes) return;
    } else if (start >= opts.closeMinutes) {
      return;
    }
    seen.add(start);
    slots.push({ startMinutes: start, endMinutes: end, occupiedUntil });
  };
  if (opts.interval > 0) {
    for (let t = opts.openMinutes; t < 24 * 60; t += opts.interval) push(t);
  }
  for (const extra of opts.extras ?? []) push(extra);
  return slots.sort((a, b) => a.startMinutes - b.startMinutes);
}
