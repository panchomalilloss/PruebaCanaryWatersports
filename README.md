# Canary Watersports

Web nueva para Canary Watersports, construida en local a partir de la web pública actual (https://www.canarywatersports.com/). No modifica producción ni tiene acceso a los pedidos de WooCommerce.

## Qué hay aquí

- Páginas en inglés, español y alemán, con las direcciones originales.
- Reservas con calendario, horario real y capacidad guardada en base de datos.
- Retención de la plaza durante el pago y comprobación en el servidor antes de marcarla como pagada.
- Packs que bloquean cada actividad incluida.
- Panel en `/admin/` para reservas, bloqueos, precios y plazas.
- Pagos de prueba si no hay claves de Stripe. Con claves, el cobro pasa por Stripe Checkout y el webhook.

## Arranque

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

La base local es SQLite (`prisma/dev.db`). En un servidor con varias instancias hay que pasar a PostgreSQL: el esquema de Prisma está pensado para ese cambio y el README de despliegue explica el candado.

Copia `.env.example` a `.env` y cambia `ADMIN_PASSWORD` y `AUTH_SECRET`.

## Lo que no está conectado

- El calendario de WooCommerce Bookings de la web actual. Las plazas de motos y de acompañantes del parasailing salen de una configuración inicial, marcada en el panel como no verificada.
- Stripe, hasta pegar `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`.
- El correo real, hasta rellenar `SMTP_HOST`. Mientras tanto la confirmación queda registrada en la base.
- Los pedidos antiguos de WooCommerce. No había acceso a esa base.

Cuando las plazas estén confirmadas, pon `INVENTORY_SOURCE=live` para ocultar el aviso del calendario. No lo actives antes.

## Comprobaciones

```bash
npm test
npm run build
```

La auditoría de la web original está en `docs/AUDITORIA.md`. El despliegue, en `docs/DESPLIEGUE.md`.
