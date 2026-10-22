import nodemailer from "nodemailer";
import { prisma } from "./db";
import { COMPANY } from "@/content/catalog";
import { formatClock } from "./time";

const copy = {
  en: {
    confirmed: "Booking confirmed",
    cancelled: "Booking cancelled",
    rescheduled: "Booking rescheduled",
    held: "Booking reserved temporarily",
    intro: "Your Canary Watersports booking",
    meet: "Meeting point",
    policy: "Free cancellation up to 48 hours before the activity. Free rescheduling up to 12 hours before. If we cancel because of the weather, the refund is complete.",
    shirt: "A T-shirt under the life jacket is obligatory. The kiosk accepts cash for any remaining balance.",
  },
  es: {
    confirmed: "Reserva confirmada",
    cancelled: "Reserva cancelada",
    rescheduled: "Reserva reprogramada",
    held: "Reserva retenida temporalmente",
    intro: "Tu reserva en Canary Watersports",
    meet: "Punto de encuentro",
    policy: "Cancelación gratuita hasta 48 horas antes. Cambio gratuito hasta 12 horas antes. Si cancelamos por meteorología, la devolución es íntegra.",
    shirt: "Es obligatorio llevar camiseta bajo el chaleco. En el quiosco el resto se paga en efectivo.",
  },
  de: {
    confirmed: "Buchung bestätigt",
    cancelled: "Buchung storniert",
    rescheduled: "Buchung umgebucht",
    held: "Buchung vorübergehend reserviert",
    intro: "Ihre Buchung bei Canary Watersports",
    meet: "Treffpunkt",
    policy: "Kostenlose Stornierung bis 48 Stunden vorher. Kostenlose Umbuchung bis 12 Stunden vorher. Bei Wetterabsage erstatten wir den vollen Betrag.",
    shirt: "Ein T-Shirt unter der Schwimmweste ist Pflicht. Der Restbetrag wird am Kiosk bar bezahlt.",
  },
} as const;

function euros(cents: number) {
  return `${(cents / 100).toFixed(2)} EUR`;
}

export async function queueBookingEmails(bookingId: string, kind: "confirmed" | "cancelled" | "rescheduled" | "held") {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { items: true } });
  if (!booking) return;
  const locale = booking.locale === "es" || booking.locale === "de" ? booking.locale : "en";
  const text = copy[locale];
  const lines = booking.items
    .map((item) => `${item.date} ${formatClock(item.startMinutes)} · ${item.variantId} · ${item.participants}`)
    .join("\n");
  const body = [
    text.intro,
    `${booking.reference}`,
    booking.customerName,
    lines,
    euros(booking.totalCents - booking.discountCents),
    `${text.meet}: ${COMPANY.meetingPoint}`,
    text.shirt,
    text.policy,
    `${COMPANY.phone} · ${COMPANY.whatsapp} · ${COMPANY.email}`,
  ].join("\n\n");
  const subject = `${text[kind]} ${booking.reference}`;
  const recipients = [booking.customerEmail, process.env.ADMIN_NOTIFY_EMAIL || COMPANY.email];
  for (const to of recipients) {
    const row = await prisma.emailLog.create({ data: { bookingId, to, subject, body, status: "queued" } });
    const host = process.env.SMTP_HOST;
    if (!host) {
      await prisma.emailLog.update({ where: { id: row.id }, data: { status: "logged" } });
      continue;
    }
    try {
      const transport = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
      });
      await transport.sendMail({ from: process.env.SMTP_FROM || COMPANY.email, to, subject, text: body });
      await prisma.emailLog.update({ where: { id: row.id }, data: { status: "sent" } });
    } catch {
      await prisma.emailLog.update({ where: { id: row.id }, data: { status: "error" } });
    }
  }
}
