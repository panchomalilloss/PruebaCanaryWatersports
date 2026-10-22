import type { Locale } from "./catalog";

export type Kind =
  | "home"
  | "activities"
  | "catalog"
  | "shop"
  | "company"
  | "contact"
  | "activity"
  | "deposit"
  | "legal"
  | "cart"
  | "checkout"
  | "account"
  | "confirmation"
  | "category"
  | "sample"
  | "posts";

export type PageDef = {
  id: string;
  kind: Kind;
  paths: Partial<Record<Locale, string>>;
  activityId?: string;
  focus?: string;
  deposit?: number;
  legal?: "privacy" | "notice" | "refund";
  activities?: string[];
  deposits?: boolean;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

const T = {
  brand: "Canary Watersports",
};

export const pages: PageDef[] = [
  {
    id: "home",
    kind: "home",
    paths: { en: "/", es: "/es/", de: "/de/" },
    title: {
      en: "Water Sports in Puerto Rico, Gran Canaria | Canary Watersports",
      es: "Deportes acuáticos en Puerto Rico, Gran Canaria | Canary Watersports",
      de: "Wassersport in Puerto Rico, Gran Canaria | Canary Watersports",
    },
    description: {
      en: "Book jet ski, jet ski safari, parascending and the El Diablo jet boat in Puerto Rico, Gran Canaria. See available times and reserve online.",
      es: "Reserva motos de agua, safari, parascending y el jet boat El Diablo en Puerto Rico, Gran Canaria. Consulta horarios libres y reserva online.",
      de: "Buchen Sie Jetski, Jetski-Safari, Paragliding und das Jetboot El Diablo in Puerto Rico, Gran Canaria. Freie Zeiten online sehen.",
    },
  },
  {
    id: "activities",
    kind: "activities",
    paths: { en: "/activities/", es: "/es/actividades/", de: "/de/aktivitaeten/" },
    title: {
      en: "Activities - Canary Watersports",
      es: "Actividades - Canary Watersports",
      de: "Aktivitäten - Canary Watersports",
    },
    description: {
      en: "Jet ski, safari, parascending, Crazy Sofa and jet boat in Puerto Rico, Gran Canaria.",
      es: "Motos de agua, safari, parascending, Crazy Sofá y jet boat en Puerto Rico, Gran Canaria.",
      de: "Jetski, Safari, Paragliding, Crazy Sofa und Jetboot in Puerto Rico, Gran Canaria.",
    },
  },
  {
    id: "booking",
    kind: "catalog",
    paths: { en: "/online-booking/", es: "/es/reserva-online/", de: "/de/online-buchen/" },
    title: {
      en: "Online Booking - Canary Watersports",
      es: "Reserva Online - Canary Watersports",
      de: "Online Buchen - Canary Watersports",
    },
    description: {
      en: "Choose a water sports activity in Puerto Rico and book a real available time.",
      es: "Elige una actividad acuática en Puerto Rico y reserva una hora realmente disponible.",
      de: "Wählen Sie eine Wassersport-Aktivität in Puerto Rico und buchen Sie eine freie Uhrzeit.",
    },
  },
  {
    id: "shop",
    kind: "shop",
    paths: { en: "/shop/", es: "/es/tienda-online/", de: "/de/online-shop/" },
    title: { en: "Online Shop - Canary Watersports", es: "Tienda Online - Canary Watersports", de: "Online Shop - Canary Watersports" },
    description: {
      en: "Activities and packs available to book with Canary Watersports.",
      es: "Actividades y packs disponibles para reservar con Canary Watersports.",
      de: "Aktivitäten und Pakete zum Buchen bei Canary Watersports.",
    },
  },
  {
    id: "company",
    kind: "company",
    paths: { en: "/our-company/", es: "/es/nuestra-empresa/", de: "/de/unser-unternehmen/" },
    title: { en: "Our Company - Canary Watersports", es: "Nuestra Empresa - Canary Watersports", de: "Unser Unternehmen - Canary Watersports" },
    description: {
      en: "Canary Watersports has operated in Puerto Rico, Gran Canaria for more than 25 years.",
      es: "Canary Watersports opera en Puerto Rico, Gran Canaria desde hace más de 25 años.",
      de: "Canary Watersports ist seit über 25 Jahren in Puerto Rico, Gran Canaria, tätig.",
    },
  },
  {
    id: "contact",
    kind: "contact",
    paths: { en: "/contact/", es: "/es/contacto/", de: "/de/kontakt/" },
    title: { en: "Contact - Canary Watersports", es: "Contacto - Canary Watersports", de: "Kontakt - Canary Watersports" },
    description: {
      en: "Puerto Escala, Puerto Rico, Mogán. Phone, WhatsApp and email for Canary Watersports.",
      es: "Puerto Escala, Puerto Rico, Mogán. Teléfono, WhatsApp y correo de Canary Watersports.",
      de: "Puerto Escala, Puerto Rico, Mogán. Telefon, WhatsApp und E-Mail von Canary Watersports.",
    },
  },
  activity("jet-ski", "jet-ski", undefined, {
    en: "/jet-ski/",
    es: "/es/motos-de-agua-gran-canaria/",
    de: "/de/jetski-gran-canaria/",
  }, {
    en: "Jet Ski Puerto Rico Gran Canaria - The Ultimate Water Adventure",
    es: "Motos de Agua Gran Canaria - Canary Watersports",
    de: "Jetski auf Gran Canaria - Canary Watersports",
  }, {
    en: "Experience the thrill of Jet Ski Puerto Rico Gran Canaria and discover the beauty of the coastline on our modern jet skis. Book online now!",
    es: "Vive la emoción de las motos de agua en Gran Canaria con Canary Watersports. Descubre la costa desde una perspectiva única. ¡Reserva hoy!",
    de: "Erleben Sie die pure Aufregung beim Jetski auf Gran Canaria mit Canary Watersports. Unvergessliche Abenteuer auf dem Wasser. Jetzt buchen!",
  }),
  activity("jet-ski-safari", "jet-ski", "safari", {
    en: "/jet-ski-safari/",
    es: "/es/safari-moto-de-agua/",
    de: "/de/jetski-safari/",
  }, {
    en: "Jet Ski Safari Gran Canaria | Canary Watersports",
    es: "Safari en moto de agua Gran Canaria | Canary Watersports",
    de: "Jetski Safari Gran Canaria | Canary Watersports",
  }, {
    en: "Guided jet ski safari from Puerto Rico, Gran Canaria. One or two hours, with a monitor, from the floating platform.",
    es: "Safari guiado en moto de agua desde Puerto Rico, Gran Canaria. Una o dos horas, con monitor, desde la plataforma flotante.",
    de: "Geführte Jetski-Safari ab Puerto Rico, Gran Canaria. Eine oder zwei Stunden mit Guide, ab der schwimmenden Plattform.",
  }),
  activity("parascending", "parasailing", undefined, {
    en: "/parascending/",
    es: "/es/parascending-2/",
    de: "/de/paragliding/",
  }, {
    en: "Parascending - Canary Watersports - Puerto Rico Gran Canaria",
    es: "Parascending Puerto Rico, Gran Canaria - Canary Watersports",
    de: "Paragliding Puerto Rico Gran Canaria - Canary Watersports",
  }, {
    en: "Parascending or Paragliding in Puerto Rico, Gran Canaria: The impressive mountain panorama and amazing blue ocean under your feet",
    es: "Parascending Puerto Rico: ¡El impresionante panorama de la montaña y el increíble océano azul bajo tus pies te dejarán sin aliento!",
    de: "Paragliding: Das beeindruckende Bergpanorama und das atemberaubende blaue Meer unter Ihren Füßen werden Sie des Atems berauben!",
  }),
  activity("crazy-sofa", "crazy-sofa", undefined, {
    en: "/banana-ride/",
    es: "/es/banana-ride-2/",
    de: "/de/banana-boot-tour/",
  }, {
    en: "CRAZY SOFA - Canary Watersports",
    es: "CRAZY SOFÁ - Canary Watersports",
    de: "CRAZY SOFA - Canary Watersports",
  }, {
    en: "Crazy Sofa in Puerto Rico, Gran Canaria. A family tow ride. Currently not available to book.",
    es: "Crazy Sofá en Puerto Rico, Gran Canaria. Un paseo familiar. Ahora mismo no se puede reservar.",
    de: "Crazy Sofa in Puerto Rico, Gran Canaria. Eine Familienfahrt. Derzeit nicht buchbar.",
  }),
  activity("jet-boat", "jet-boat", undefined, {
    en: "/jet-boat-el-diablo/",
    es: "/es/jet-boat-el-diablo-2/",
    de: "/de/jet-boot-el-diablo/",
  }, {
    en: "Jet Boat El Diablo - Canary Watersports",
    es: "Jet Boat El Diablo - Canary Watersports",
    de: "Jet-boot El Diablo - Canary Watersports",
  }, {
    en: "Jet boat El Diablo in Puerto Rico: 20 minutes, two Chevrolet engines and 850 HP.",
    es: "Jet Boat El Diablo en Puerto Rico: 20 minutos, dos motores Chevrolet y 850 CV.",
    de: "Jetboot El Diablo in Puerto Rico: 20 Minuten, zwei Chevrolet-Motoren und 850 PS.",
  }),
  product("product-jet-ski", "jet-ski", { en: "/product/jet-ski-puerto-rico/", es: "/es/producto/jet-ski-puerto-rico/", de: "/de/produkt/jet-ski-puerto-rico/" }),
  product("product-parasail", "parasailing", { en: "/product/parascending-puerto-rico/", es: "/es/producto/parascending-puerto-rico/", de: "/de/produkt/parascending-puerto-rico/" }),
  product("product-sofa", "crazy-sofa", { en: "/product/banana-ride-puerto-rico/", es: "/es/producto/banana-ride-puerto-rico/", de: "/de/produkt/banana-ride-puerto-rico/" }),
  product("product-boat", "jet-boat", {
    en: "/product/jet-boat-ride-puerto-rico/",
    es: "/es/producto/jet-boat-ride-puerto-rico/",
    de: "/de/produkt/jet-boot-fahrt-puerto-rico/",
  }),
  product("product-pack-2", "pack-2", { en: "/product/offer-1-pack-2-watersport-activities/", es: "/es/producto/offer-1-pack-2-watersport-activities/", de: "/de/produkt/offer-1-pack-2-watersport-activities/" }),
  product("product-pack-3", "pack-3", { en: "/product/offer-2-pack-3-watersport-activities/", es: "/es/producto/offer-2-pack-3-watersport-activities/", de: "/de/produkt/offer-2-pack-3-watersport-activities/" }),
  deposit("deposit-20", 2000, { en: "/product/20-deposit/", es: "/es/producto/20e-deposito/", de: "/de/produkt/20-kaution/" }),
  deposit("deposit-30", 3000, { en: "/product/30-deposit/", es: "/es/producto/30-deposito/", de: "/de/produkt/30e-kaution-canary-watersports/" }),
  deposit("deposit-50", 5000, { en: "/product/50-deposit/", es: "/es/producto/50-deposito/", de: "/de/produkt/50-kaution/" }),
  legal("privacy", "privacy", {
    en: "/politica-de-privacidad/",
    es: "/es/politica-de-privacidad/",
    de: "/de/politica-de-privacidad/",
  }, { en: "Política de Privacidad - Canary Watersports", es: "Política de Privacidad - Canary Watersports", de: "Política de Privacidad - Canary Watersports" }),
  legal("notice", "notice", {
    en: "/aviso-legal/",
    es: "/es/aviso-legal/",
    de: "/de/aviso-legal/",
  }, { en: "Aviso Legal - Canary Watersports", es: "Aviso Legal - Canary Watersports", de: "Aviso Legal - Canary Watersports" }),
  legal("refund", "refund", {
    en: "/refund_returns/",
    es: "/es/devoluciones/",
    de: "/de/rueckerstattungen/",
  }, { en: "Refund Policy - Canary Watersports", es: "DEVOLUCIONES - Canary Watersports", de: "Rückerstattungen - Canary Watersports" }),
  {
    id: "cart",
    kind: "cart",
    paths: { en: "/cart/", es: "/es/cart/", de: "/de/cart/" },
    title: { en: "Cart - Canary Watersports", es: "Carrito - Canary Watersports", de: "Einkaufskorb - Canary Watersports" },
    description: { en: "Your Canary Watersports booking.", es: "Tu reserva de Canary Watersports.", de: "Ihre Buchung bei Canary Watersports." },
  },
  {
    id: "checkout",
    kind: "checkout",
    paths: { en: "/checkout/", es: "/es/checkout/", de: "/de/checkout/" },
    title: { en: "Checkout - Canary Watersports", es: "Finalizar reserva - Canary Watersports", de: "Kasse - Canary Watersports" },
    description: { en: "Pay for your Canary Watersports booking.", es: "Paga tu reserva de Canary Watersports.", de: "Bezahlen Sie Ihre Buchung." },
  },
  {
    id: "account",
    kind: "account",
    paths: { en: "/my-account/" },
    title: { en: "My account - Canary Watersports", es: "My account - Canary Watersports", de: "My account - Canary Watersports" },
    description: { en: "Look up a Canary Watersports booking with its reference and email.", es: "Consulta una reserva con su referencia y correo.", de: "Buchung mit Referenz und E-Mail finden." },
  },
  {
    id: "sample",
    kind: "sample",
    paths: { en: "/sample-page/" },
    title: { en: "Sample SHOP Page - Canary Watersports", es: "Sample SHOP Page - Canary Watersports", de: "Sample SHOP Page - Canary Watersports" },
    description: { en: "Activity list published on the original sample shop page.", es: "Listado de actividades.", de: "Aktivitätsliste." },
  },
  {
    id: "posts",
    kind: "posts",
    paths: { en: "/category/activities/" },
    title: { en: "Activities - Canary Watersports", es: "Activities - Canary Watersports", de: "Activities - Canary Watersports" },
    description: { en: "Water sports activities in Puerto Rico, Gran Canaria.", es: "Actividades acuáticas en Puerto Rico.", de: "Wassersport in Puerto Rico." },
  },
  category("cat-all", ["jet-ski", "parasailing", "crazy-sofa", "jet-boat", "pack-2", "pack-3"], true, {
    en: "/product-category/uncategorized/",
    es: "/es/categoria-producto/actividades/",
    de: "/de/produkt-kategorie/aktivitaten/",
  }),
  category("cat-jet", ["jet-ski"], false, {
    en: "/product-category/uncategorized/jet-ski/",
    es: "/es/categoria-producto/actividades/moto-acuatica/",
    de: "/de/produkt-kategorie/aktivitaten/jet-ski-de/",
  }),
  category("cat-para", ["parasailing"], false, {
    en: "/product-category/uncategorized/parasailing/",
    es: "/es/categoria-producto/actividades/parasailing-es/",
    de: "/de/produkt-kategorie/aktivitaten/parasailing-de/",
  }),
  category("cat-sofa", ["crazy-sofa"], false, {
    en: "/product-category/uncategorized/banana/",
    es: "/es/categoria-producto/actividades/banana-es/",
    de: "/de/produkt-kategorie/aktivitaten/banana-de/",
  }),
  category("cat-boat", ["jet-boat"], false, {
    en: "/product-category/uncategorized/speed-boat-tour/",
    es: "/es/categoria-producto/actividades/speed-boat-tour-es/",
    de: "/de/produkt-kategorie/aktivitaten/schnellboottour/",
  }),
  category("cat-packs", ["pack-2", "pack-3"], false, {
    en: "/product-category/watersports-packs/",
    es: "/es/categoria-producto/packs-de-deportes-acuaticos/",
    de: "/de/produkt-kategorie/wassersport-pakete/",
  }),
  category("tag-adrenaline", ["jet-ski", "parasailing", "crazy-sofa", "jet-boat", "pack-2", "pack-3"], true, {
    en: "/product-tag/adrenaline/",
    es: "/es/etiqueta-producto/adrenalina/",
    de: "/de/produkt-schlagwort/adrenalin/",
  }),
  category("tag-outdoor", ["jet-ski", "parasailing", "crazy-sofa", "jet-boat", "pack-2", "pack-3"], true, {
    en: "/product-tag/outdoor-activity/",
    es: "/es/etiqueta-producto/actividad-al-aire-libre/",
    de: "/de/produkt-schlagwort/ausenaktivitat/",
  }),
  category("tag-family", ["jet-ski", "crazy-sofa", "jet-boat", "pack-2", "pack-3"], true, {
    en: "/product-tag/family-friendly/",
    es: "/es/etiqueta-producto/amigable-para-la-familia/",
    de: "/de/produkt-schlagwort/familienfreundlich/",
  }),
  category("tag-team", ["jet-ski", "parasailing", "pack-2", "pack-3"], false, {
    en: "/product-tag/team-building/",
    es: "/es/etiqueta-producto/team-building-es/",
    de: "/de/produkt-schlagwort/teambildung/",
  }),
];

function activity(id: string, activityId: string, focus: string | undefined, paths: Record<Locale, string>, title: Record<Locale, string>, description: Record<Locale, string>): PageDef {
  return { id, kind: "activity", activityId, focus, paths, title, description };
}

function product(id: string, activityId: string, paths: Record<Locale, string>): PageDef {
  const names = { "jet-ski": "Jet Ski", parasailing: "Parascending", "crazy-sofa": "Crazy Sofa", "jet-boat": "Jet Boat", "pack-2": "Pack 2", "pack-3": "Pack 3" } as Record<string, string>;
  const name = names[activityId];
  return {
    id,
    kind: "activity",
    activityId,
    paths,
    title: { en: `${name} – Puerto Rico - Canary Watersports`, es: `${name} – Puerto Rico - Canary Watersports`, de: `${name} – Puerto Rico - Canary Watersports` },
    description: {
      en: `Book ${name} in Puerto Rico, Gran Canaria, on an available date and time.`,
      es: `Reserva ${name} en Puerto Rico, Gran Canaria, en una fecha y hora disponibles.`,
      de: `Buchen Sie ${name} in Puerto Rico, Gran Canaria, zu einem freien Termin.`,
    },
  };
}

function deposit(id: string, amount: number, paths: Record<Locale, string>): PageDef {
  return {
    id,
    kind: "deposit",
    deposit: amount,
    paths,
    title: { en: `${amount / 100}€ Deposit - Canary Watersports`, es: `${amount / 100}€ Depósito - Canary Watersports`, de: `${amount / 100}€ Anzahlung - Canary Watersports` },
    description: {
      en: "Reserve a chosen activity with a deposit and pay the rest on the day, in cash at the kiosk.",
      es: "Reserva la actividad con un depósito y paga el resto el mismo día, en efectivo en el quiosco.",
      de: "Reservieren Sie mit einer Anzahlung und zahlen Sie den Rest am Tag bar am Kiosk.",
    },
  };
}

function legal(id: string, kind: "privacy" | "notice" | "refund", paths: Record<Locale, string>, title: Record<Locale, string>): PageDef {
  return { id, kind: "legal", legal: kind, paths, title, description: { en: title.en, es: title.es, de: title.de } };
}

function category(id: string, activities: string[], deposits: boolean, paths: Record<Locale, string>): PageDef {
  return {
    id,
    kind: "category",
    activities,
    deposits,
    paths,
    title: { en: `${T.brand}`, es: `${T.brand}`, de: `${T.brand}` },
    description: {
      en: "Water sports activities from Canary Watersports in Puerto Rico, Gran Canaria.",
      es: "Actividades acuáticas de Canary Watersports en Puerto Rico, Gran Canaria.",
      de: "Wassersport von Canary Watersports in Puerto Rico, Gran Canaria.",
    },
  };
}

const lookup = new Map<string, { page: PageDef; locale: Locale }>();
for (const page of pages) {
  for (const locale of ["en", "es", "de"] as Locale[]) {
    const path = page.paths[locale];
    if (path) lookup.set(strip(path), { page, locale });
  }
}

export function strip(path: string) {
  const clean = path.split("?")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

export function withSlash(path: string) {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export type Resolved = { page: PageDef; locale: Locale; reference?: string };

export function resolve(pathname: string): Resolved | null {
  const clean = strip(pathname);
  const found = lookup.get(clean);
  if (found) return found;
  const parts = clean.split("/").filter(Boolean);
  const prefix = parts[0] === "es" || parts[0] === "de" ? parts[0] : null;
  const rest = prefix ? parts.slice(1) : parts;
  if (rest[0] === "booking" && rest[1]) {
    const page: PageDef = { id: "confirmation", kind: "confirmation", paths: {}, title: { en: "Booking", es: "Reserva", de: "Buchung" }, description: { en: "Your Canary Watersports booking.", es: "Tu reserva de Canary Watersports.", de: "Ihre Buchung bei Canary Watersports." } };
    return { page, locale: prefix || "en", reference: decodeURIComponent(rest[1]) };
  }
  return null;
}

export function alternates(page: PageDef, site: string) {
  const languages: Record<string, string> = {};
  for (const locale of ["en", "es", "de"] as Locale[]) {
    const path = page.paths[locale];
    if (path) languages[locale] = site + withSlash(path);
  }
  if (page.paths.en) languages["x-default"] = site + withSlash(page.paths.en);
  return languages;
}

export function pathFor(pageId: string, locale: Locale) {
  const page = pages.find((item) => item.id === pageId);
  return page?.paths[locale] ? withSlash(page.paths[locale]!) : null;
}

export function switchPath(pathname: string, locale: Locale) {
  const found = lookup.get(strip(pathname));
  if (!found) return locale === "en" ? "/" : `/${locale}/`;
  return withSlash(found.page.paths[locale] || found.page.paths.en || "/");
}

export const indexable = pages.filter((page) => !["cart", "checkout", "account"].includes(page.kind));
