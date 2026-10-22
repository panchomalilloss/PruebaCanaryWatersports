import type { Locale } from "./catalog";

export type Block = { h2: string; paragraphs: string[] };
export type Faq = { q: string; a: string };
export type Shot = { src: string; alt: string };

export type Story = {
  h1: string;
  lead: string;
  blocks: Block[];
  includes: string[];
  requirements: string[];
  faqs: Faq[];
  shots: Shot[];
};

const shirt = {
  en: "A T-shirt under the life jacket is obligatory.",
  es: "Es obligatorio llevar camiseta debajo del chaleco.",
  de: "Ein T-Shirt unter der Schwimmweste ist Pflicht.",
};

const sharedReq = {
  en: ["Swimwear", "Sun cream", "Basic swimming", "Glasses are safer with a strap", "A waterproof camera is allowed at your own risk"],
  es: ["Bañador", "Protección solar", "Saber nadar lo básico", "Si llevas gafas, mejor con cinta", "Una cámara acuática va por tu cuenta y riesgo"],
  de: ["Badekleidung", "Sonnenschutz", "Grundlegende Schwimmkenntnisse", "Brillen am besten mit Band", "Eine wasserdichte Kamera geht auf eigenes Risiko"],
};

const cancelFaq = {
  en: { q: "Can I cancel?", a: "Yes. Up to 48 hours before the start the refund is complete. Up to 12 hours before, you can move the booking without a fee. Write to info@canarywatersports.com or WhatsApp +34 619 446 474." },
  es: { q: "¿Puedo cancelar?", a: "Sí. Hasta 48 horas antes la devolución es íntegra. Hasta 12 horas antes puedes cambiar la reserva sin coste. Escríbenos a info@canarywatersports.com o por WhatsApp al +34 619 446 474." },
  de: { q: "Kann ich stornieren?", a: "Ja. Bis 48 Stunden vorher erstatten wir den vollen Betrag. Bis 12 Stunden vorher können Sie kostenlos umbuchen. Schreiben Sie an info@canarywatersports.com oder per WhatsApp an +34 619 446 474." },
};

const weatherFaq = {
  en: { q: "What if the weather is bad?", a: "The activity depends on the sea. If we cancel because of the weather, the refund is complete." },
  es: { q: "¿Qué pasa si hay mal tiempo?", a: "La actividad depende del mar. Si cancelamos por meteorología, la devolución es íntegra." },
  de: { q: "Was passiert bei schlechtem Wetter?", a: "Die Aktivität hängt vom Meer ab. Sagen wir wegen des Wetters ab, erstatten wir den vollen Betrag." },
};

const whereFaq = {
  en: { q: "Where do we meet?", a: "Puerto Escala, Puerto Rico harbour, 35130 Mogán, Gran Canaria. There is paid parking in the harbour. The nearest bus stop is Puerto Rico (Angry Birds Park), lines 01, 33, 39, 70, 90 and 91." },
  es: { q: "¿Dónde quedamos?", a: "Puerto Escala, puerto de Puerto Rico, 35130 Mogán, Gran Canaria. Hay aparcamiento de pago en el puerto. La parada más cercana es Puerto Rico (Angry Birds Park), líneas 01, 33, 39, 70, 90 y 91." },
  de: { q: "Wo treffen wir uns?", a: "Puerto Escala, Hafen von Puerto Rico, 35130 Mogán, Gran Canaria. Im Hafen gibt es kostenpflichtige Parkplätze. Die nächste Haltestelle ist Puerto Rico (Angry Birds Park), Linien 01, 33, 39, 70, 90 und 91." },
};

