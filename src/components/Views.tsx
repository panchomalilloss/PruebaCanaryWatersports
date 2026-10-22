import Image from "next/image";
import Link from "next/link";
import { COMPANY, type Locale } from "@/content/catalog";
import { advantages, homeFaq, stories, team } from "@/content/editorial";
import type { Copy } from "@/content/ui";
import { pages, pathFor, withSlash } from "@/content/routes";
import { money, text } from "@/lib/format";
import { prisma } from "@/server/db";
import { BookingWidget, type WidgetPart, type WidgetVariant } from "./BookingWidget";
import legalText from "@/content/legal/texts.json";

const order = ["jet-ski", "parasailing", "jet-boat", "crazy-sofa", "pack-2", "pack-3"];

export async function loadCards(locale: Locale) {
  const rows = await prisma.activity.findMany({ include: { variants: { where: { active: true } } }, orderBy: { sort: "asc" } });
  return rows.map((row) => {
    const priced = row.variants.filter((variant) => variant.focus !== "passenger").sort((a, b) => a.priceCents - b.priceCents);
    return {
    id: row.id,
    name: text(row.names, locale),
    summary: text(row.summaries, locale),
    image: row.image,
    bookable: row.bookable,
    from: priced[0]?.priceCents ?? 0,
    unit: priced[0]?.pricingUnit ?? "person",
    minutes: priced[0]?.durationMinutes ?? 0,
    href: withSlash(pages.find((page) => page.kind === "activity" && page.activityId === row.id && !page.id.startsWith("product") && page.focus == null)?.paths[locale] || "/"),
  }; });
}

