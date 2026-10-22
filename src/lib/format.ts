import type { Locale } from "@/content/catalog";

export function money(cents: number, locale: Locale) {
  const tag = locale === "de" ? "de-DE" : locale === "es" ? "es-ES" : "en-GB";
  return new Intl.NumberFormat(tag, { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function text(raw: string, locale: Locale) {
  try {
    const data = JSON.parse(raw) as Record<string, string>;
    return data[locale] || data.en || "";
  } catch {
    return raw;
  }
}

export function clock(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