export const stories: Record<string, Record<Locale, Story>> = {
  "jet-ski": {
    en: {
      h1: "Jet ski in Puerto Rico, Gran Canaria",
      lead: "Circuits of 25 minutes and guided safaris of one or two hours on Sea-Doo Bombardier 1500 cc jet skis, each with room for two.",
      blocks: [
        { h2: "A circuit when you want the burst of speed", paragraphs: ["You do not need previous experience. An instructor briefs you, stays with the group and the ride lasts 25 minutes. One person rides for 60 EUR, or two share the same ski for 70 EUR.", "Children under 16 can drive only with an adult on board. From 16 they may drive alone when a parent or guardian authorises it."] },
        { h2: "A safari when you want the coast", paragraphs: ["The safari leaves from the floating platform off Puerto Rico. A monitor comes for safety, shows caves and beaches when the sea allows, and can take photos. One hour is 120 EUR for one rider or 130 EUR for two. Two hours is 220 EUR or 230 EUR.", "The exact route depends on the weather. We do not promise a fixed list of stops."] },
      ],
      includes: ["Life jacket", "Guide in English and Spanish", "Fuel", "Insurance", "Fees and taxes"],
      requirements: [shirt.en, ...sharedReq.en, "Not recommended during pregnancy", "Children under 16 only drive with an adult"],
      faqs: [
        { q: "How much notice do you need?", a: "At least 3 hours before the start. The centre is open every day from 11:00 to 17:30." },
        cancelFaq.en,
        weatherFaq.en,
        whereFaq.en,
      ],
      shots: [
        { src: "/media/jetski-hero.webp", alt: "Jet ski ride with Canary Watersports in Puerto Rico, Gran Canaria" },
        { src: "/media/jetski-circuit.webp", alt: "Jet ski circuit leaving Puerto Rico harbour" },
        { src: "/media/jetski-safari-caves.webp", alt: "Jet ski safari near the caves of south Gran Canaria" },
        { src: "/media/platform.webp", alt: "Floating platform used for the jet ski safari off Puerto Rico" },
      ],
    },
    es: {
      h1: "Motos de agua en Puerto Rico, Gran Canaria",
      lead: "Circuitos de 25 minutos y safaris guiados de una o dos horas en motos Sea-Doo Bombardier 1500 cc, con sitio para dos.",
      blocks: [
        { h2: "El circuito, si quieres el golpe de velocidad", paragraphs: ["No hace falta experiencia. Un monitor explica la salida, supervisa el grupo y el recorrido dura 25 minutos. Una persona: 60 EUR. Dos personas en la misma moto: 70 EUR.", "Quien tenga menos de 16 años solo puede conducir con un adulto a bordo. A partir de 16 puede ir solo si lo autoriza su madre, padre o tutor."] },
        { h2: "El safari, si quieres la costa", paragraphs: ["El safari sale desde la plataforma flotante frente a Puerto Rico. El monitor va por seguridad, enseña cuevas y playas cuando el mar lo permite y puede hacer fotos. Una hora cuesta 120 EUR para una persona o 130 EUR para dos. Dos horas, 220 EUR o 230 EUR.", "El recorrido depende del tiempo. No prometemos una lista cerrada de paradas."] },
      ],
      includes: ["Chaleco", "Guía en inglés y español", "Combustible", "Seguro", "Tasas e impuestos"],
      requirements: [shirt.es, ...sharedReq.es, "No recomendado en el embarazo", "Menores de 16 años solo conducen con un adulto"],
      faqs: [
        { q: "¿Con cuánta antelación hay que reservar?", a: "Al menos 3 horas antes de la salida. Abrimos todos los días de 11:00 a 17:30." },
        cancelFaq.es,
        weatherFaq.es,
        whereFaq.es,
      ],
      shots: [
        { src: "/media/jetski-hero.webp", alt: "Moto de agua de Canary Watersports en Puerto Rico, Gran Canaria" },
        { src: "/media/jetski-circuit.webp", alt: "Circuito de moto de agua saliendo del puerto de Puerto Rico" },
        { src: "/media/jetski-safari-caves.webp", alt: "Safari en moto de agua junto a las cuevas del sur de Gran Canaria" },
        { src: "/media/platform.webp", alt: "Plataforma flotante del safari en moto de agua frente a Puerto Rico" },
      ],
    },
    de: {
      h1: "Jetski in Puerto Rico, Gran Canaria",
      lead: "25-Minuten-Runden und geführte Safaris von einer oder zwei Stunden auf Sea-Doo Bombardier 1500 ccm, mit Platz für zwei.",
      blocks: [
        { h2: "Die Runde, wenn Sie Tempo wollen", paragraphs: ["Erfahrung ist nicht nötig. Ein Guide erklärt den Start, bleibt bei der Gruppe und die Fahrt dauert 25 Minuten. Eine Person: 60 EUR. Zwei Personen auf demselben Jetski: 70 EUR.", "Unter 16 Jahren wird nur mit einem Erwachsenen an Bord gefahren. Ab 16 ist Alleinfahren möglich, wenn ein Erziehungsberechtigter zustimmt."] },
        { h2: "Die Safari, wenn Sie die Küste wollen", paragraphs: ["Die Safari startet von der schwimmenden Plattform vor Puerto Rico. Der Guide fährt aus Sicherheitsgründen mit, zeigt Höhlen und Strände, wenn das Meer es zulässt, und kann Fotos machen. Eine Stunde kostet 120 EUR für eine Person oder 130 EUR für zwei. Zwei Stunden kosten 220 EUR oder 230 EUR.", "Die Strecke hängt vom Wetter ab. Wir versprechen keine feste Liste von Stopps."] },
      ],
      includes: ["Schwimmweste", "Guide auf Englisch und Spanisch", "Treibstoff", "Versicherung", "Gebühren und Steuern"],
      requirements: [shirt.de, ...sharedReq.de, "In der Schwangerschaft nicht empfohlen", "Unter 16 nur mit einem Erwachsenen fahren"],
      faqs: [
        { q: "Wie viel Vorlauf braucht eine Buchung?", a: "Mindestens 3 Stunden vor dem Start. Geöffnet ist täglich von 11:00 bis 17:30." },
        cancelFaq.de,
        weatherFaq.de,
        whereFaq.de,
      ],
      shots: [
        { src: "/media/jetski-hero.webp", alt: "Jetski von Canary Watersports in Puerto Rico, Gran Canaria" },
        { src: "/media/jetski-circuit.webp", alt: "Jetski-Runde beim Verlassen des Hafens von Puerto Rico" },
        { src: "/media/jetski-safari-caves.webp", alt: "Jetski-Safari an den Höhlen im Süden Gran Canarias" },
        { src: "/media/platform.webp", alt: "Schwimmende Plattform der Jetski-Safari vor Puerto Rico" },
      ],
    },
  },
  parasailing: {
    en: {
      h1: "Parascending in Puerto Rico, Gran Canaria",
      lead: "Fly alone, as a pair or as three, from a 10-metre boat with a 200-metre line. There is no age limit. A triple flight is limited to 180 kg combined.",
      blocks: [
        { h2: "The flight", paragraphs: ["Departures leave on the hour while the centre is open, from 11:00 to 17:30. A single flight is 50 EUR, a tandem 80 EUR and a triple 105 EUR. A passenger who stays on the boat, when there is room on a departure already booked, pays 15 EUR."] },
        { h2: "The boat", paragraphs: ["The parascending boat carries civil liability insurance, public liability insurance, cover for accidents in flight and cover for accidents on the boat. The captain works in English and Spanish."] },
      ],
      includes: ["Boat trip", "Life jacket and harness", "Captain in English and Spanish", "Fuel", "The four insurances listed above"],
      requirements: [shirt.en, ...sharedReq.en, "Triple flights: 180 kg maximum combined"],
      faqs: [cancelFaq.en, weatherFaq.en, whereFaq.en, { q: "Is there an age limit?", a: "No age limit is published. Three people flying together cannot exceed 180 kg." }],
      shots: [
        { src: "/media/parasail-wide.webp", alt: "Parascending flight above the coast of Puerto Rico, Gran Canaria" },
        { src: "/media/parasail-tandem.webp", alt: "Tandem parascending flight with Canary Watersports" },
        { src: "/media/parasail-view.webp", alt: "View of the coast during a parascending flight in Gran Canaria" },
        { src: "/media/parasail-triple.webp", alt: "Triple parascending flight over Puerto Rico" },
      ],
    },
    es: {
      h1: "Parascending en Puerto Rico, Gran Canaria",
      lead: "Vuela solo, en pareja o tres personas, desde un barco de 10 metros con 200 metros de cabo. No hay límite de edad. El vuelo triple admite como máximo 180 kg en total.",
      blocks: [
        { h2: "El vuelo", paragraphs: ["Las salidas son en punto mientras el centro está abierto, de 11:00 a 17:30. El individual cuesta 50 EUR, el tándem 80 EUR y el triple 105 EUR. Quien se quede en el barco, si hay sitio en una salida ya reservada, paga 15 EUR."] },
        { h2: "El barco", paragraphs: ["El barco de parascending tiene seguro de responsabilidad civil, seguro de responsabilidad pública, cobertura de accidentes en vuelo y cobertura de accidentes a bordo. El patrón trabaja en inglés y español."] },
      ],
      includes: ["Salida en barco", "Chaleco y arnés", "Patrón en inglés y español", "Combustible", "Los cuatro seguros indicados"],
      requirements: [shirt.es, ...sharedReq.es, "Vuelo triple: máximo 180 kg en total"],
      faqs: [cancelFaq.es, weatherFaq.es, whereFaq.es, { q: "¿Hay límite de edad?", a: "No hay un límite de edad publicado. Tres personas juntas no pueden superar los 180 kg." }],
      shots: [
        { src: "/media/parasail-wide.webp", alt: "Vuelo de parascending sobre la costa de Puerto Rico, Gran Canaria" },
        { src: "/media/parasail-tandem.webp", alt: "Vuelo tándem de parascending con Canary Watersports" },
        { src: "/media/parasail-view.webp", alt: "Vista de la costa durante un vuelo de parascending en Gran Canaria" },
        { src: "/media/parasail-triple.webp", alt: "Vuelo triple de parascending sobre Puerto Rico" },
      ],
    },
    de: {
      h1: "Paragliding in Puerto Rico, Gran Canaria",
      lead: "Fliegen Sie allein, zu zweit oder zu dritt von einem 10-Meter-Boot mit 200-Meter-Leine. Eine Altersgrenze ist nicht veröffentlicht. Ein Dreierflug ist auf zusammen 180 kg begrenzt.",
      blocks: [
        { h2: "Der Flug", paragraphs: ["Die Abfahrten gehen zur vollen Stunde, solange das Zentrum geöffnet ist, von 11:00 bis 17:30. Ein Einzelflug kostet 50 EUR, ein Tandem 80 EUR und ein Dreierflug 105 EUR. Wer im Boot bleibt und auf einer schon gebuchten Ausfahrt Platz ist, zahlt 15 EUR."] },
        { h2: "Das Boot", paragraphs: ["Das Paragliding-Boot hat eine Haftpflichtversicherung, eine weitere Betriebshaftpflicht, Schutz bei Unfällen im Flug und Schutz bei Unfällen an Bord. Der Kapitän spricht Englisch und Spanisch."] },
      ],
      includes: ["Bootsfahrt", "Schwimmweste und Gurt", "Kapitän auf Englisch und Spanisch", "Treibstoff", "Die vier genannten Versicherungen"],
      requirements: [shirt.de, ...sharedReq.de, "Dreierflug: zusammen höchstens 180 kg"],
      faqs: [cancelFaq.de, weatherFaq.de, whereFaq.de, { q: "Gibt es eine Altersgrenze?", a: "Eine Altersgrenze ist nicht veröffentlicht. Drei Personen zusammen dürfen 180 kg nicht überschreiten." }],
      shots: [
        { src: "/media/parasail-wide.webp", alt: "Paragliding über der Küste von Puerto Rico, Gran Canaria" },
        { src: "/media/parasail-tandem.webp", alt: "Tandem-Paragliding mit Canary Watersports" },
        { src: "/media/parasail-view.webp", alt: "Küstenblick beim Paragliding auf Gran Canaria" },
        { src: "/media/parasail-triple.webp", alt: "Dreierflug im Paragliding über Puerto Rico" },
      ],
    },
  },
  "crazy-sofa": {
    en: {
      h1: "Crazy Sofa in Puerto Rico, Gran Canaria",
      lead: "Fifteen minutes trying to stay on the sofa while it is towed. It is aimed at families. The published price is 20 EUR per person, with a minimum of two and four recommended. Booking is closed for now: the original shop marks this product as not available.",
      blocks: [{ h2: "When it runs", paragraphs: ["The centre's hours are 11:00 to 17:30, seven days a week. Small children need an adult with them. The sofa in the published photos is the six-person model. Staff can reopen the calendar from the admin panel when the ride is operating again."] }],
      includes: ["Life jacket", "Insurance"],
      requirements: [shirt.en, ...sharedReq.en, "Goggles are recommended", "Not recommended during pregnancy", "Small children with an adult"],
      faqs: [{ q: "Can I book it today?", a: "No. The activity stays visible because it is part of the current site, but new bookings are switched off until the team turns them back on." }, cancelFaq.en, whereFaq.en],
      shots: [
        { src: "/media/sofa.webp", alt: "Crazy Sofa tow in Puerto Rico, Gran Canaria" },
        { src: "/media/sofa-6.webp", alt: "Six-person Crazy Sofa used by Canary Watersports" },
        { src: "/media/sofa-mountain.webp", alt: "Crazy Sofa with the mountains of Puerto Rico behind" },
      ],
    },
    es: {
      h1: "Crazy Sofá en Puerto Rico, Gran Canaria",
      lead: "Quince minutos intentando no caerse mientras os remolcan. Está pensado para familias. El precio publicado es 20 EUR por persona, mínimo dos y cuatro recomendados. La reserva está cerrada: la tienda original indica que este producto no está disponible.",
      blocks: [{ h2: "Cuando funciona", paragraphs: ["El horario del centro es de 11:00 a 17:30, los siete días. Los niños pequeños tienen que ir con un adulto. En las fotos publicadas el sofá es el de seis plazas. El equipo puede reabrir el calendario desde el panel cuando la actividad vuelva a operar."] }],
      includes: ["Chaleco", "Seguro"],
      requirements: [shirt.es, ...sharedReq.es, "Se recomiendan gafas de agua", "No recomendado en el embarazo", "Los niños pequeños, con un adulto"],
      faqs: [{ q: "¿Se puede reservar hoy?", a: "No. La página sigue visible porque la actividad existe en la web actual, pero las reservas nuevas están apagadas hasta que el equipo las reactive." }, cancelFaq.es, whereFaq.es],
      shots: [
        { src: "/media/sofa.webp", alt: "Crazy Sofá remolcado en Puerto Rico, Gran Canaria" },
        { src: "/media/sofa-6.webp", alt: "Crazy Sofá de seis plazas de Canary Watersports" },
        { src: "/media/sofa-mountain.webp", alt: "Crazy Sofá con las montañas de Puerto Rico al fondo" },
      ],
    },
    de: {
      h1: "Crazy Sofa in Puerto Rico, Gran Canaria",
      lead: "Fünfzehn Minuten Balance auf dem Sofa, während es gezogen wird. Gedacht für Familien. Der veröffentlichte Preis ist 20 EUR pro Person, mindestens zwei, vier empfohlen. Buchungen sind geschlossen: der bisherige Shop markiert dieses Produkt als nicht verfügbar.",
      blocks: [{ h2: "Wenn es läuft", paragraphs: ["Die Öffnungszeit ist täglich 11:00 bis 17:30. Kleine Kinder brauchen eine erwachsene Begleitung. Auf den veröffentlichten Fotos ist es das Sechspersonen-Sofa. Das Team kann den Kalender im Admin wieder öffnen, wenn die Fahrt läuft."] }],
      includes: ["Schwimmweste", "Versicherung"],
      requirements: [shirt.de, ...sharedReq.de, "Schwimmbrille empfohlen", "In der Schwangerschaft nicht empfohlen", "Kleine Kinder nur mit Erwachsenen"],
      faqs: [{ q: "Kann ich heute buchen?", a: "Nein. Die Seite bleibt sichtbar, weil die Aktivität zur bestehenden Website gehört, aber neue Buchungen sind aus, bis das Team sie wieder einschaltet." }, cancelFaq.de, whereFaq.de],
      shots: [
        { src: "/media/sofa.webp", alt: "Crazy Sofa im Schlepp in Puerto Rico, Gran Canaria" },
        { src: "/media/sofa-6.webp", alt: "Crazy Sofa für sechs Personen von Canary Watersports" },
        { src: "/media/sofa-mountain.webp", alt: "Crazy Sofa mit den Bergen von Puerto Rico im Hintergrund" },
      ],
    },
  },
  "jet-boat": {
    en: {
      h1: "Jet boat El Diablo in Puerto Rico",
      lead: "Twenty minutes on the jet boat: two Chevrolet engines, 850 HP, and a published speed of 110 km/h. The price is 35 EUR per person. A departure needs at least 4 seats and takes no more than 10.",
      blocks: [{ h2: "If you are only two or three", paragraphs: ["You can buy 4 seats and the boat goes out when the weather allows. If a shared departure does not reach 4 people, the published rule is a full refund or another time. Packs of three activities reserve 2 seats on this boat and share the departure with other guests."] }],
      includes: ["A seat", "Life jacket", "Captain in English and Spanish", "Fuel", "Insurance"],
      requirements: [shirt.en, "Swimwear and sun cream", "Goggles recommended", "Not recommended during pregnancy", "Basic swimming", "Children with an adult"],
      faqs: [
        { q: "How long is it?", a: "20 minutes. The centre is open 11:00 to 17:30, and online booking needs 3 hours' notice." },
        cancelFaq.en,
        weatherFaq.en,
        whereFaq.en,
      ],
      shots: [
        { src: "/media/jetboat-1.webp", alt: "Jet boat El Diablo turning off Puerto Rico, Gran Canaria" },
        { src: "/media/jetboat-2.webp", alt: "Passengers on the Canary Watersports jet boat" },
        { src: "/media/jetboat-harbour.webp", alt: "Jet boat in Puerto Rico harbour" },
      ],
    },
    es: {
      h1: "Jet boat El Diablo en Puerto Rico",
      lead: "Veinte minutos en el jet boat: dos motores Chevrolet, 850 CV y una velocidad publicada de 110 km/h. El precio es 35 EUR por persona. La salida necesita al menos 4 plazas y no admite más de 10.",
      blocks: [{ h2: "Si sois dos o tres", paragraphs: ["Podéis comprar 4 plazas y el barco sale si el tiempo lo permite. Si una salida compartida no llega a 4 personas, la norma publicada es devolver el importe o buscar otro horario. El pack de tres actividades reserva 2 plazas en este barco y comparte la salida con otros clientes."] }],
      includes: ["Plaza a bordo", "Chaleco", "Patrón en inglés y español", "Combustible", "Seguro"],
      requirements: [shirt.es, "Bañador y protección solar", "Se recomiendan gafas de agua", "No recomendado en el embarazo", "Saber nadar lo básico", "Los niños, con un adulto"],
      faqs: [
        { q: "¿Cuánto dura?", a: "20 minutos. El centro abre de 11:00 a 17:30 y la reserva online pide 3 horas de antelación." },
        cancelFaq.es,
        weatherFaq.es,
        whereFaq.es,
      ],
      shots: [
        { src: "/media/jetboat-1.webp", alt: "Jet boat El Diablo girando frente a Puerto Rico, Gran Canaria" },
        { src: "/media/jetboat-2.webp", alt: "Pasajeros en el jet boat de Canary Watersports" },
        { src: "/media/jetboat-harbour.webp", alt: "Jet boat en el puerto de Puerto Rico" },
      ],
    },
    de: {
      h1: "Jetboot El Diablo in Puerto Rico",
      lead: "Zwanzig Minuten im Jetboot: zwei Chevrolet-Motoren, 850 PS und eine veröffentlichte Geschwindigkeit von 110 km/h. Der Preis ist 35 EUR pro Person. Eine Ausfahrt braucht mindestens 4 Plätze und höchstens 10.",
      blocks: [{ h2: "Wenn Sie nur zu zweit oder zu dritt sind", paragraphs: ["Sie können 4 Plätze kaufen, dann fährt das Boot bei passendem Wetter. Erreicht eine gemeinsame Ausfahrt keine 4 Personen, gilt die veröffentlichte Regel: volle Erstattung oder ein anderer Termin. Das Dreierpaket reserviert 2 Plätze in diesem Boot und teilt die Ausfahrt mit anderen Gästen."] }],
      includes: ["Platz an Bord", "Schwimmweste", "Kapitän auf Englisch und Spanisch", "Treibstoff", "Versicherung"],
      requirements: [shirt.de, "Badekleidung und Sonnenschutz", "Schwimmbrille empfohlen", "In der Schwangerschaft nicht empfohlen", "Grundlegende Schwimmkenntnisse", "Kinder mit einem Erwachsenen"],
      faqs: [
        { q: "Wie lange dauert es?", a: "20 Minuten. Geöffnet ist von 11:00 bis 17:30, online braucht es 3 Stunden Vorlauf." },
        cancelFaq.de,
        weatherFaq.de,
        whereFaq.de,
      ],
      shots: [
        { src: "/media/jetboat-1.webp", alt: "Jetboot El Diablo vor Puerto Rico, Gran Canaria" },
        { src: "/media/jetboat-2.webp", alt: "Gäste im Jetboot von Canary Watersports" },
        { src: "/media/jetboat-harbour.webp", alt: "Jetboot im Hafen von Puerto Rico" },
      ],
    },
  },
  "pack-2": {
    en: {
      h1: "Two water sports in Puerto Rico",
      lead: "65 EUR per person, minimum two. Each pair gets a 25-minute double jet ski and a tandem parascending flight. You choose a free time for each part. The same people cannot be in two places at once, and two tandems cannot share the single boat.",
      blocks: [{ h2: "What the price replaces", paragraphs: ["Booked separately, the double circuit is 70 EUR for the ski and the tandem flight is 80 EUR. The pack price is per person, so two people pay 130 EUR together."] }],
      includes: ["Double jet ski for 25 minutes", "Tandem flight", "Life jackets and harness", "Guide or captain in English and Spanish", "Fuel and insurance"],
      requirements: [shirt.en, ...sharedReq.en, "Not recommended during pregnancy", "Under 16 only drive the jet ski with an adult"],
      faqs: [cancelFaq.en, weatherFaq.en, whereFaq.en],
      shots: [
        { src: "/media/combi.webp", alt: "Jet ski and parascending pack in Puerto Rico" },
        { src: "/media/jetski-circuit-2.webp", alt: "Double jet ski included in the two-activity pack" },
        { src: "/media/parasail-tandem.webp", alt: "Tandem flight included in the two-activity pack" },
      ],
    },
    es: {
      h1: "Dos deportes acuáticos en Puerto Rico",
      lead: "65 EUR por persona, mínimo dos. Cada pareja incluye una moto doble de 25 minutos y un vuelo tándem de parascending. Eliges una hora libre para cada parte. Las mismas personas no pueden estar en dos sitios a la vez, y dos tándems no caben en el único barco.",
      blocks: [{ h2: "Qué sustituye el precio", paragraphs: ["Por separado, el circuito doble son 70 EUR por la moto y el tándem son 80 EUR. El pack se cobra por persona: dos personas pagan 130 EUR en total."] }],
      includes: ["Moto doble de 25 minutos", "Vuelo tándem", "Chalecos y arnés", "Guía o patrón en inglés y español", "Combustible y seguro"],
      requirements: [shirt.es, ...sharedReq.es, "No recomendado en el embarazo", "Menores de 16 años solo conducen la moto con un adulto"],
      faqs: [cancelFaq.es, weatherFaq.es, whereFaq.es],
      shots: [
        { src: "/media/combi.webp", alt: "Pack de moto de agua y parascending en Puerto Rico" },
        { src: "/media/jetski-circuit-2.webp", alt: "Moto doble incluida en el pack de dos actividades" },
        { src: "/media/parasail-tandem.webp", alt: "Vuelo tándem incluido en el pack de dos actividades" },
      ],
    },
    de: {
      h1: "Zwei Wassersportarten in Puerto Rico",
      lead: "65 EUR pro Person, mindestens zwei. Jedes Paar erhält 25 Minuten Jetski zu zweit und einen Tandemflug. Sie wählen für jeden Teil eine freie Zeit. Dieselben Personen können nicht gleichzeitig an zwei Orten sein, und zwei Tandems passen nicht auf das eine Boot.",
      blocks: [{ h2: "Was der Preis ersetzt", paragraphs: ["Getrennt kostet die Doppelrunde 70 EUR für den Jetski und der Tandemflug 80 EUR. Das Paket gilt pro Person: zwei Personen zahlen zusammen 130 EUR."] }],
      includes: ["Jetski doppelt, 25 Minuten", "Tandemflug", "Westen und Gurt", "Guide oder Kapitän auf Englisch und Spanisch", "Treibstoff und Versicherung"],
      requirements: [shirt.de, ...sharedReq.de, "In der Schwangerschaft nicht empfohlen", "Unter 16 fährt der Jetski nur mit einem Erwachsenen"],
      faqs: [cancelFaq.de, weatherFaq.de, whereFaq.de],
      shots: [
        { src: "/media/combi.webp", alt: "Jetski- und Paragliding-Paket in Puerto Rico" },
        { src: "/media/jetski-circuit-2.webp", alt: "Doppel-Jetski im Paket mit zwei Aktivitäten" },
        { src: "/media/parasail-tandem.webp", alt: "Tandemflug im Paket mit zwei Aktivitäten" },
      ],
    },
  },
  "pack-3": {
    en: {
      h1: "Three water sports in Puerto Rico",
      lead: "95 EUR per person, minimum two. Each pair gets the 25-minute double jet ski, a tandem flight and two seats on the 20-minute jet boat. You pick a separate free time for each. The jet boat still departs from 4 seats, so two pack seats share the boat with other guests.",
      blocks: [{ h2: "How the three fit in one day", paragraphs: ["The calendar only offers times that still have a jet ski, a free flight and two boat seats. Overlapping times are refused, because the same people have to move between the platform, the parasail boat and the jet boat."] }],
      includes: ["Double jet ski for 25 minutes", "Tandem flight", "Two jet boat seats for 20 minutes", "Life jackets", "Guide or captain in English and Spanish", "Fuel and insurance"],
      requirements: [shirt.en, ...sharedReq.en, "Not recommended during pregnancy", "Jet boat: children with an adult"],
      faqs: [cancelFaq.en, weatherFaq.en, { q: "Does the jet boat leave with only our pair?", a: "Not automatically. The boat's own rule is a minimum of 4 seats. The pack holds 2 of them. A private boat can be requested and is priced apart from this pack." }],
      shots: [
        { src: "/media/jetski-circuit.webp", alt: "Jet ski included in the three-activity pack" },
        { src: "/media/parasail-1.webp", alt: "Parascending included in the three-activity pack" },
        { src: "/media/jetboat-2.webp", alt: "Jet boat seats included in the three-activity pack" },
      ],
    },
    es: {
      h1: "Tres deportes acuáticos en Puerto Rico",
      lead: "95 EUR por persona, mínimo dos. Cada pareja incluye la moto doble de 25 minutos, un vuelo tándem y dos plazas en el jet boat de 20 minutos. Eliges una hora libre para cada cosa. El jet boat sigue saliendo desde 4 plazas, así que las dos del pack se comparten con otros clientes.",
      blocks: [{ h2: "Cómo caben las tres en un día", paragraphs: ["El calendario solo enseña horas en las que aún hay moto, un vuelo libre y dos plazas de barco. Si las horas se pisan, la reserva no sigue: las mismas personas tienen que pasar de la plataforma al barco de parascending y al jet boat."] }],
      includes: ["Moto doble de 25 minutos", "Vuelo tándem", "Dos plazas de jet boat durante 20 minutos", "Chalecos", "Guía o patrón en inglés y español", "Combustible y seguro"],
      requirements: [shirt.es, ...sharedReq.es, "No recomendado en el embarazo", "En el jet boat, los niños van con un adulto"],
      faqs: [cancelFaq.es, weatherFaq.es, { q: "¿El jet boat sale solo con nuestra pareja?", a: "No de forma automática. La norma del barco es un mínimo de 4 plazas. El pack retiene 2. Un barco privado se puede pedir y se cobra aparte de este pack." }],
      shots: [
        { src: "/media/jetski-circuit.webp", alt: "Moto de agua incluida en el pack de tres actividades" },
        { src: "/media/parasail-1.webp", alt: "Parascending incluido en el pack de tres actividades" },
        { src: "/media/jetboat-2.webp", alt: "Plazas de jet boat incluidas en el pack de tres actividades" },
      ],
    },
    de: {
      h1: "Drei Wassersportarten in Puerto Rico",
      lead: "95 EUR pro Person, mindestens zwei. Jedes Paar erhält 25 Minuten Jetski zu zweit, einen Tandemflug und zwei Plätze im 20-minütigen Jetboot. Sie wählen für jeden Teil eine freie Zeit. Das Jetboot fährt weiter ab 4 Plätzen, die zwei Paketplätze teilen sich das Boot also mit anderen Gästen.",
      blocks: [{ h2: "Wie die drei in einen Tag passen", paragraphs: ["Der Kalender zeigt nur Zeiten, zu denen noch ein Jetski, ein freier Flug und zwei Bootplätze da sind. Überschneidungen werden abgelehnt, weil dieselben Personen zwischen Plattform, Paragliding-Boot und Jetboot wechseln."] }],
      includes: ["Jetski doppelt, 25 Minuten", "Tandemflug", "Zwei Jetboot-Plätze für 20 Minuten", "Schwimmwesten", "Guide oder Kapitän auf Englisch und Spanisch", "Treibstoff und Versicherung"],
      requirements: [shirt.de, ...sharedReq.de, "In der Schwangerschaft nicht empfohlen", "Im Jetboot: Kinder mit einem Erwachsenen"],
      faqs: [cancelFaq.de, weatherFaq.de, { q: "Fährt das Jetboot nur mit unserem Paar?", a: "Nicht automatisch. Die eigene Regel des Boots sind mindestens 4 Plätze. Das Paket hält 2 davon. Ein privates Boot kann angefragt werden und wird getrennt von diesem Paket berechnet." }],
      shots: [
        { src: "/media/jetski-circuit.webp", alt: "Jetski im Paket mit drei Aktivitäten" },
        { src: "/media/parasail-1.webp", alt: "Paragliding im Paket mit drei Aktivitäten" },
        { src: "/media/jetboat-2.webp", alt: "Jetboot-Plätze im Paket mit drei Aktivitäten" },
      ],
    },
  },
};

