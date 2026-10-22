# Auditoría de canarywatersports.com

Fecha de lectura: 22 de octubre de 2026. Fuente: HTML público, sitemaps, REST de WordPress y la API de tienda de WooCommerce. No hay acceso a Search Console, a rankings ni al panel de WordPress. No se inventan posiciones ni volúmenes de búsqueda.

## Tecnología publicada

- WordPress 6.7.1, tema GeneratePress 3.5.1 y child theme vacío.
- WooCommerce 9.6.4 y WooCommerce Bookings 2.2.2. Los productos de actividad son de tipo `booking`.
- WPML. Inglés en la raíz, español en `/es/`, alemán en `/de/`. `hreflang` y `x-default` apuntan al inglés.
- Pasarela visible: WooCommerce Gateway Stripe. En el quiosco solo se admite efectivo.
- WhatsApp: +34 619 446 474. Teléfono: +34 928 561 094. Correo: info@canarywatersports.com.
- Fuente del tema: Montserrat. Color de acento del tema: `#1E73BE`. Amarillo del logotipo, medido: `#F5ED3C`. Negro y blanco.
- `robots.txt` no bloquea nada. El sitemap índice enlaza páginas, entradas, productos, categorías y etiquetas.

El repositorio local estaba vacío. No había instalación de WordPress que modernizar por dentro. Esta web es una aplicación Next.js aparte. La producción no se ha tocado.

## Empresa, tal como está publicada

Canary WaterSports 98, S.L. CIF B76131424. Domicilio social: Urb. Las Torres Nº 9, Blq 9, 5ª A-1, 35010 Las Palmas de Gran Canaria. Punto de encuentro: Puerto Escala, Puerto Rico, 35130 Mogán. Horario: todos los días de 11:00 a 17:30. Antelación publicada: al menos 3 horas. Cancelación íntegra hasta 48 horas antes. Cambio gratuito hasta 12 horas antes. Si cancela la empresa por tiempo, devolución íntegra. Camiseta obligatoria bajo el chaleco.

Más de 25 años. Monitores: Mahy, Violeta, Said, Fran y Antonio. Mecánico: Juan. Guías y patrón en inglés y español. El barco de parascending declara cuatro seguros: responsabilidad civil, responsabilidad pública, accidentes en vuelo y accidentes a bordo.

## Precios publicados

| Actividad | Precio |
| --- | --- |
| Moto 25 min, 1 persona | 60 EUR |
| Moto 25 min, 2 personas | 70 EUR |
| Safari 1 hora, 1 / 2 personas | 120 / 130 EUR |
| Safari 2 horas, 1 / 2 personas | 220 / 230 EUR |
| Parascending individual / tándem / triple | 50 / 80 / 105 EUR |
| Pasajero que se queda en el barco | 15 EUR |
| Crazy Sofa | 20 EUR por persona. La ficha dice que no está disponible |
| Jet boat 20 min | 35 EUR por persona. Mínimo 4, máximo 10 |
| Pack 2 | 65 EUR por persona, mínimo 2 |
| Pack 3 | 95 EUR por persona, mínimo 2 |
| Depósitos | 20, 30 y 50 EUR |

Motos: Sea-Doo Bombardier 1500 cc, dos plazas. Safari con monitor desde una plataforma flotante; la ruta depende del tiempo. Parascending: barco de 10 m, cabo de 200 m, salidas en punto. Triple: máximo 180 kg. Jet boat: dos motores Chevrolet, 850 CV, 110 km/h. Menores de 16 años solo conducen la moto con un adulto.

No está publicado cuántas motos hay ni cuántos acompañantes caben además del vuelo. Esas dos capacidades nacen como ajuste local y el panel las marca como no verificadas. El sofá de las fotos se llama de 6 plazas; también está marcado para confirmarlo antes de reabrirlo.

## URLs que se conservan

Inglés, español y alemán de inicio, actividades, reserva, tienda, empresa, contacto, las cuatro actividades, los dos packs, los tres depósitos, privacidad, aviso legal y devoluciones. También carrito, checkout, mi cuenta, la página de ejemplo, categorías y etiquetas de producto en los tres idiomas que la tienda ya publicaba.

El safari no tenía URL propia. Sigue reservándose dentro de la moto, y además existe una página nueva (`/jet-ski-safari/`, `/es/safari-moto-de-agua/`, `/de/jetski-safari/`) para no mezclar su intención con la del circuito. La página histórica de la moto no se ha movido.

No hay redirecciones: las direcciones antiguas responden ellas mismas. Checkout en español y alemán (`/es/checkout/`, `/de/checkout/`) son direcciones nuevas; `/checkout/` sigue existiendo.

## Títulos que ya rankeaban y se mantienen

- Jet ski EN: `Jet Ski Puerto Rico Gran Canaria - The Ultimate Water Adventure`
- Motos ES: `Motos de Agua Gran Canaria - Canary Watersports`
- Jetski DE: `Jetski auf Gran Canaria - Canary Watersports`
- Parascending EN, ES y DE: los títulos publicados, incluido el uso alemán de “Paragliding”.
- Crazy Sofa y Jet Boat: los títulos publicados.

El título de la portada era “WELCOME / BIENVENIDO / Willkommen”. Se ha sustituido por un título con el servicio y el lugar. Es un cambio deliberado de una etiqueta débil, no de la URL. Si Search Console muestra una caída, se puede volver al título anterior sin tocar la dirección.

La portada en alemán usa “Wassersport”, que ya es la palabra del H1 actual (“Top Wassersport in Puerto Rico”). No se ha traducido “parascending” al pie de la letra en alemán: la web viva dice Paragliding.

## Huecos de la web actual

Casi ninguna página tiene metadescripción. Varias imágenes llegan con `alt` vacío. El aviso legal y la privacidad están en español también en inglés y alemán. Las categorías inglesas cuelgan de `uncategorized`. Crazy Sofa figura como no disponible, pero la página sigue indexada. No hay opiniones verificables en el HTML: esta versión no muestra estrellas ni testimonios y enlaza a Google.

## Vídeo

El embed público del safari es `https://www.youtube.com/watch?v=_CgQ68fI85A`. El canal es `https://www.youtube.com/c/CanaryWaterSports`.
