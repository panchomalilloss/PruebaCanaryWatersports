"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/catalog";
import { COMPANY } from "@/content/catalog";
import type { Copy } from "@/content/ui";
import { switchPath, withSlash } from "@/content/routes";

const labels = { en: "EN", es: "ES", de: "DE" };

export function Shell({ locale, pathname, copy, children }: { locale: Locale; pathname: string; copy: Copy; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: locale === "en" ? "/" : `/${locale}/`, label: copy.home },
    { href: locale === "en" ? "/activities/" : locale === "es" ? "/es/actividades/" : "/de/aktivitaeten/", label: copy.activities },
    { href: locale === "en" ? "/online-booking/" : locale === "es" ? "/es/reserva-online/" : "/de/online-buchen/", label: copy.online },
    { href: locale === "en" ? "/our-company/" : locale === "es" ? "/es/nuestra-empresa/" : "/de/unser-unternehmen/", label: copy.company },
    { href: locale === "en" ? "/contact/" : locale === "es" ? "/es/contacto/" : "/de/kontakt/", label: copy.contact },
  ];
  const book = links[2].href;
  const here = withSlash(pathname);
  return (
    <div className="min-h-screen">
      <a className="skip-link" href="#content">{copy.skip}</a>
      <header className="fixed inset-x-0 top-0 z-40 border-b-4 border-brand-yellow/80 bg-brand-blue/75 text-white shadow-[0_8px_24px_rgba(13,0,89,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] max-w-page items-center gap-4 px-4">
          <Link href={links[0].href} className="shrink-0 transition duration-300 hover:scale-105">
            <img src="/media/logo-yellow.png" alt="Canary Watersports" width={168} height={60} className="h-14 w-auto drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
          </Link>
          <nav className="ml-2 hidden items-center gap-1 text-sm font-semibold lg:flex" aria-label="Main">
            {links.map((link) => {
              const active = here === withSlash(link.href);
              return (
                <Link key={link.href} href={link.href} className={`rounded-md px-3 py-2 transition ${active ? "bg-brand-yellow text-black" : "hover:bg-white/15 hover:text-brand-yellow"}`} aria-current={active ? "page" : undefined}>{link.label}</Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-full bg-white/15 p-1 text-xs font-semibold" aria-label={copy.language}>
              {(["en", "es", "de"] as Locale[]).map((item) => (
                <Link key={item} href={withSlash(switchPath(pathname, item))} hrefLang={item} className={`rounded-full px-2 py-1 transition ${item === locale ? "bg-brand-yellow text-black" : "hover:text-brand-yellow"}`}>{labels[item]}</Link>
              ))}
            </div>
            <Link href={book} className="btn btn-yellow hidden px-4 py-2 text-sm sm:inline-flex">{copy.book}</Link>
            <button type="button" className="min-h-11 rounded-full border border-white/40 px-3 font-semibold transition hover:border-brand-yellow hover:text-brand-yellow lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? copy.close : copy.menu}</button>
          </div>
        </div>
        {open ? (
          <nav id="mobile-menu" className="space-y-1 border-t border-white/20 px-4 py-3 lg:hidden">
            {links.map((link) => {
              const active = here === withSlash(link.href);
              return (
                <Link key={link.href} href={link.href} className={`block rounded-xl px-3 py-3 font-semibold ${active ? "bg-brand-yellow text-black" : ""}`} onClick={() => setOpen(false)}>{link.label}</Link>
              );
            })}
          </nav>
        ) : null}
      </header>
      <div id="content" className={here === "/" || here === "/es/" || here === "/de/" ? "" : "pt-24"}>{children}</div>
      <footer className="relative mt-16 overflow-hidden border-t-4 border-brand-yellow/80 bg-brand-blue/75 text-white backdrop-blur-xl">
        <div className="mx-auto grid max-w-page gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl uppercase">Canary Watersports</p>
            <p className="mt-3 text-sm text-white/80">{COMPANY.meetingPoint}</p>
            <p className="mt-2 text-sm text-white/80">{COMPANY.legalName} · {COMPANY.cif}</p>
          </div>
          <div className="text-sm leading-7">
            <a className="block" href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            <a className="block" href={COMPANY.whatsappHref}>WhatsApp {COMPANY.whatsapp}</a>
            <a className="block" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            <p>{COMPANY.hours}</p>
          </div>
          <div className="text-sm leading-7">
            <Link className="block" href={locale === "es" ? "/es/politica-de-privacidad/" : locale === "de" ? "/de/politica-de-privacidad/" : "/politica-de-privacidad/"}>Privacy</Link>
            <Link className="block" href={locale === "es" ? "/es/aviso-legal/" : locale === "de" ? "/de/aviso-legal/" : "/aviso-legal/"}>Legal</Link>
            <Link className="block" href={locale === "es" ? "/es/devoluciones/" : locale === "de" ? "/de/rueckerstattungen/" : "/refund_returns/"}>{copy.cancel}</Link>
            <a className="block" href={COMPANY.youtube}>YouTube</a>
          </div>
        </div>
      </footer>
      <a href={`${COMPANY.whatsappHref}?text=${encodeURIComponent("Canary Watersports")}`} className="fixed bottom-20 right-4 z-40 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lift transition duration-300 hover:-translate-y-1 hover:scale-105 md:bottom-6" aria-label={copy.whatsapp}>WhatsApp</a>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-4 border-brand-yellow/80 bg-brand-blue/75 p-3 shadow-[0_-12px_40px_rgba(13,0,89,0.18)] backdrop-blur-xl md:hidden">
        <Link href={book} className="btn btn-yellow w-full">{copy.book}</Link>
      </div>
      <div className="h-20 md:hidden" />
      <CookieNote copy={copy} />
    </div>
  );
}

function CookieNote({ copy }: { copy: Copy }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!window.localStorage.getItem("cws-consent")) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-x-3 bottom-24 z-50 rounded-3xl bg-brand-black p-4 text-sm text-white shadow-card md:bottom-6 md:left-auto md:right-4 md:max-w-sm">
      <p>{copy.cookies}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded-full bg-brand-yellow px-3 py-2 text-black" onClick={() => { localStorage.setItem("cws-consent", "all"); setVisible(false); }}>{copy.accept}</button>
        <button type="button" className="rounded-full border border-white/30 px-3 py-2" onClick={() => { localStorage.setItem("cws-consent", "essential"); setVisible(false); }}>{copy.essential}</button>
      </div>
    </div>
  );
}