export const homeFaq: Record<Locale, Faq[]> = {
  en: [cancelFaq.en, weatherFaq.en, whereFaq.en, { q: "How far ahead can I book?", a: "Choose any future open day. The start must be at least 3 hours away, and the public hours are 11:00 to 17:30 every day." }],
  es: [cancelFaq.es, weatherFaq.es, whereFaq.es, { q: "¿Con cuánta antelación puedo reservar?", a: "Cualquier día abierto a partir de hoy. La salida tiene que quedar al menos a 3 horas, y el horario público es de 11:00 a 17:30 todos los días." }],
  de: [cancelFaq.de, weatherFaq.de, whereFaq.de, { q: "Wie weit im Voraus kann ich buchen?", a: "Jeden künftigen offenen Tag. Der Start muss mindestens 3 Stunden entfernt sein. Die öffentlichen Zeiten sind täglich 11:00 bis 17:30." }],
};

export const advantages: Record<Locale, { title: string; text: string }[]> = {
  en: [
    { title: "More than 25 years", text: "The company has operated in this harbour long enough to know the south coast." },
    { title: "Named instructors", text: "Mahy, Violeta, Said, Fran and Antonio guide. Juan looks after the machines." },
    { title: "A real meeting point", text: "Puerto Escala, inside Puerto Rico harbour. Not a hotel pickup we have not published." },
    { title: "Cover on the parasail boat", text: "Civil liability, public liability, accidents in flight and accidents on board." },
  ],
  es: [
    { title: "Más de 25 años", text: "La empresa trabaja en este puerto el tiempo suficiente para conocer la costa sur." },
    { title: "Monitores con nombre", text: "Guían Mahy, Violeta, Said, Fran y Antonio. Juan cuida las máquinas." },
    { title: "Un punto de encuentro real", text: "Puerto Escala, dentro del puerto de Puerto Rico. No un traslado de hotel que no hayamos publicado." },
    { title: "Cobertura en el barco de parascending", text: "Responsabilidad civil, responsabilidad pública, accidentes en vuelo y accidentes a bordo." },
  ],
  de: [
    { title: "Über 25 Jahre", text: "Das Unternehmen arbeitet in diesem Hafen lange genug, um die Südküste zu kennen." },
    { title: "Guides mit Namen", text: "Mahy, Violeta, Said, Fran und Antonio führen. Juan kümmert sich um die Maschinen." },
    { title: "Ein echter Treffpunkt", text: "Puerto Escala, im Hafen von Puerto Rico. Kein Hoteltransfer, den wir nicht veröffentlicht haben." },
    { title: "Schutz auf dem Paragliding-Boot", text: "Haftpflicht, Betriebshaftpflicht, Unfälle im Flug und Unfälle an Bord." },
  ],
};

export const team = [
  { name: "Mahy", role: { en: "Instructor", es: "Monitora", de: "Guide" }, src: "/media/team-mahy.webp" },
  { name: "Violeta", role: { en: "Instructor", es: "Monitora", de: "Guide" }, src: "/media/team-violeta.webp" },
  { name: "Said", role: { en: "Instructor", es: "Monitor", de: "Guide" }, src: "/media/team-said.webp" },
  { name: "Fran", role: { en: "Instructor", es: "Monitor", de: "Guide" }, src: "/media/team-fran.webp" },
  { name: "Antonio", role: { en: "Instructor", es: "Monitor", de: "Guide" }, src: "/media/team-antonio.webp" },
  { name: "Juan", role: { en: "Mechanic", es: "Mecánico", de: "Mechaniker" }, src: "/media/team-juan.webp" },
];
