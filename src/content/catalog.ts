export const LOCALES = ["en", "es", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export type L10n = Record<Locale, string>;

export const COMPANY = {
  legalName: "Canary WaterSports 98, S.L.",
  cif: "B76131424",
  registeredOffice: "Urb. Las Torres Nº 9, Blq 9, 5a A-1, 35010 Las Palmas de Gran Canaria",
  meetingPoint: "Puerto Escala, Puerto Rico, 35130 Mogán, Gran Canaria, Spain",
  phone: "+34 928 561 094",
  phoneHref: "tel:+34928561094",
  whatsapp: "+34 619 446 474",
  whatsappHref: "https://wa.me/34619446474",
  email: "info@canarywatersports.com",
  hours: "11:00–17:30",
  openMinutes: 11 * 60,
  closeMinutes: 17 * 60 + 30,
  leadMinutes: 180,
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=-15.728%2C27.776%2C-15.702%2C27.790&layer=mapnik&marker=27.7825069%2C-15.7150581",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Puerto+Escala+Puerto+Rico+Gran+Canaria",
  lat: 27.7825069,
  lng: -15.7150581,
  youtube: "https://www.youtube.com/c/CanaryWaterSports",
  videoId: "_CgQ68fI85A",
  buses: "01, 33, 39, 70, 90, 91",
  busStop: "Puerto Rico (Angry Birds Park)",
};

export const DEPOSITS = [2000, 3000, 5000];

export const resources = [
  {
    id: "jetskis",
    name: "Jet skis",
    capacityEnv: "JETSKI_CAPACITY",
    fallback: 4,
    assumption: true,
    notes:
      "The public website does not state how many jet skis are in the fleet. This starting capacity is a local setting and must be confirmed before production.",
  },
  {
    id: "parasail-boat",
    name: "Parascending boat departures",
    fallback: 1,
    assumption: false,
    notes: "The company describes one parascending boat. One flight occupies the departure.",
  },
  {
    id: "parasail-spectators",
    name: "Parascending spectator seats",
    capacityEnv: "PARASAIL_SPECTATORS",
    fallback: 6,
    assumption: true,
    notes: "Spectator seats are offered at 15 EUR. The exact spare capacity is not published.",
  },
  {
    id: "jetboat-seats",
    name: "Jet boat seats",
    fallback: 10,
    assumption: false,
    notes: "Published maximum is 10 people. A shared departure is planned from 4 seats.",
  },
  {
    id: "sofa-seats",
    name: "Crazy Sofa seats",
    fallback: 6,
    assumption: true,
    notes: "Seat count is taken from the published photo name Crazy-Sofa-6-people. Confirm before reopening the activity.",
  },
] as const;

type ResourceUse = { resourceId: string; basis: "booking" | "participant" | "group"; units: number; groupSize?: number };

export type VariantSeed = {
  id: string;
  activityId: string;
  durationMinutes: number;
  bufferMinutes: number;
  intervalMinutes: number;
  slotRule: "endByClose" | "startBeforeClose";
  minParticipants: number;
  maxParticipants: number;
  participantStep: number;
  priceCents: number;
  pricingUnit: "booking" | "person";
  focus: string;
  sort: number;
  allowSpectators?: boolean;
  names: L10n;
  blurbs: L10n;
  resources: ResourceUse[];
};

export type ActivitySeed = {
  id: string;
  bookable: boolean;
  sort: number;
  image: string;
  isPack: boolean;
  names: L10n;
  summaries: L10n;
};

export const activities: ActivitySeed[] = [
  {
    id: "jet-ski",
    bookable: true,
    sort: 1,
    image: "/media/jetski-hero.webp",
    isPack: false,
    names: { en: "Jet Ski", es: "Motos de agua", de: "Jetski" },
    summaries: {
      en: "25-minute circuits and 1 or 2 hour safaris along the south coast of Gran Canaria.",
      es: "Circuitos de 25 minutos y safaris de 1 o 2 horas por la costa sur de Gran Canaria.",
      de: "25-Minuten-Runden und Safaris von 1 oder 2 Stunden an der Südküste Gran Canarias.",
    },
  },
  {
    id: "parasailing",
    bookable: true,
    sort: 2,
    image: "/media/parasail-1.webp",
    isPack: false,
    names: { en: "Parascending", es: "Parascending", de: "Paragliding" },
    summaries: {
      en: "Single, tandem or triple flights from a 10-metre boat with a 200-metre line.",
      es: "Vuelos individual, tándem o triple desde un barco de 10 metros con 200 metros de cabo.",
      de: "Einzel-, Tandem- oder Dreierflug von einem 10-Meter-Boot mit 200-Meter-Leine.",
    },
  },
  {
    id: "crazy-sofa",
    bookable: false,
    sort: 3,
    image: "/media/sofa.webp",
    isPack: false,
    names: { en: "Crazy Sofa", es: "Crazy Sofá", de: "Crazy Sofa" },
    summaries: {
      en: "A 15-minute family tow. This activity is not available for booking at the moment.",
      es: "Un arrastre familiar de 15 minutos. Esta actividad no está disponible para reservar en este momento.",
      de: "Eine 15-minütige Familienfahrt. Diese Aktivität kann derzeit nicht gebucht werden.",
    },
  },
  {
    id: "jet-boat",
    bookable: true,
    sort: 4,
    image: "/media/jetboat-1.webp",
    isPack: false,
    names: { en: "Jet Boat El Diablo", es: "Jet Boat El Diablo", de: "Jetboot El Diablo" },
    summaries: {
      en: "A 20-minute ride on the jet boat with two Chevrolet engines and 850 HP.",
      es: "Un paseo de 20 minutos en el jet boat con dos motores Chevrolet y 850 CV.",
      de: "Eine 20-minütige Fahrt mit zwei Chevrolet-Motoren und 850 PS.",
    },
  },
  {
    id: "pack-2",
    bookable: true,
    sort: 5,
    image: "/media/combi.webp",
    isPack: true,
    names: { en: "Pack of 2 activities", es: "Pack de 2 actividades", de: "Paket mit 2 Aktivitäten" },
    summaries: {
      en: "Jet ski double for 25 minutes and a tandem parascending flight. 65 EUR per person, minimum 2.",
      es: "Moto de agua doble de 25 minutos y vuelo tándem de parascending. 65 EUR por persona, mínimo 2.",
      de: "Jetski doppelt, 25 Minuten, und ein Tandem-Paragliding. 65 EUR pro Person, mindestens 2.",
    },
  },
  {
    id: "pack-3",
    bookable: true,
    sort: 6,
    image: "/media/jetboat-2.webp",
    isPack: true,
    names: { en: "Pack of 3 activities", es: "Pack de 3 actividades", de: "Paket mit 3 Aktivitäten" },
    summaries: {
      en: "Jet ski double, tandem parascending and a 20-minute jet boat ride. 95 EUR per person, minimum 2.",
      es: "Moto de agua doble, parascending tándem y jet boat de 20 minutos. 95 EUR por persona, mínimo 2.",
      de: "Jetski doppelt, Tandem-Paragliding und 20 Minuten Jetboot. 95 EUR pro Person, mindestens 2.",
    },
  },
];

const ski = (id: string, price: number, people: 1 | 2, minutes: number, interval: number, focus: string, sort: number, names: L10n, blurbs: L10n): VariantSeed => ({
  id,
  activityId: "jet-ski",
  durationMinutes: minutes,
  bufferMinutes: minutes === 25 ? 5 : 0,
  intervalMinutes: interval,
  slotRule: "endByClose",
  minParticipants: people,
  maxParticipants: people,
  participantStep: people,
  priceCents: price,
  pricingUnit: "booking",
  focus,
  sort,
  names,
  blurbs,
  resources:
    people === 2
      ? [{ resourceId: "jetskis", basis: "group", units: 1, groupSize: 2 }]
      : [{ resourceId: "jetskis", basis: "booking", units: 1 }],
});

export const variants: VariantSeed[] = [
  ski("jetski-circuit-single", 6000, 1, 25, 30, "circuit", 1, {
    en: "25-minute single circuit",
    es: "Circuito individual de 25 minutos",
    de: "25 Minuten einzeln",
  }, {
    en: "One Sea-Doo for one person.",
    es: "Una moto Sea-Doo para una persona.",
    de: "Ein Sea-Doo für eine Person.",
  }),
  ski("jetski-circuit-double", 7000, 2, 25, 30, "circuit", 2, {
    en: "25-minute double circuit",
    es: "Circuito doble de 25 minutos",
    de: "25 Minuten zu zweit",
  }, {
    en: "One Sea-Doo shared by two people.",
    es: "Una moto Sea-Doo compartida por dos personas.",
    de: "Ein Sea-Doo für zwei Personen.",
  }),
  ski("jetski-safari-1h-single", 12000, 1, 60, 60, "safari", 3, {
    en: "1-hour single safari",
    es: "Safari individual de 1 hora",
    de: "1 Stunde Safari einzeln",
  }, {
    en: "A guided hour along the south coast.",
    es: "Una hora guiada por la costa sur.",
    de: "Eine geführte Stunde an der Südküste.",
  }),
  ski("jetski-safari-1h-double", 13000, 2, 60, 60, "safari", 4, {
    en: "1-hour double safari",
    es: "Safari doble de 1 hora",
    de: "1 Stunde Safari zu zweit",
  }, {
    en: "Two people on one jet ski for one guided hour.",
    es: "Dos personas en una moto durante una hora guiada.",
    de: "Zwei Personen auf einem Jetski, eine geführte Stunde.",
  }),
  ski("jetski-safari-2h-single", 22000, 1, 120, 60, "safari", 5, {
    en: "2-hour single safari",
    es: "Safari individual de 2 horas",
    de: "2 Stunden Safari einzeln",
  }, {
    en: "The longer guided route for one rider.",
    es: "La ruta guiada más larga para una persona.",
    de: "Die längere geführte Tour für eine Person.",
  }),
  ski("jetski-safari-2h-double", 23000, 2, 120, 60, "safari", 6, {
    en: "2-hour double safari",
    es: "Safari doble de 2 horas",
    de: "2 Stunden Safari zu zweit",
  }, {
    en: "Two people on one jet ski for the longer safari.",
    es: "Dos personas en una moto durante el safari largo.",
    de: "Zwei Personen auf einem Jetski für die längere Safari.",
  }),
  {
    id: "parasail-single",
    activityId: "parasailing",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 60,
    slotRule: "startBeforeClose",
    minParticipants: 1,
    maxParticipants: 1,
    participantStep: 1,
    priceCents: 5000,
    pricingUnit: "booking",
    focus: "flight",
    sort: 1,
    allowSpectators: true,
    names: { en: "Single flight", es: "Vuelo individual", de: "Einzelflug" },
    blurbs: { en: "One person flying. 50 EUR.", es: "Una persona en el aire. 50 EUR.", de: "Eine Person in der Luft. 50 EUR." },
    resources: [{ resourceId: "parasail-boat", basis: "booking", units: 1 }],
  },
  {
    id: "parasail-tandem",
    activityId: "parasailing",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 60,
    slotRule: "startBeforeClose",
    minParticipants: 2,
    maxParticipants: 2,
    participantStep: 2,
    priceCents: 8000,
    pricingUnit: "booking",
    focus: "flight",
    sort: 2,
    allowSpectators: true,
    names: { en: "Tandem flight", es: "Vuelo tándem", de: "Tandemflug" },
    blurbs: { en: "Two people flying together. 80 EUR.", es: "Dos personas volando juntas. 80 EUR.", de: "Zwei Personen fliegen zusammen. 80 EUR." },
    resources: [{ resourceId: "parasail-boat", basis: "booking", units: 1 }],
  },
  {
    id: "parasail-triple",
    activityId: "parasailing",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 60,
    slotRule: "startBeforeClose",
    minParticipants: 3,
    maxParticipants: 3,
    participantStep: 3,
    priceCents: 10500,
    pricingUnit: "booking",
    focus: "flight",
    sort: 3,
    allowSpectators: true,
    names: { en: "Triple flight", es: "Vuelo triple", de: "Dreierflug" },
    blurbs: {
      en: "Three people, maximum 180 kg combined. 105 EUR.",
      es: "Tres personas, máximo 180 kg en total. 105 EUR.",
      de: "Drei Personen, zusammen höchstens 180 kg. 105 EUR.",
    },
    resources: [{ resourceId: "parasail-boat", basis: "booking", units: 1 }],
  },
  {
    id: "parasail-passenger",
    activityId: "parasailing",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 60,
    slotRule: "startBeforeClose",
    minParticipants: 1,
    maxParticipants: 6,
    participantStep: 1,
    priceCents: 1500,
    pricingUnit: "person",
    focus: "passenger",
    sort: 4,
    names: { en: "Boat passenger", es: "Pasajero en el barco", de: "Passagier im Boot" },
    blurbs: {
      en: "Join a departure that is already reserved. 15 EUR per person.",
      es: "Acompaña una salida ya reservada. 15 EUR por persona.",
      de: "Mitfahrt auf einer bereits reservierten Ausfahrt. 15 EUR pro Person.",
    },
    resources: [{ resourceId: "parasail-spectators", basis: "participant", units: 1 }],
  },
  {
    id: "sofa-ride",
    activityId: "crazy-sofa",
    durationMinutes: 15,
    bufferMinutes: 15,
    intervalMinutes: 30,
    slotRule: "endByClose",
    minParticipants: 2,
    maxParticipants: 6,
    participantStep: 1,
    priceCents: 2000,
    pricingUnit: "person",
    focus: "ride",
    sort: 1,
    names: { en: "Crazy Sofa ride", es: "Paseo en Crazy Sofá", de: "Crazy-Sofa-Fahrt" },
    blurbs: { en: "20 EUR per person. Minimum 2.", es: "20 EUR por persona. Mínimo 2.", de: "20 EUR pro Person. Mindestens 2." },
    resources: [{ resourceId: "sofa-seats", basis: "participant", units: 1 }],
  },
  {
    id: "jetboat-20",
    activityId: "jet-boat",
    durationMinutes: 20,
    bufferMinutes: 10,
    intervalMinutes: 30,
    slotRule: "endByClose",
    minParticipants: 4,
    maxParticipants: 10,
    participantStep: 1,
    priceCents: 3500,
    pricingUnit: "person",
    focus: "ride",
    sort: 1,
    names: { en: "20-minute jet boat", es: "Jet boat de 20 minutos", de: "20 Minuten Jetboot" },
    blurbs: {
      en: "35 EUR per person. Minimum 4 seats, maximum 10.",
      es: "35 EUR por persona. Mínimo 4 plazas, máximo 10.",
      de: "35 EUR pro Person. Mindestens 4 Plätze, höchstens 10.",
    },
    resources: [{ resourceId: "jetboat-seats", basis: "participant", units: 1 }],
  },
  {
    id: "pack-2-main",
    activityId: "pack-2",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 30,
    slotRule: "endByClose",
    minParticipants: 2,
    maxParticipants: 8,
    participantStep: 2,
    priceCents: 6500,
    pricingUnit: "person",
    focus: "pack",
    sort: 1,
    names: { en: "Two activities for two", es: "Dos actividades para dos", de: "Zwei Aktivitäten für zwei" },
    blurbs: {
      en: "65 EUR per person. One pack is two people: a double jet ski and a tandem flight.",
      es: "65 EUR por persona. Un pack son dos personas: moto doble y vuelo tándem.",
      de: "65 EUR pro Person. Ein Paket gilt für zwei Personen: Jetski doppelt und Tandemflug.",
    },
    resources: [],
  },
  {
    id: "pack-3-main",
    activityId: "pack-3",
    durationMinutes: 60,
    bufferMinutes: 0,
    intervalMinutes: 30,
    slotRule: "endByClose",
    minParticipants: 2,
    maxParticipants: 8,
    participantStep: 2,
    priceCents: 9500,
    pricingUnit: "person",
    focus: "pack",
    sort: 1,
    names: { en: "Three activities for two", es: "Tres actividades para dos", de: "Drei Aktivitäten für zwei" },
    blurbs: {
      en: "95 EUR per person. Jet ski double, tandem flight and jet boat seats.",
      es: "95 EUR por persona. Moto doble, vuelo tándem y plazas de jet boat.",
      de: "95 EUR pro Person. Jetski doppelt, Tandemflug und Jetboot-Plätze.",
    },
    resources: [],
  },
];

export const packComponents = [
  { packVariantId: "pack-2-main", componentVariantId: "jetski-circuit-double", slotMode: "one", sort: 1 },
  { packVariantId: "pack-2-main", componentVariantId: "parasail-tandem", slotMode: "perPair", sort: 2 },
  { packVariantId: "pack-3-main", componentVariantId: "jetski-circuit-double", slotMode: "one", sort: 1 },
  { packVariantId: "pack-3-main", componentVariantId: "parasail-tandem", slotMode: "perPair", sort: 2 },
  { packVariantId: "pack-3-main", componentVariantId: "jetboat-20", slotMode: "one", sort: 3 },
];

export function unitsFor(basis: string, units: number, groupSize: number, participants: number) {
  if (basis === "participant") return units * participants;
  if (basis === "group") return units * Math.ceil(participants / Math.max(1, groupSize));
  return units;
}
