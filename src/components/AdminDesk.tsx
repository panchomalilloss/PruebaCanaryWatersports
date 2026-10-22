"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  reference: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: string;
  totalCents: number;
  paidCents: number;
  items: { date: string; startMinutes: number; variantId: string; participants: number }[];
};

export function AdminDesk({
  user,
  date,
  bookings,
  resources,
  variants,
  activities,
  blocks,
}: {
  user: { email: string; role: string } | null;
  date: string;
  bookings: Booking[];
  resources: { id: string; name: string; capacity: number; assumption: boolean; notes: string }[];
  variants: { id: string; activityId: string; priceCents: number; active: boolean }[];
  activities: { id: string; bookable: boolean }[];
  blocks: { id: string; date: string; endDate: string; kind: string; reason: string; activityId: string | null }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function post(url: string, body: unknown) {
    setError("");
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Error");
    else router.refresh();
  }
  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl uppercase">Canary Watersports</h1>
        <form className="mt-6 grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/login/", { email: form.get("email"), password: form.get("password") }); }}>
          <input className="rounded-2xl border px-3 py-3" name="email" type="email" placeholder="Email" required />
          <input className="rounded-2xl border px-3 py-3" name="password" type="password" placeholder="Password" required />
          <button className="rounded-full bg-brand-yellow px-4 py-3 font-semibold">Enter</button>
        </form>
        {error ? <p className="mt-3 text-red-700">{error}</p> : null}
      </main>
    );
  }
  const day = bookings.filter((booking) => booking.items.some((item) => item.date === date) && booking.status !== "CANCELLED" && booking.status !== "PENDING");
  const counts = new Map<string, number>();
  for (const booking of bookings) {
    if (["CANCELLED", "PENDING"].includes(booking.status)) continue;
    for (const item of booking.items) counts.set(item.date, (counts.get(item.date) || 0) + 1);
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{user.role}</p>
          <h1 className="font-display text-4xl uppercase">Reservas</h1>
        </div>
        <div className="flex gap-2">
          <a className="rounded-full border px-4 py-2" href="/api/admin/export/">CSV</a>
          <button className="rounded-full border px-4 py-2" onClick={() => post("/api/admin/logout/", {})}>Salir</button>
        </div>
      </div>
      {resources.some((resource) => resource.assumption) ? <p className="mt-4 rounded-2xl bg-brand-yellow p-4 text-sm">Hay capacidades marcadas como no verificadas. Cámbialas aquí antes de usar el calendario como inventario real. No están conectadas a WooCommerce.</p> : null}
      {error ? <p className="mt-3 text-red-700" role="alert">{error}</p> : null}
      <form className="mt-4" action="/admin/">
        <input type="date" name="date" defaultValue={date} className="rounded-2xl border px-3 py-3" />
        <button className="ml-2 rounded-full bg-brand-black px-4 py-3 text-white">Ver día</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {[...counts.entries()].slice(0, 18).map(([dayKey, count]) => <a key={dayKey} href={`/admin/?date=${dayKey}`} className="rounded-full bg-white px-3 py-2 shadow-card">{dayKey} · {count}</a>)}
      </div>
      <section className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b"><th className="p-3">Ref</th><th>Estado</th><th>Cliente</th><th>Horario</th><th></th></tr></thead>
          <tbody>
            {day.map((booking) => (
              <tr key={booking.id} className="border-b align-top">
                <td className="p-3 font-semibold">{booking.reference}<div className="font-normal text-muted">{booking.source}</div></td>
                <td>{booking.status}<div>{(booking.paidCents / 100).toFixed(0)} / {((booking.totalCents) / 100).toFixed(0)} EUR</div></td>
                <td>{booking.customerName}<div>{booking.customerEmail}</div><div>{booking.customerPhone}</div></td>
                <td>{booking.items.map((item) => <div key={item.variantId + item.startMinutes}>{item.date} {String(Math.floor(item.startMinutes / 60)).padStart(2, "0")}:{String(item.startMinutes % 60).padStart(2, "0")} {item.variantId} × {item.participants}</div>)}</td>
                <td className="p-3">
                  <button className="block text-brand-blue" onClick={() => post("/api/admin/action/", { type: "cancel", id: booking.id, reason: "admin" })}>Cancelar</button>
                  <button className="block" onClick={() => post("/api/admin/action/", { type: "complete", id: booking.id })}>Completar</button>
                  <button className="block" onClick={() => post("/api/admin/action/", { type: "cash", id: booking.id })}>Marcar pagada en caja</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form className="rounded-3xl bg-white p-5 shadow-card" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/action/", { type: "manual", locale: "es", customerName: form.get("name"), customerEmail: form.get("email"), customerPhone: form.get("phone"), source: form.get("source"), status: form.get("status"), participants: 1, lines: [{ variantId: form.get("variant"), date: form.get("date"), startMinutes: Number(form.get("minutes")), participants: 1 }] }); }}>
          <h2 className="font-display text-2xl uppercase">Reserva manual</h2>
          <div className="mt-3 grid gap-2">
            <input name="name" required placeholder="Nombre" className="rounded-xl border px-3 py-2" />
            <input name="email" type="email" required placeholder="Email" className="rounded-xl border px-3 py-2" />
            <input name="phone" required placeholder="Teléfono" className="rounded-xl border px-3 py-2" />
            <select name="variant" className="rounded-xl border px-3 py-2">{variants.map((variant) => <option key={variant.id}>{variant.id}</option>)}</select>
            <input name="date" type="date" required className="rounded-xl border px-3 py-2" />
            <input name="minutes" type="number" defaultValue={660} className="rounded-xl border px-3 py-2" aria-label="Minutos desde medianoche" />
            <select name="source" className="rounded-xl border px-3 py-2"><option>phone</option><option>whatsapp</option><option>walkin</option><option>admin</option></select>
            <select name="status" className="rounded-xl border px-3 py-2"><option>CONFIRMED</option><option>PAID</option><option>PENDING</option></select>
            <button className="rounded-full bg-brand-yellow py-2 font-semibold">Crear</button>
          </div>
        </form>
        <form className="rounded-3xl bg-white p-5 shadow-card" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/action/", { type: "block", activityId: String(form.get("activity") || ""), date: form.get("date"), endDate: form.get("end") || form.get("date"), reason: form.get("reason"), kind: form.get("kind") }); }}>
          <h2 className="font-display text-2xl uppercase">Cerrar fechas</h2>
          <div className="mt-3 grid gap-2">
            <select name="activity" className="rounded-xl border px-3 py-2"><option value="">Todas</option>{activities.map((activity) => <option key={activity.id}>{activity.id}</option>)}</select>
            <input name="date" type="date" required className="rounded-xl border px-3 py-2" />
            <input name="end" type="date" className="rounded-xl border px-3 py-2" />
            <input name="reason" required placeholder="Motivo" className="rounded-xl border px-3 py-2" />
            <select name="kind" className="rounded-xl border px-3 py-2"><option>weather</option><option>holiday</option><option>manual</option></select>
            <button className="rounded-full bg-brand-black py-2 text-white">Bloquear</button>
          </div>
          <ul className="mt-3 text-sm">{blocks.map((block) => <li key={block.id}>{block.date} {block.kind} {block.reason} <button type="button" onClick={() => post("/api/admin/action/", { type: "unblock", id: block.id })}>quitar</button></li>)}</ul>
        </form>
      </div>
      <section className="mt-6 rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-display text-2xl uppercase">Plazas y precios</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {resources.map((resource) => (
            <form key={resource.id} className="rounded-2xl border p-3" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/action/", { type: "capacity", id: resource.id, capacity: Number(form.get("capacity")) }); }}>
              <p className="font-semibold">{resource.name}</p>
              {resource.assumption ? <p className="text-sm text-red-700">Sin verificar: {resource.notes}</p> : <p className="text-sm text-muted">{resource.notes}</p>}
              <input name="capacity" type="number" defaultValue={resource.capacity} className="mt-2 w-24 rounded-xl border px-2 py-2" />
              <button className="ml-2 rounded-full border px-3 py-2">Guardar</button>
            </form>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          {variants.map((variant) => (
            <form key={variant.id} className="flex flex-wrap items-center gap-2 text-sm" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/action/", { type: "price", id: variant.id, priceCents: Math.round(Number(form.get("price")) * 100), active: form.get("active") === "on" }); }}>
              <span className="w-56">{variant.id}</span>
              <input name="price" type="number" step="0.01" defaultValue={(variant.priceCents / 100).toFixed(2)} className="w-24 rounded-xl border px-2 py-2" />
              <label><input name="active" type="checkbox" defaultChecked={variant.active} /> activa</label>
              <button className="rounded-full border px-3 py-1">Guardar</button>
            </form>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {activities.map((activity) => (
            <button key={activity.id} className="rounded-full border px-3 py-2 text-sm" onClick={() => post("/api/admin/action/", { type: "bookable", id: activity.id, bookable: !activity.bookable })}>
              {activity.id}: {activity.bookable ? "abierta" : "cerrada"}
            </button>
          ))}
        </div>
      </section>
      <form className="mt-6 rounded-3xl bg-white p-5 shadow-card" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); post("/api/admin/action/", { type: "schedule", label: "Temporada", activityId: String(form.get("activity") || ""), validFrom: String(form.get("from") || ""), validTo: String(form.get("to") || ""), openMinutes: Number(form.get("open")), closeMinutes: Number(form.get("close")), closed: form.get("closed") === "on" }); }}>
        <h2 className="font-display text-2xl uppercase">Horario de temporada</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select name="activity" className="rounded-xl border px-3 py-2"><option value="">Todas</option>{activities.map((activity) => <option key={activity.id}>{activity.id}</option>)}</select>
          <input name="from" type="date" className="rounded-xl border px-3 py-2" />
          <input name="to" type="date" className="rounded-xl border px-3 py-2" />
          <input name="open" type="number" defaultValue={660} className="w-24 rounded-xl border px-2 py-2" aria-label="Apertura" />
          <input name="close" type="number" defaultValue={1050} className="w-24 rounded-xl border px-2 py-2" aria-label="Cierre" />
          <label className="text-sm"><input name="closed" type="checkbox" /> cerrado</label>
          <button className="rounded-full bg-brand-blue px-4 py-2 text-white">Guardar horario</button>
        </div>
      </form>
    </main>
  );
}
