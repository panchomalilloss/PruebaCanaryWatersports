import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { COMPANY, type Locale } from "@/content/catalog";
import { alternates, resolve, withSlash } from "@/content/routes";
import { statusLabel, t, type Copy } from "@/content/ui";
import { Shell } from "@/components/Shell";
import { ActivityView, CatalogView, CompanyView, ContactView, DepositView, HomeView, LegalView } from "@/components/Views";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { prisma } from "@/server/db";
import { clock, money } from "@/lib/format";

export const dynamic = "force-dynamic";

function pathnameFrom(slug?: string[]) {
  if (!slug?.length) return "/";
  return `/${slug.join("/")}/`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const pathname = pathnameFrom(slug);
  const resolved = resolve(pathname);
  if (!resolved) return { title: "Canary Watersports" };
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.canarywatersports.com";
  const { page, locale } = resolved;
  const path = page.paths[locale] || pathname;
  const index = !["cart", "checkout", "account"].includes(page.kind) && !pathname.includes("/booking/");
  return {
    title: page.title[locale],
    description: page.description[locale],
    alternates: { canonical: site + withSlash(path), languages: alternates(page, site) },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: page.title[locale], description: page.description[locale], url: site + withSlash(path), locale },
  };
}

export default async function PublicPage({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const pathname = (await headers()).get("x-pathname") || pathnameFrom(slug);
  const resolved = resolve(pathname);
  if (!resolved) notFound();
  const locale = resolved.locale;
  const copy = t(locale);
  const page = resolved.page;
  let body: React.ReactNode = null;
  if (page.kind === "home") body = <HomeView locale={locale} copy={copy} />;
  else if (page.kind === "activities" || page.kind === "catalog" || page.kind === "shop" || page.kind === "sample" || page.kind === "posts") body = <CatalogView locale={locale} copy={copy} />;
  else if (page.kind === "category") body = <CatalogView locale={locale} copy={copy} ids={page.activities} showDeposits={page.deposits} />;
  else if (page.kind === "activity" && page.activityId) body = <ActivityView locale={locale} copy={copy} activityId={page.activityId} focus={page.focus} pathname={pathname} />;
  else if (page.kind === "company") body = <CompanyView locale={locale} copy={copy} />;
  else if (page.kind === "contact") body = <ContactView locale={locale} copy={copy} />;
  else if (page.kind === "legal" && page.legal) body = <LegalView locale={locale} kind={page.legal} />;
  else if (page.kind === "deposit" && page.deposit) body = <DepositView locale={locale} copy={copy} cents={page.deposit} />;
  else if (page.kind === "cart" || page.kind === "checkout" || page.kind === "account" || page.kind === "confirmation") {
    const ref = resolved.reference || stringParam(query.ref) || (await cookies()).get("cws_ref")?.value || "";
    const email = stringParam(query.email);
    body = <BookingStatus locale={locale} copy={copy} reference={ref} email={email} checkout={page.kind === "checkout"} lookup={page.kind === "account"} />;
  }
  return <Shell locale={locale} pathname={pathname} copy={copy}>{body}</Shell>;
}

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

async function BookingStatus({ locale, copy, reference, email, checkout, lookup }: { locale: Locale; copy: Copy; reference: string; email: string; checkout: boolean; lookup: boolean }) {
  const booking = reference
    ? await prisma.booking.findUnique({ where: { reference }, include: { items: true, payments: true } })
    : null;
  const allowed = booking && (!lookup || booking.customerEmail.toLowerCase() === email.toLowerCase());
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl uppercase">{checkout ? copy.summary : lookup ? copy.lookup : copy.summary}</h1>
      {lookup ? (
        <form className="mt-6 grid gap-3" method="get">
          <input className="rounded-2xl border border-line px-3 py-3" name="ref" placeholder={copy.reference} aria-label={copy.reference} defaultValue={reference} />
          <input className="rounded-2xl border border-line px-3 py-3" name="email" type="email" placeholder={copy.email} aria-label={copy.email} defaultValue={email} />
          <button className="rounded-full bg-brand-yellow px-4 py-3 font-semibold text-black">{copy.lookup}</button>
        </form>
      ) : null}
      {!reference ? <p className="mt-6">{copy.emptyCart}</p> : null}
      {reference && !allowed ? <p className="mt-6">{copy.emptyCart}</p> : null}
      {allowed && booking ? (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
          <p className="font-display text-3xl">{booking.reference}</p>
          <p className="mt-2 text-sm uppercase tracking-wide text-brand-blue">{statusLabel[locale][booking.status] || booking.status}</p>
          {booking.status === "PAID" || booking.status === "CONFIRMED" ? <p className="mt-3">{copy.booked}</p> : null}
          <ul className="mt-4 space-y-2">
            {booking.items.map((item) => (
              <li key={item.id}>{item.date} · {clock(item.startMinutes)} · {item.variantId} · {item.participants}</li>
            ))}
          </ul>
          <p className="mt-4 text-2xl">{money(booking.totalCents - booking.discountCents, locale)}</p>
          <p className="mt-2 text-sm text-muted">{COMPANY.meetingPoint}</p>
          {checkout && (booking.status === "HELD") ? <CheckoutPanel reference={booking.reference} locale={locale} copy={copy} total={booking.totalCents - booking.discountCents} testMode={(process.env.PAYMENT_MODE || "test") !== "stripe"} /> : null}
        </div>
      ) : null}
    </section>
  );
}