export async function HomeView({ locale, copy }: { locale: Locale; copy: Copy }) {
  const cards = await loadCards(locale);
  const featured = cards.filter((card) => ["jet-ski", "parasailing", "crazy-sofa", "jet-boat"].includes(card.id));
  const packs = cards.filter((card) => card.id.startsWith("pack"));
  const book = pathFor("booking", locale) || "/online-booking/";
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-brand-navy text-white">
        <Image src="/media/jetski-hero.webp" alt={locale === "es" ? "Moto de agua en Puerto Rico, Gran Canaria" : locale === "de" ? "Jetski in Puerto Rico, Gran Canaria" : "Jet ski in Puerto Rico, Gran Canaria"} fill priority className="animate-drift object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/55 to-brand-blue/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-page animate-rise flex-col justify-end px-4 pb-24 pt-16">
          <p className="w-fit rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-black">Puerto Rico · Gran Canaria</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-[0.86] sm:text-8xl">
            {locale === "es" ? "Deportes acuáticos en Puerto Rico, Gran Canaria" : locale === "de" ? "Wassersport in Puerto Rico, Gran Canaria" : "Water sports in Puerto Rico, Gran Canaria"}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">
            {locale === "es" ? "Jet ski, safari, parascending, Crazy Sofá y el jet boat El Diablo. Eliges el día y ves las horas que de verdad están libres." : locale === "de" ? "Jetski, Safari, Paragliding, Crazy Sofa und das Jetboot El Diablo. Sie wählen den Tag und sehen die Zeiten, die wirklich frei sind." : "Jet ski, safari, parascending, Crazy Sofa and the El Diablo jet boat. Pick a day and see the times that are actually free."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={book} className="btn btn-yellow">{copy.book}</Link>
            <Link href={pathFor("activities", locale) || "/activities/"} className="btn btn-ghost">{copy.explore}</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-16">
        <SectionTitle title={copy.activities} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {featured.map((card, index) => <ActivityCard key={card.id} card={card} copy={copy} locale={locale} delay={index * 80} />)}
        </div>
      </section>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="mx-auto grid max-w-page gap-4 px-4 py-16 md:grid-cols-4">
          {advantages[locale].map((item, index) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-yellow/60">
              <p className="font-display text-4xl text-brand-yellow">0{index + 1}</p>
              <h2 className="mt-2 font-display text-2xl uppercase">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-16">
        <SectionTitle title={copy.packs} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">{packs.map((card) => <ActivityCard key={card.id} card={card} copy={copy} locale={locale} />)}</div>
      </section>
      <section className="mx-auto max-w-page px-4 py-4">
        <SectionTitle title={copy.stepsTitle} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <article key={step} className="group relative overflow-hidden rounded-[1.75rem] bg-brand-black p-7 text-white transition duration-300 hover:-translate-y-1">
              <div className="absolute -right-6 -top-8 font-display text-8xl text-white/5 transition duration-500 group-hover:text-brand-yellow/20">0{index + 1}</div>
              <p className="font-display text-5xl text-brand-yellow">0{index + 1}</p>
              <h3 className="mt-3 font-display text-3xl uppercase">{step}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-16">
        <SectionTitle title={copy.gallery} />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["/media/parasail-wide.webp", "/media/jetski-safari-amadores.webp", "/media/jetboat-post.webp", "/media/harbour.webp"].map((src, index) => (
            <div key={src} className={`shot group relative overflow-hidden rounded-[1.6rem] ${index === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/3]"}`}>
              <Image src={src} alt="" fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
        <Video />
      </section>
      <section className="mx-auto max-w-page px-4">
        <h2 className="font-display text-4xl uppercase">{copy.reviewsTitle}</h2>
        <p className="mt-3 max-w-2xl text-muted">{copy.reviewsBody}</p>
        <a className="mt-4 inline-flex font-semibold text-brand-blueDeep" href={COMPANY.mapLink}>{copy.reviewsCta}</a>
      </section>
      <MapBlock copy={copy} />
      <FaqList title={copy.faq} items={homeFaq[locale]} />
      <section className="mx-auto max-w-page px-4 py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-yellow px-6 py-12 text-black shadow-lift">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/50" />
          <h2 className="relative max-w-3xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl">{copy.finalCta}</h2>
          <Link href={book} className="btn relative mt-8 bg-brand-black text-white shadow-lift">{copy.book}</Link>
        </div>
      </section>
      <JsonLd data={businessJson()} />
    </>
  );
}

function SectionTitle({ title, as = "h2" }: { title: string; as?: "h1" | "h2" }) {
  const Tag = as;
  return (
    <div>
      <p className="h-1 w-12 rounded-full bg-brand-yellow" />
      <Tag className="mt-3 font-display text-5xl uppercase leading-none">{title}</Tag>
    </div>
  );
}

function ActivityCard({ card, copy, locale, delay = 0 }: { card: Awaited<ReturnType<typeof loadCards>>[number]; copy: Copy; locale: Locale; delay?: number }) {
  return (
    <article className="card-lift animate-rise overflow-hidden rounded-[1.75rem] bg-white shadow-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="shot group relative aspect-[16/10]">
        <Image src={card.image} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-transparent to-transparent" />
        <p className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-sm font-semibold text-black">{copy.from} {money(card.from, locale)}</p>
        <h3 className="absolute bottom-4 left-4 right-4 font-display text-4xl uppercase leading-none text-white">{card.name}</h3>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-muted">{card.summary}</p>
        {!card.bookable ? <p className="mt-3 text-sm font-semibold text-brand-blueDeep">{copy.unavailable}</p> : null}
        <Link href={card.href} className="btn mt-4 bg-brand-blue text-sm text-white shadow-card">{copy.availability}</Link>
      </div>
    </article>
  );
}

export async function ActivityView({ locale, copy, activityId, focus, pathname }: { locale: Locale; copy: Copy; activityId: string; focus?: string; pathname: string }) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: { variants: { where: { active: true }, orderBy: { sort: "asc" }, include: { packComponents: { include: { component: true }, orderBy: { sort: "asc" } } } } },
  });
  if (!activity) return null;
  const story = stories[activityId][locale];
  const shown = activity.variants.filter((variant) => (focus ? variant.focus === focus : true));
  const main = activity.isPack ? activity.variants : shown;
  const variants: WidgetVariant[] = main.map((variant) => ({
    id: variant.id,
    name: text(variant.names, locale),
    blurb: text(variant.blurbs, locale),
    priceCents: variant.priceCents,
    pricingUnit: variant.pricingUnit,
    durationMinutes: variant.durationMinutes,
    bufferMinutes: variant.bufferMinutes,
    minParticipants: variant.minParticipants,
    maxParticipants: variant.maxParticipants,
    participantStep: variant.participantStep,
    allowSpectators: variant.allowSpectators,
  }));
  const parts: WidgetPart[] = activity.isPack
    ? (activity.variants[0]?.packComponents ?? []).map((part) => ({
        variantId: part.componentVariantId,
        name: text(part.component.names, locale),
        slotMode: part.slotMode as "one" | "perPair",
        durationMinutes: part.component.durationMinutes,
        bufferMinutes: part.component.bufferMinutes,
      }))
    : [];
  const cards = await loadCards(locale);
  const h1 = focus === "safari" ? (locale === "es" ? "Safari en moto de agua en Gran Canaria" : locale === "de" ? "Jetski-Safari auf Gran Canaria" : "Jet ski safari in Gran Canaria") : story.h1;
  return (
    <article className="mx-auto grid max-w-page gap-8 px-4 py-10 lg:grid-cols-[1.3fr_0.8fr]">
      <div className="animate-rise">
        <p className="text-sm text-muted"><Link href={locale === "en" ? "/" : `/${locale}/`}>{copy.home}</Link> / {text(activity.names, locale)}</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-[0.9] sm:text-7xl">{h1}</h1>
        <p className="mt-4 text-lg leading-8">{focus === "safari" ? story.blocks[1].paragraphs[0] : story.lead}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(focus === "safari" ? story.shots.slice(2) : story.shots).map((shot) => (
            <div key={shot.src} className="shot group relative aspect-[4/3] overflow-hidden rounded-[1.6rem] shadow-card">
              <Image src={shot.src} alt={shot.alt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 40vw" />
            </div>
          ))}
        </div>
        {(focus === "safari" ? story.blocks.slice(1) : story.blocks).map((block) => (
          <section key={block.h2} className="mt-8">
            <h2 className="font-display text-3xl uppercase">{block.h2}</h2>
            {block.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-7">{paragraph}</p>)}
          </section>
        ))}
        <section className="mt-8">
          <h2 className="font-display text-3xl uppercase">{copy.included}</h2>
          <ul className="mt-3 list-disc pl-5 leading-7">{story.includes.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="mt-8">
          <h2 className="font-display text-3xl uppercase">{copy.requirements}</h2>
          <ul className="mt-3 list-disc pl-5 leading-7">{story.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="mt-8">
          <h2 className="font-display text-3xl uppercase">{copy.meet}</h2>
          <p className="mt-3 leading-7">{COMPANY.meetingPoint}. {copy.parking} {copy.bus}: {COMPANY.busStop}. {COMPANY.buses}.</p>
        </section>
        <section className="mt-8">
          <h2 className="font-display text-3xl uppercase">{copy.cancel}</h2>
          <p className="mt-3 leading-7">{story.faqs.find((item) => /cancel|storn|devol/i.test(item.q))?.a}</p>
        </section>
        <FaqList title={copy.faq} items={story.faqs} />
        <h2 className="mt-10 font-display text-3xl uppercase">{copy.related}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cards.filter((card) => card.id !== activityId).slice(0, 2).map((card) => <Link key={card.id} href={card.href} className="card-lift rounded-2xl border border-brand-yellow/40 bg-white p-4 font-display text-2xl uppercase shadow-card">{card.name}</Link>)}
        </div>
      </div>
      <BookingWidget locale={locale} copy={copy} bookable={activity.bookable} isPack={activity.isPack} variants={variants} parts={parts} checkoutPath={pathFor("checkout", locale) || "/checkout/"} inventoryNotice={process.env.INVENTORY_SOURCE !== "live"} />
      <JsonLd data={serviceJson(locale, h1, focus === "safari" ? h1 : story.lead, pathname, activity.bookable ? (variants[0]?.priceCents ?? 0) : 0)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: story.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) }} />
    </article>
  );
}

export async function CatalogView({ locale, copy, ids, showDeposits = false }: { locale: Locale; copy: Copy; ids?: string[]; showDeposits?: boolean }) {
  const cards = (await loadCards(locale)).filter((card) => !ids || ids.includes(card.id));
  return (
    <section className="mx-auto max-w-page px-4 py-12">
      <SectionTitle as="h1" title={copy.activities} />
      <div className="mt-6 grid gap-5 md:grid-cols-2">{cards.map((card) => <ActivityCard key={card.id} card={card} copy={copy} locale={locale} />)}</div>
      {showDeposits ? (
        <ul className="mt-8 space-y-2 text-brand-blueDeep">
          {[20, 30, 50].map((amount) => {
            const page = pages.find((item) => item.deposit === amount * 100);
            const href = page?.paths[locale];
            return href ? <li key={amount}><Link href={withSlash(href)}>{amount} EUR</Link></li> : null;
          })}
        </ul>
      ) : null}
    </section>
  );
}

export function CompanyView({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <article className="mx-auto max-w-page px-4 py-12">
      <SectionTitle as="h1" title={copy.company} />
      <p className="mt-4 max-w-3xl text-lg leading-8">{advantages[locale][0].text} {locale === "es" ? "Vigilamos la seguridad en el agua." : locale === "de" ? "Wir achten auf dem Wasser auf Ihre Sicherheit." : "We watch the safety of the session on the water."}</p>
      <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-3xl">
        <Image src="/media/team.webp" alt={locale === "es" ? "Equipo de Canary Watersports" : "Canary Watersports team"} fill className="object-cover" sizes="100vw" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {team.map((person) => (
          <figure key={person.name} className="card-lift overflow-hidden rounded-[1.6rem] bg-white shadow-card">
            <div className="relative aspect-square"><Image src={person.src} alt={`${person.name}, ${person.role[locale]}`} fill className="object-cover" sizes="33vw" /></div>
            <figcaption className="p-4"><strong>{person.name}</strong><span className="mt-1 block text-sm text-muted">{person.role[locale]}</span></figcaption>
          </figure>
        ))}
      </div>
      <h2 className="mt-10 font-display text-3xl uppercase">{locale === "es" ? "Seguros del barco de parascending" : locale === "de" ? "Versicherungen des Paragliding-Boots" : "Parascending boat insurance"}</h2>
      <ul className="mt-3 list-disc pl-5 leading-7">
        {(locale === "es" ? ["Responsabilidad civil", "Responsabilidad pública", "Accidentes durante el vuelo", "Accidentes en el barco"] : locale === "de" ? ["Haftpflicht", "Betriebshaftpflicht", "Unfälle im Flug", "Unfälle an Bord"] : ["Civil liability", "Public liability", "Accidents during the flight", "Accidents on the boat"]).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

export function ContactView({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <article className="mx-auto grid max-w-page gap-8 px-4 py-12 lg:grid-cols-2">
      <div>
        <SectionTitle as="h1" title={copy.contact} />
        <p className="mt-4 text-lg">{COMPANY.meetingPoint}</p>
        <p className="mt-4 leading-8">
          <a className="block" href={COMPANY.phoneHref}>{COMPANY.phone}</a>
          <a className="block" href={COMPANY.whatsappHref}>WhatsApp {COMPANY.whatsapp}</a>
          <a className="block" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>
        <p className="mt-4">{locale === "es" ? "Todos los días" : locale === "de" ? "Täglich" : "Every day"} {COMPANY.hours}</p>
        <p className="mt-4 text-sm text-muted">{COMPANY.legalName}<br />{COMPANY.cif}<br />{COMPANY.registeredOffice}</p>
      </div>
      <MapBlock copy={copy} />
    </article>
  );
}

export function LegalView({ locale, kind }: { locale: Locale; kind: "privacy" | "notice" | "refund" }) {
  const body = legalText[locale][kind];
  const translated = !(locale !== "en" && kind !== "refund" && body === legalText.en[kind]);
  const note = kind !== "refund" && locale === "de"
    ? "Der auf der bisherigen Website veröffentlichte Rechtstext ist Spanisch. Unten steht genau dieser Text."
    : kind !== "refund" && locale === "en"
      ? "The legal text published on the current website is in Spanish. The same text is below."
      : "";
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl uppercase">{kind === "refund" ? (locale === "es" ? "Devoluciones" : locale === "de" ? "Rückerstattungen" : "Refunds") : kind === "notice" ? "Aviso legal" : "Política de privacidad"}</h1>
      {note ? <p className="mt-4 rounded-2xl bg-white p-4 text-sm">{note}</p> : null}
      <div className="mt-6 whitespace-pre-wrap leading-7">{body}</div>
      {translated ? null : null}
    </article>
  );
}

export function DepositView({ locale, copy, cents }: { locale: Locale; copy: Copy; cents: number }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl uppercase">{money(cents, locale)}</h1>
      <p className="mt-4 leading-7">{copy.payDeposit}. {copy.restCash}</p>
      <p className="mt-3 leading-7">{locale === "es" ? "El depósito ya no se compra suelto: se aplica a una hora libre de la actividad que elijas." : locale === "de" ? "Die Anzahlung wird nicht mehr lose gekauft. Sie gilt für eine freie Zeit der gewählten Aktivität." : "The deposit is no longer bought on its own. It is applied to a free time of the activity you choose."}</p>
      <Link href={pathFor("booking", locale) || "/online-booking/"} className="mt-6 inline-flex rounded-full bg-brand-yellow px-5 py-3 font-semibold text-black">{copy.book}</Link>
    </article>
  );
}

export function MapBlock({ copy }: { copy: Copy }) {
  return (
    <section className="mx-auto max-w-page px-4 py-14">
      <SectionTitle title={copy.where} />
      <p className="mt-3">{COMPANY.meetingPoint}</p>
      <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-brand-yellow/50 shadow-card">
        <iframe title={copy.where} src={COMPANY.mapEmbed} className="h-80 w-full" loading="lazy" />
      </div>
      <a className="mt-3 inline-flex font-semibold text-brand-blueDeep" href={COMPANY.mapLink}>{copy.openMap}</a>
    </section>
  );
}

export function FaqList({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section className="mx-auto max-w-page px-4 py-10">
      <SectionTitle title={title} />
      <div className="mt-4 divide-y divide-line rounded-[1.6rem] bg-white px-5 shadow-card">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">{item.q}<span className="float-right text-brand-blue transition group-open:rotate-45">+</span></summary>
            <p className="mt-2 leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Video() {
  return (
    <div className="mt-4">
      <a href={`https://www.youtube.com/watch?v=${COMPANY.videoId}`} className="group relative mt-4 block aspect-video overflow-hidden rounded-[1.6rem] shadow-card">
        <img src={`https://i.ytimg.com/vi/${COMPANY.videoId}/hqdefault.jpg`} alt="Jet Ski Safari at Canary Watersports, Puerto Rico" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-yellow text-2xl text-black shadow-lift transition group-hover:scale-110">▶</span>
      </a>
    </div>
  );
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function businessJson() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Canary Watersports",
    legalName: COMPANY.legalName,
    url: "https://www.canarywatersports.com/",
    telephone: COMPANY.phone,
    email: COMPANY.email,
    image: "https://www.canarywatersports.com/wp-content/uploads/2021/07/logo_1.png",
    address: { "@type": "PostalAddress", streetAddress: "Puerto Escala, Puerto Rico", addressLocality: "Mogán", postalCode: "35130", addressRegion: "Las Palmas", addressCountry: "ES" },
    geo: { "@type": "GeoCoordinates", latitude: COMPANY.lat, longitude: COMPANY.lng },
    openingHours: "Mo-Su 11:00-17:30",
    sameAs: [COMPANY.youtube],
    vatID: COMPANY.cif,
  };
}

function serviceJson(locale: Locale, name: string, description: string, pathname: string, price: number) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.canarywatersports.com";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "LocalBusiness", name: "Canary Watersports" },
    areaServed: "Puerto Rico, Gran Canaria",
    url: site + pathname,
    offers: price ? { "@type": "Offer", priceCurrency: "EUR", price: (price / 100).toFixed(2), availability: "https://schema.org/InStock" } : undefined,
    inLanguage: locale,
  };
}

void order;
