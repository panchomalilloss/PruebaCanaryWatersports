# Despliegue

Esta copia no se ha publicado. La web de producción sigue en WordPress, WooCommerce 9.6.4, WooCommerce Bookings 2.2.2, WPML, GeneratePress y Stripe.

## Antes de cambiar el dominio

1. Confirmar en el panel el número real de motos y de plazas de acompañante. Esos dos valores no están publicados en la web actual.
2. Decidir si Crazy Sofa sigue cerrado. La tienda original lo marca como no disponible y aquí nace cerrado.
3. Crear `AUTH_SECRET` largo y una contraseña de administración nueva.
4. Poner `PAYMENT_MODE=stripe`, las claves de Stripe y el webhook `https://TU-DOMINIO/api/payments/stripe/webhook/` apuntando al evento `checkout.session.completed`.
5. Rellenar SMTP si las confirmaciones deben salir de verdad.
6. Probar un pago con tarjeta de prueba y comprobar que el estado pasa a `PAID` solo tras el webhook.
7. Exportar un CSV y hacer una reserva, una cancelación y un bloqueo por meteorología.
8. Revisar Search Console después del cambio: las URLs antiguas se mantienen. El mapa está en `docs/AUDITORIA.md`.
9. Tener copia de la base y una forma de volver al WordPress actual. No borres esa instalación hasta comprobar tráfico e indexación.

## Base de datos

En local se usa SQLite. Para más de un proceso, cambia el datasource de Prisma a PostgreSQL y despliega un solo escritor, o sustituye el candado `Mutex` por un advisory lock. La comprobación de capacidad ya ocurre dentro de una transacción.

`INVENTORY_SOURCE` no sincroniza WooCommerce. Solo controla el aviso visible. La disponibilidad sale siempre de esta base.

## Pagos

El navegador no puede marcar una reserva como pagada. En modo prueba, el servidor crea un pago `pending` y solo el endpoint de confirmación de prueba lo cierra. En Stripe, solo el webhook firmado. El importe se compara con el guardado en el servidor.

Depósitos publicados: 20, 30 y 50 EUR. El resto se indica como pago en efectivo en el quiosco, igual que en la web actual.

## Correo y WhatsApp

Sin SMTP el mensaje se guarda en `EmailLog`. WhatsApp usa el enlace `wa.me/34619446474`. No hay API de WhatsApp Business configurada.

## Zona horaria

Los horarios son hora local de `Atlantic/Canary`, guardados como fecha y minutos desde medianoche. No se convierten a una hora UTC fija, así que el cambio de horario de verano no mueve las 11:00.
