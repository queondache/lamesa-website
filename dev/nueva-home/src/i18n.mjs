// Testi della homepage nelle quattro lingue. Fonte: sito attuale (index ES/EN/CA/PT,
// pagine dedicate, FAQ). Un solo vocabolario per lingua: menu, domande, indice e footer
// usano le stesse parole. Le risposte che La Mesa non ha ancora scritto restano TODO.

const TODO = null; // risposta FAQ da completare: il generatore mostra il segnaposto

const WA = 'https://wa.me/34711552030?text=';
const wa = (text) => WA + encodeURIComponent(text);

// Link per lingua. PT non ha ancora cursi, team building ed encargos tradotti:
// rimanda alla versione inglese (più vicina per chi legge portoghese a Barcellona).
const links = {
  es: {
    exp: '/experiencias/torno.html', modelado: '/clases/semanal-modelado.html', torno: '/clases/semanal-torno.html',
    team: '/team-building.html', resto: '/encargos.html', blog: '/blog/', privacy: '/privacy.html',
  },
  en: {
    exp: '/en/experiencias/torno.html', modelado: '/en/clases/semanal-modelado.html', torno: '/en/clases/semanal-torno.html',
    team: '/en/team-building.html', resto: '/en/custom-tableware.html', blog: '/en/blog/', privacy: '/en/privacy.html',
  },
  ca: {
    exp: '/ca/experiencias/torno.html', modelado: '/ca/clases/semanal-modelado.html', torno: '/ca/clases/semanal-torno.html',
    team: '/ca/team-building.html', resto: '/ca/encarrecs.html', blog: '/ca/blog/', privacy: '/ca/privacy.html',
  },
  pt: {
    exp: '/pt/clases/suelta.html', modelado: '/en/clases/semanal-modelado.html', torno: '/en/clases/semanal-torno.html',
    team: '/en/team-building.html', resto: '/en/custom-tableware.html', blog: '/en/blog/', privacy: '/en/privacy.html',
  },
};

export const SHOP = 'https://tienda.lamesabcn.com';
export const BONO = 'https://app.mesana.studio/book/la-mesa';
export const MAPS = 'https://www.google.com/maps?cid=8399713182337560112';
export const RATING = { es: '5,0', en: '5.0', ca: '5,0', pt: '5,0' };
export const REVIEWS_TOTAL = 53; // scheda Google pubblica, rilevato il 18/10/2026

// Recensioni Google reali: testo originale in spagnolo, mai tradotto né riscritto
export const QUOTES = [
  { text: '«Nuestra profe fue Vic, quien nos recibió con mucho cariño, paciencia y buen humor… Lo recomiendo muchísimo para los que nunca han tenido la experiencia».', name: 'Luisa', ctx: 'friends' },
  { text: '«Amo venir aquí cada semana al curso… Lau y Vicky han construido de verdad un espacio hermoso de creatividad».', name: 'Valerie', ctx: 'student' },
  { text: '«Fui sin experiencia y salí con ganas de volver el fin de semana siguiente. Lau tiene una energía muy especial».', name: 'Jupa', ctx: 'first' },
];

// FAQ: ordine della pagina dedicata; `home: true` = le quattro mostrate in homepage
const FAQ_KEYS = ['cost', 'materials', 'online', 'where', 'beginner', 'groups', 'pickup', 'languages', 'voucher', 'shipping', 'restaurants'];
export const HOME_FAQ = ['cost', 'beginner', 'online', 'where'];
export { FAQ_KEYS };

export const LANGS = {
  es: {
    htmlLang: 'es', label: 'ES', name: 'Español', l: links.es,
    files: { home: 'index.html', faq: 'preguntas-frecuentes.html' },
    title: 'La Mesa · Taller de cerámica en La Barceloneta, Barcelona',
    faqTitle: 'Preguntas frecuentes · La Mesa, taller de cerámica en Barcelona',
    description: 'Taller de cerámica y laboratorio creativo en La Barceloneta, Barcelona. Clases de 2 horas, cursos, tienda, team building y vajilla para restaurantes.',
    ui: {
      skip: 'Saltar al contenido', home: 'La Mesa, ir al inicio', mainNav: 'Principal', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú',
      close: 'Cerrar', choose: 'Elige qué buscas', seeAll: 'Ver todo La Mesa', language: 'Idioma', waFloat: 'Escribir a La Mesa por WhatsApp',
      orMail: 'O por email:', back: '← Volver al inicio', todo: 'Respuesta pendiente de La Mesa.', footNav: 'Pie de página',
    },
    nav: {
      exp: ['Experiencias', 'Clase de 2 h, sin experiencia'],
      courses: ['Cursos', 'Cada semana, día y hora fijos'],
      shop: ['Tienda', 'Piezas hechas a mano y vale-regalo'],
      groups: ['Grupos y empresas', 'Team building y celebraciones'],
      resto: ['Restaurantes', 'Vajilla de gres a medida'],
      cta: 'Reservar una clase', faq: 'Preguntas frecuentes', blog: 'Blog', privacy: 'Privacidad',
    },
    hero: {
      before: 'Lo mejor de la vida pasa alrededor de una ', mark: 'mesa.',
      sub: 'Taller de cerámica y laboratorio creativo en La Barceloneta, Barcelona.',
      reviews: 'reseñas en Google', reviewsShort: 'reseñas', photoAlt: 'Interior del estudio La Mesa, taller de cerámica en La Barceloneta, Barcelona',
    },
    who: {
      q: '¿Qué te trae a La Mesa?',
      chips: { probar: 'Probar la cerámica', aprender: 'Aprender cada semana', regalo: 'Hacer un regalo', grupo: 'Venir en grupo', resto: 'Equipar mi restaurante' },
    },
    offer: {
      probar: {
        h: 'Clase de cerámica de 2 horas',
        p: 'Modelado o torno, sin experiencia previa. Materiales y hornada incluidos. En el siguiente paso eliges la técnica y la fecha.',
        facts: ['Desde 45 €', '2 horas', 'Sin experiencia'], cta: 'Ver fechas y reservar', alt: 'Manos trabajando el barro en La Mesa',
      },
      aprender: {
        h: 'Cursos y bonos',
        p: 'Para quien quiere seguir: un curso con día y hora fijos, o un bono de horas a precio reducido.',
        facts: ['4 clases de 2 h al mes', '120 €/mes'], modelado: 'Curso de modelado', torno: 'Curso de torno',
        bono: 'o compra un bono de horas: 8 h · 120 €', alt: 'Mesa de trabajo del curso con pinceles y cuaderno',
        index: 'Un curso con día y hora fijos con tu grupo y tu profesora, o un bono de horas con horario flexible: 8 h · 120 €, 16 h · 220 €, 24 h · 300 €.',
      },
      regalo: {
        h: 'Regala cerámica',
        p: 'Todo está hecho con nuestras manos: cada pieza es única. O regala una experiencia con el vale-regalo, que incluye una tarjeta y un mini charm de cerámica.',
        cta: 'Ir a la tienda', voucher: 'Vale-regalo', alt: 'Tazas de cerámica de La Mesa en la estantería del estudio',
        index: 'Todo está hecho con nuestras manos. Cada pieza es artesanal y única, no hay dos iguales.',
        wa: 'Hola! Me interesa comprar un vale-regalo de La Mesa. ¿Cómo funciona?',
      },
      grupo: {
        h: 'Team building y grupos privados',
        p: 'Sesiones a medida para grupos de hasta 10 personas: empresas, cumpleaños, despedidas, familias. Tú dices la ocasión, nosotras nos encargamos del resto.',
        cta: 'Ver team building', alt: 'Luz de la tarde sobre la mesa de madera del estudio',
        wa: 'Hola! Me gustaría organizar una sesión privada en La Mesa. ¿Podéis hacerme un presupuesto?', subject: 'Team building en La Mesa',
      },
      resto: {
        h: 'Vajilla para tu restaurante',
        p: 'Platos, platitos, bowls y tazas de gres hechos a mano en nuestro taller. En compra o en alquiler, con las medidas y los colores de tu cocina.',
        facts: ['Sin pedido mínimo', 'Envíos a toda Europa'], cta: 'Ver la vajilla', alt: 'Juego de platos de gres verde piedra hecho a mano',
        wa: 'Hola! Tengo un restaurante y me interesa vuestra vajilla.', subject: 'Vajilla para restaurante',
      },
    },
    index: {
      eyebrow: 'todo La Mesa', h: 'Cinco formas de sentarte a nuestra mesa',
      lines: {
        exp: 'Clase de 2 h · desde 45 € · sin experiencia', courses: 'Cada semana · desde 120 €/mes', shop: 'Piezas únicas · vale-regalo',
        groups: 'Team building · sesiones privadas hasta 10 personas', resto: 'Vajilla de gres hecha a mano · compra o alquiler',
      },
      bono: 'Comprar un bono de horas',
    },
    about: {
      eyebrow: 'quiénes somos', before: 'Un espacio para crear, experimentar y ', mark: 'conectar',
      p1: 'La Mesa es un laboratorio creativo multidisciplinar en Barcelona. Diseñamos talleres y encuentros donde el arte funciona como excusa para aprender, jugar y conocer personas. Aquí no hay prisa ni reglas rígidas.',
      p2: 'No somos una escuela, somos un lugar que abraza la curiosidad, los intentos y la conexión. Ven a crear con nosotras en La Barceloneta, a dos pasos del mar.',
      facts: [['reseñas en Google'], ['Incluidos', 'Materiales y hornadas'], ['5 min', 'a pie de la playa']],
      caption: 'Lau y Vick · foto provisional', alt: 'Clase de cerámica en La Mesa',
    },
    reviews: { readAll: 'Leer todas', original: null, ctx: { friends: 'clase con amigas', student: 'alumna del curso', first: 'primera clase' }, label: 'Reseñas destacadas' },
    faq: {
      eyebrow: 'preguntas frecuentes', h: 'Lo que nos preguntáis', pageH: 'Todo lo que nos preguntáis',
      lead: '¿No encuentras tu respuesta? Escríbenos por WhatsApp al +34 711 55 20 30.',
      pageLead: 'Clases, cursos, regalos, grupos y restaurantes.', all: 'Ver las {n} preguntas frecuentes',
      items: {
        cost: ['¿Cuánto cuestan las clases de cerámica en Barcelona?', 'En La Mesa la clase de 2 horas cuesta 45 € (modelado) o 65 € (torno). Los cursos de modelado y de torno cuestan 120 €/mes por 4 clases de 2 horas. Bonos de horas: 8 h · 120 €, 16 h · 220 €, 24 h · 300 €. Materiales y hornadas incluidos.'],
        materials: ['¿Están incluidos los materiales?', 'Sí. Todas nuestras clases incluyen las herramientas, materiales y hornadas.'],
        online: ['¿Puedo reservar online?', 'Sí. La clase de 2 horas, los cursos y los bonos de horas se reservan directamente online.'],
        where: ['¿Dónde está La Mesa?', "Estamos en el Carrer de l'Atlàntida 47, en el barrio de La Barceloneta, Barcelona. A 5 minutos a pie de la playa."],
        beginner: ['¿Puedo probar la cerámica sin experiencia previa?', 'Sí. La clase de 2 horas es sin experiencia previa, y los cursos están pensados para personas sin ninguna experiencia: empezamos desde cero y vas a tu ritmo.'],
        groups: ['¿Hacéis eventos privados, team buildings o despedidas?', 'Sí, organizamos sesiones privadas para grupos de hasta 10 personas: cumpleaños, despedidas, team buildings y más. Escríbenos por WhatsApp o mail para un presupuesto.'],
        pickup: ['¿Cuándo puedo recoger mi pieza?', 'El proceso completo lleva unas tres o cuatro semanas. Te avisamos por WhatsApp cuando tus piezas estén listas para que pases a recogerlas.'],
        languages: ['¿En qué idiomas son las clases?', TODO],
        voucher: ['¿Cómo funciona el vale-regalo?', 'Nuestro vale-regalo incluye una tarjeta y un mini charm de cerámica hecho a mano. Se puede canjear por cualquier clase o pieza. Escríbenos por WhatsApp para comprarlo.'],
        shipping: ['¿Hacéis envíos de la tienda online?', TODO],
        restaurants: ['¿Hacéis vajilla para restaurantes?', 'Sí. Platos, platitos, bowls y tazas de gres hechos a mano en nuestro taller, en compra o en alquiler, con las medidas y los colores de tu cocina. No hay pedido mínimo y enviamos a toda Europa; el alquiler es solo para el área de Barcelona. En el presupuesto te damos una fecha concreta.'],
      },
    },
    foot: {
      h: 'Encuéntranos en La Barceloneta', where: 'Dónde estamos', contact: 'Contáctanos', follow: 'Síguenos', maps: 'Cómo llegar en Google Maps',
      tagline: 'La Mesa — Laboratorio Creativo · La Barceloneta, Barcelona', rights: '© 2026 La Mesa · Todos los derechos reservados',
      wa: 'Hola! Me gustaría saber más sobre La Mesa',
    },
  },

  en: {
    htmlLang: 'en', label: 'EN', name: 'English', l: links.en,
    files: { home: 'en/index.html', faq: 'en/faq.html' },
    title: 'La Mesa · Pottery studio in La Barceloneta, Barcelona',
    faqTitle: 'FAQ · La Mesa, pottery studio in Barcelona',
    description: 'Ceramics studio and creative lab in La Barceloneta, Barcelona. 2-hour classes, courses, shop, team building and tableware for restaurants.',
    ui: {
      skip: 'Skip to content', home: 'La Mesa, home', mainNav: 'Main', openMenu: 'Open menu', closeMenu: 'Close menu',
      close: 'Close', choose: "Choose what you're looking for", seeAll: 'See all of La Mesa', language: 'Language', waFloat: 'Message La Mesa on WhatsApp',
      orMail: 'Or by email:', back: '← Back to home', todo: 'Answer pending from La Mesa.', footNav: 'Footer',
    },
    nav: {
      exp: ['Experiences', '2-hour class, no experience needed'],
      courses: ['Courses', 'Every week, fixed day and time'],
      shop: ['Shop', 'Handmade pieces and gift voucher'],
      groups: ['Groups & teams', 'Team building and celebrations'],
      resto: ['Restaurants', 'Custom stoneware tableware'],
      cta: 'Book a class', faq: 'FAQ', blog: 'Blog', privacy: 'Privacy',
    },
    hero: {
      before: 'The best moments in life happen around a ', mark: 'table.',
      sub: 'Ceramics studio and creative lab in La Barceloneta, Barcelona.',
      reviews: 'reviews on Google', reviewsShort: 'reviews', photoAlt: 'Inside La Mesa, a pottery studio in La Barceloneta, Barcelona',
    },
    who: {
      q: 'What brings you to La Mesa?',
      chips: { probar: 'Try ceramics', aprender: 'Learn every week', regalo: 'Give a gift', grupo: 'Come as a group', resto: 'Equip my restaurant' },
    },
    offer: {
      probar: {
        h: '2-hour ceramics class',
        p: 'Hand-building or wheel, no experience needed. Materials and firing included. In the next step you choose the technique and the date.',
        facts: ['From €45', '2 hours', 'No experience needed'], cta: 'See dates and book', alt: 'Hands shaping clay at La Mesa',
      },
      aprender: {
        h: 'Courses & hour packs',
        p: 'For those who want to keep going: a course with a fixed day and time, or a pack of hours at a lower price.',
        facts: ['4 × 2h classes a month', '€120/month'], modelado: 'Hand-building course', torno: 'Wheel course',
        bono: 'or buy a pack of hours: 8 h · €120', alt: 'Course worktable with brushes and a notebook',
        index: 'A course with a fixed day and time with your group and teacher, or a pack of hours with a flexible schedule: 8 h · €120, 16 h · €220, 24 h · €300.',
      },
      regalo: {
        h: 'Give ceramics',
        p: 'Everything is made with our hands: every piece is unique. Or give an experience with the gift voucher, which includes a card and a mini ceramic charm.',
        cta: 'Go to the shop', voucher: 'Gift voucher', alt: 'La Mesa ceramic cups on the studio shelf',
        index: 'Everything is made with our hands. Every piece is handcrafted and unique — no two are the same.',
        wa: "Hi! I'm interested in buying a La Mesa gift voucher. How does it work?",
      },
      grupo: {
        h: 'Team building & private groups',
        p: 'Bespoke sessions for groups of up to 10 people: companies, birthdays, hen parties, families. You name the occasion, we take care of everything else.',
        cta: 'See team building', alt: 'Afternoon light on the studio’s wooden table',
        wa: "Hi! I'd like to organise a private session at La Mesa. Could you send me a quote?", subject: 'Team building at La Mesa',
      },
      resto: {
        h: 'Tableware for your restaurant',
        p: 'Plates, small plates, bowls and cups in stoneware, made by hand in our studio. To buy or to rent, in the sizes and colours your kitchen needs.',
        facts: ['No minimum order', 'Shipping across Europe'], cta: 'See the tableware', alt: 'Handmade set of stone-green stoneware plates',
        wa: "Hi! I have a restaurant and I'm interested in your tableware.", subject: 'Tableware for my restaurant',
      },
    },
    index: {
      eyebrow: 'all of La Mesa', h: 'Five ways to join us at the table',
      lines: {
        exp: '2-hour class · from €45 · no experience needed', courses: 'Every week · from €120/month', shop: 'Unique pieces · gift voucher',
        groups: 'Team building · private sessions up to 10 people', resto: 'Handmade stoneware tableware · buy or rent',
      },
      bono: 'Buy a pack of hours',
    },
    about: {
      eyebrow: 'who we are', before: 'A space to create, experiment and ', mark: 'connect',
      p1: 'La Mesa is a multidisciplinary creative lab in Barcelona. We design classes and gatherings where art is the excuse to learn, play and meet new people. There’s no rush and no rigid rules here.',
      p2: 'We’re not a school — we’re a place that embraces curiosity, experimentation and connection. Come create with us in La Barceloneta, steps from the sea.',
      facts: [['reviews on Google'], ['Included', 'Materials and firings'], ['5 min', 'walk from the beach']],
      caption: 'Lau & Vick · placeholder photo', alt: 'Ceramics class at La Mesa',
    },
    reviews: { readAll: 'Read all', original: 'Original reviews in Spanish', ctx: { friends: 'class with friends', student: 'course student', first: 'first class' }, label: 'Featured reviews' },
    faq: {
      eyebrow: 'frequently asked', h: 'What you ask us', pageH: 'Everything you ask us',
      lead: 'Can’t find your answer? Message us on WhatsApp at +34 711 55 20 30.',
      pageLead: 'Classes, courses, gifts, groups and restaurants.', all: 'See all {n} questions',
      items: {
        cost: ['How much do ceramics classes in Barcelona cost?', 'At La Mesa the 2-hour class costs €45 (hand-building) or €65 (wheel). The hand-building and wheel courses cost €120/month for 4 two-hour classes. Hour packs: 8 h · €120, 16 h · €220, 24 h · €300. Materials and firings included.'],
        materials: ['Are materials included?', 'Yes. All our classes include tools, materials and firings.'],
        online: ['Can I book online?', 'Yes. The 2-hour class, the courses and the hour packs are booked directly online.'],
        where: ['Where is La Mesa?', "We are at Carrer de l'Atlàntida 47, in the La Barceloneta neighbourhood, Barcelona. A 5-minute walk from the beach."],
        beginner: ['Can I try pottery with no previous experience?', 'Yes. The 2-hour class needs no previous experience, and the courses are designed for complete beginners: we start from zero and you go at your own pace.'],
        groups: ['Do you host private events, team buildings or hen parties?', 'Yes, we organise private sessions for groups of up to 10 people: birthdays, hen parties, team buildings and more. Message us on WhatsApp or by email for a quote.'],
        pickup: ['When can I pick up my piece?', 'The whole process takes about three to four weeks. We’ll let you know on WhatsApp when your pieces are ready to collect.'],
        languages: ['What languages are the classes in?', TODO],
        voucher: ['How does the gift voucher work?', 'Our gift voucher includes a card and a mini handmade ceramic charm. It can be redeemed for any class or piece. Message us on WhatsApp to buy it.'],
        shipping: ['Do you ship from the online shop?', TODO],
        restaurants: ['Do you make tableware for restaurants?', 'Yes. Plates, small plates, bowls and cups in stoneware, made by hand in our studio, to buy or to rent, in the sizes and colours your kitchen needs. There’s no minimum order and we ship across Europe; rental is only available in the Barcelona area. We give you a specific date in the quote.'],
      },
    },
    foot: {
      h: 'Find us in La Barceloneta', where: 'Where we are', contact: 'Get in touch', follow: 'Follow us', maps: 'Directions on Google Maps',
      tagline: 'La Mesa — Creative Lab · La Barceloneta, Barcelona', rights: '© 2026 La Mesa · All rights reserved',
      wa: "Hi! I'd like to know more about La Mesa",
    },
  },

  ca: {
    htmlLang: 'ca', label: 'CA', name: 'Català', l: links.ca,
    files: { home: 'ca/index.html', faq: 'ca/preguntes-frequents.html' },
    title: 'La Mesa · Taller de ceràmica a la Barceloneta, Barcelona',
    faqTitle: 'Preguntes freqüents · La Mesa, taller de ceràmica a Barcelona',
    description: 'Taller de ceràmica i laboratori creatiu a la Barceloneta, Barcelona. Classes de 2 hores, cursos, botiga, team building i vaixella per a restaurants.',
    ui: {
      skip: 'Salta al contingut', home: 'La Mesa, inici', mainNav: 'Principal', openMenu: 'Obre el menú', closeMenu: 'Tanca el menú',
      close: 'Tanca', choose: 'Tria què busques', seeAll: 'Veure tot La Mesa', language: 'Idioma', waFloat: 'Escriu a La Mesa per WhatsApp',
      orMail: 'O per correu:', back: '← Tornar a l’inici', todo: 'Resposta pendent de La Mesa.', footNav: 'Peu de pàgina',
    },
    nav: {
      exp: ['Experiències', 'Classe de 2 h, sense experiència'],
      courses: ['Cursos', 'Cada setmana, dia i hora fixos'],
      shop: ['Botiga', 'Peces fetes a mà i val de regal'],
      groups: ['Grups i empreses', 'Team building i celebracions'],
      resto: ['Restaurants', 'Vaixella de gres a mida'],
      cta: 'Reservar una classe', faq: 'Preguntes freqüents', blog: 'Blog', privacy: 'Privacitat',
    },
    hero: {
      before: 'Les millors coses de la vida passen al voltant d’una ', mark: 'taula.',
      sub: 'Taller de ceràmica i laboratori creatiu a la Barceloneta, Barcelona.',
      reviews: 'ressenyes a Google', reviewsShort: 'ressenyes', photoAlt: 'Interior de l’estudi La Mesa, taller de ceràmica a la Barceloneta, Barcelona',
    },
    who: {
      q: 'Què et porta a La Mesa?',
      chips: { probar: 'Provar la ceràmica', aprender: 'Aprendre cada setmana', regalo: 'Fer un regal', grupo: 'Venir en grup', resto: 'Equipar el meu restaurant' },
    },
    offer: {
      probar: {
        h: 'Classe de ceràmica de 2 hores',
        p: 'Modelat o torn, sense experiència prèvia. Materials i cuita inclosos. Al pas següent tries la tècnica i la data.',
        facts: ['Des de 45 €', '2 hores', 'Sense experiència'], cta: 'Veure dates i reservar', alt: 'Mans treballant el fang a La Mesa',
      },
      aprender: {
        h: 'Cursos i bons',
        p: 'Per a qui vol continuar: un curs amb dia i hora fixos, o un bo d’hores a preu reduït.',
        facts: ['4 classes de 2 h al mes', '120 €/mes'], modelado: 'Curs de modelat', torno: 'Curs de torn',
        bono: 'o compra un bo d’hores: 8 h · 120 €', alt: 'Taula de treball del curs amb pinzells i una llibreta',
        index: 'Un curs amb dia i hora fixos amb el teu grup i la teva professora, o un bo d’hores amb horari flexible: 8 h · 120 €, 16 h · 220 €, 24 h · 300 €.',
      },
      regalo: {
        h: 'Regala ceràmica',
        p: 'Tot està fet amb les nostres mans: cada peça és única. O regala una experiència amb el val de regal, que inclou una targeta i un mini charm de ceràmica.',
        cta: 'Anar a la botiga', voucher: 'Val de regal', alt: 'Tasses de ceràmica de La Mesa a la prestatgeria de l’estudi',
        index: 'Tot està fet amb les nostres mans. Cada peça és artesanal i única, no n’hi ha dues d’iguals.',
        wa: 'Hola! M’interessa comprar un val de regal de La Mesa. Com funciona?',
      },
      grupo: {
        h: 'Team building i grups privats',
        p: 'Sessions a mida per a grups de fins a 10 persones: empreses, aniversaris, comiats, famílies. Tu dius l’ocasió, nosaltres ens encarreguem de la resta.',
        cta: 'Veure team building', alt: 'Llum de tarda sobre la taula de fusta de l’estudi',
        wa: 'Hola! M’agradaria organitzar una sessió privada a La Mesa. Em podeu fer un pressupost?', subject: 'Team building a La Mesa',
      },
      resto: {
        h: 'Vaixella per al teu restaurant',
        p: 'Plats, platets, bols i tasses de gres fets a mà al nostre taller. En compra o en lloguer, amb les mides i els colors de la teva cuina.',
        facts: ['Sense comanda mínima', 'Enviaments a tot Europa'], cta: 'Veure la vaixella', alt: 'Joc de plats de gres verd pedra fet a mà',
        wa: 'Hola! Tinc un restaurant i m’interessa la vostra vaixella.', subject: 'Vaixella per a restaurant',
      },
    },
    index: {
      eyebrow: 'tot La Mesa', h: 'Cinc maneres de seure a la nostra taula',
      lines: {
        exp: 'Classe de 2 h · des de 45 € · sense experiència', courses: 'Cada setmana · des de 120 €/mes', shop: 'Peces úniques · val de regal',
        groups: 'Team building · sessions privades fins a 10 persones', resto: 'Vaixella de gres feta a mà · compra o lloguer',
      },
      bono: 'Comprar un bo d’hores',
    },
    about: {
      eyebrow: 'qui som', before: 'Un espai per crear, experimentar i ', mark: 'connectar',
      p1: 'La Mesa és un laboratori creatiu multidisciplinari a Barcelona. Dissenyem tallers i trobades on l’art funciona com a excusa per aprendre, jugar i conèixer persones. Aquí no hi ha pressa ni regles rígides.',
      p2: 'No som una escola, som un lloc que abraça la curiositat, els intents i la connexió. Vine a crear amb nosaltres a la Barceloneta, a dues passes del mar.',
      facts: [['ressenyes a Google'], ['Inclosos', 'Materials i cuites'], ['5 min', 'a peu de la platja']],
      caption: 'Lau i Vick · foto provisional', alt: 'Classe de ceràmica a La Mesa',
    },
    reviews: { readAll: 'Llegir-les totes', original: 'Ressenyes originals en castellà', ctx: { friends: 'classe amb amigues', student: 'alumna del curs', first: 'primera classe' }, label: 'Ressenyes destacades' },
    faq: {
      eyebrow: 'preguntes freqüents', h: 'El que ens pregunteu', pageH: 'Tot el que ens pregunteu',
      lead: 'No trobes la resposta? Escriu-nos per WhatsApp al +34 711 55 20 30.',
      pageLead: 'Classes, cursos, regals, grups i restaurants.', all: 'Veure les {n} preguntes freqüents',
      items: {
        cost: ['Quant costen les classes de ceràmica a Barcelona?', 'A La Mesa la classe de 2 hores costa 45 € (modelat) o 65 € (torn). Els cursos de modelat i de torn costen 120 €/mes per 4 classes de 2 hores. Bons d’hores: 8 h · 120 €, 16 h · 220 €, 24 h · 300 €. Materials i cuites inclosos.'],
        materials: ['Estan inclosos els materials?', 'Sí. Totes les nostres classes inclouen les eines, els materials i les cuites.'],
        online: ['Puc reservar en línia?', 'Sí. La classe de 2 hores, els cursos i els bons d’hores es reserven directament en línia.'],
        where: ['On és La Mesa?', "Som al Carrer de l'Atlàntida 47, al barri de la Barceloneta, Barcelona. A 5 minuts a peu de la platja."],
        beginner: ['Puc provar la ceràmica sense experiència prèvia?', 'Sí. La classe de 2 hores és sense experiència prèvia, i els cursos estan pensats per a persones sense cap experiència: comencem des de zero i vas al teu ritme.'],
        groups: ['Feu esdeveniments privats, team buildings o comiats?', 'Sí, organitzem sessions privades per a grups de fins a 10 persones: aniversaris, comiats, team buildings i més. Escriu-nos per WhatsApp o per correu per a un pressupost.'],
        pickup: ['Quan puc recollir la meva peça?', 'Tot el procés dura unes tres o quatre setmanes. T’avisem per WhatsApp quan les teves peces estiguin a punt perquè passis a recollir-les.'],
        languages: ['En quins idiomes són les classes?', TODO],
        voucher: ['Com funciona el val de regal?', 'El nostre val de regal inclou una targeta i un mini charm de ceràmica fet a mà. Es pot bescanviar per qualsevol classe o peça. Escriu-nos per WhatsApp per comprar-lo.'],
        shipping: ['Feu enviaments de la botiga en línia?', TODO],
        restaurants: ['Feu vaixella per a restaurants?', 'Sí. Plats, platets, bols i tasses de gres fets a mà al nostre taller, en compra o en lloguer, amb les mides i els colors de la teva cuina. No hi ha comanda mínima i enviem a tot Europa; el lloguer és només per a l’àrea de Barcelona. Al pressupost et donem una data concreta.'],
      },
    },
    foot: {
      h: 'Troba’ns a la Barceloneta', where: 'On som', contact: 'Contacta’ns', follow: 'Segueix-nos', maps: 'Com arribar amb Google Maps',
      tagline: 'La Mesa — Laboratori Creatiu · la Barceloneta, Barcelona', rights: '© 2026 La Mesa · Tots els drets reservats',
      wa: 'Hola! M’agradaria saber més sobre La Mesa',
    },
  },

  pt: {
    htmlLang: 'pt', label: 'PT', name: 'Português', l: links.pt,
    files: { home: 'pt/index.html', faq: 'pt/perguntas-frequentes.html' },
    title: 'La Mesa · Ateliê de cerâmica na Barceloneta, Barcelona',
    faqTitle: 'Perguntas frequentes · La Mesa, ateliê de cerâmica em Barcelona',
    description: 'Estúdio de cerâmica e laboratório criativo na Barceloneta, Barcelona. Aulas de 2 horas, cursos, loja, team building e louça para restaurantes.',
    ui: {
      skip: 'Pular para o conteúdo', home: 'La Mesa, início', mainNav: 'Principal', openMenu: 'Abrir menu', closeMenu: 'Fechar menu',
      close: 'Fechar', choose: 'Escolha o que você procura', seeAll: 'Ver toda a La Mesa', language: 'Idioma', waFloat: 'Falar com a La Mesa pelo WhatsApp',
      orMail: 'Ou por e-mail:', back: '← Voltar ao início', todo: 'Resposta pendente da La Mesa.', footNav: 'Rodapé',
    },
    nav: {
      exp: ['Experiências', 'Aula de 2 h, sem experiência'],
      courses: ['Cursos', 'Toda semana, dia e horário fixos'],
      shop: ['Loja', 'Peças feitas à mão e vale-presente'],
      groups: ['Grupos e empresas', 'Team building e celebrações'],
      resto: ['Restaurantes', 'Louça de grés sob medida'],
      cta: 'Reservar uma aula', faq: 'Perguntas frequentes', blog: 'Blog', privacy: 'Privacidade',
    },
    hero: {
      before: 'Os melhores momentos da vida acontecem ao redor de uma ', mark: 'mesa.',
      sub: 'Estúdio de cerâmica e laboratório criativo na Barceloneta, Barcelona.',
      reviews: 'avaliações no Google', reviewsShort: 'avaliações', photoAlt: 'Interior do estúdio La Mesa, ateliê de cerâmica na Barceloneta, Barcelona',
    },
    who: {
      q: 'O que te traz à La Mesa?',
      chips: { probar: 'Experimentar a cerâmica', aprender: 'Aprender toda semana', regalo: 'Dar um presente', grupo: 'Vir em grupo', resto: 'Equipar meu restaurante' },
    },
    offer: {
      probar: {
        h: 'Aula de cerâmica de 2 horas',
        p: 'Modelagem manual ou torno, sem experiência prévia. Materiais e queima incluídos. No próximo passo você escolhe a técnica e a data.',
        facts: ['A partir de €45', '2 horas', 'Sem experiência'], cta: 'Ver datas e reservar', alt: 'Mãos modelando o barro na La Mesa',
      },
      aprender: {
        h: 'Cursos e pacotes de horas',
        p: 'Para quem quer continuar: um curso com dia e horário fixos, ou um pacote de horas por um preço menor.',
        facts: ['4 aulas de 2h por mês', '€120/mês'], modelado: 'Curso de modelagem', torno: 'Curso de torno',
        bono: 'ou compre um pacote de horas: 8 h · €120', alt: 'Mesa de trabalho do curso com pincéis e caderno',
        index: 'Um curso com dia e horário fixos com seu grupo e sua professora, ou um pacote de horas com horário flexível: 8 h · €120, 16 h · €220, 24 h · €300.',
      },
      regalo: {
        h: 'Presenteie com cerâmica',
        p: 'Tudo é feito com as nossas mãos: cada peça é única. Ou dê uma experiência de presente com o vale-presente, que inclui um cartão e um mini pingente de cerâmica.',
        cta: 'Ir à loja', voucher: 'Vale-presente', alt: 'Xícaras de cerâmica da La Mesa na estante do estúdio',
        index: 'Tudo é feito com as nossas mãos. Cada peça é artesanal e única — não existem duas iguais.',
        wa: 'Olá! Tenho interesse em comprar um vale-presente da La Mesa. Como funciona?',
      },
      grupo: {
        h: 'Team building e grupos privados',
        p: 'Sessões sob medida para grupos de até 10 pessoas: empresas, aniversários, despedidas de solteira, famílias. Você escolhe a ocasião, e a gente cuida de todo o resto.',
        cta: 'Ver team building', alt: 'Luz da tarde sobre a mesa de madeira do estúdio',
        wa: 'Olá! Gostaria de organizar uma sessão privada na La Mesa. Vocês podem me enviar um orçamento?', subject: 'Team building na La Mesa',
      },
      resto: {
        h: 'Louça para o seu restaurante',
        p: 'Pratos, pratinhos, tigelas e xícaras de grés, feitos à mão no nosso estúdio. Para comprar ou alugar, nos tamanhos e cores de que a sua cozinha precisa.',
        facts: ['Sem pedido mínimo', 'Envio para toda a Europa'], cta: 'Ver a louça', alt: 'Conjunto de pratos de grés verde-pedra feito à mão',
        wa: 'Olá! Tenho um restaurante e tenho interesse na louça de vocês.', subject: 'Louça para restaurante',
      },
    },
    index: {
      eyebrow: 'toda a La Mesa', h: 'Cinco jeitos de sentar à nossa mesa',
      lines: {
        exp: 'Aula de 2 h · a partir de €45 · sem experiência', courses: 'Toda semana · a partir de €120/mês', shop: 'Peças únicas · vale-presente',
        groups: 'Team building · sessões privadas até 10 pessoas', resto: 'Louça de grés feita à mão · compra ou aluguel',
      },
      bono: 'Comprar um pacote de horas',
    },
    about: {
      eyebrow: 'quem somos', before: 'Um espaço para criar, experimentar e se ', mark: 'conectar',
      p1: 'A La Mesa é um laboratório criativo multidisciplinar em Barcelona. Criamos oficinas e encontros em que a arte é o pretexto para aprender, brincar e conhecer gente nova. Aqui não há pressa nem regras rígidas.',
      p2: 'Não somos uma escola, somos um lugar que acolhe a curiosidade, a experimentação e a conexão. Venha criar com a gente na Barceloneta, a poucos passos do mar.',
      facts: [['avaliações no Google'], ['Incluídos', 'Materiais e queimas'], ['5 min', 'a pé da praia']],
      caption: 'Lau e Vick · foto provisória', alt: 'Aula de cerâmica na La Mesa',
    },
    reviews: { readAll: 'Ler todas', original: 'Avaliações originais em espanhol', ctx: { friends: 'aula com amigas', student: 'aluna do curso', first: 'primeira aula' }, label: 'Avaliações em destaque' },
    faq: {
      eyebrow: 'perguntas frequentes', h: 'O que vocês nos perguntam', pageH: 'Tudo o que vocês nos perguntam',
      lead: 'Não encontrou sua resposta? Fale com a gente pelo WhatsApp: +34 711 55 20 30.',
      pageLead: 'Aulas, cursos, presentes, grupos e restaurantes.', all: 'Ver as {n} perguntas frequentes',
      items: {
        cost: ['Quanto custam as aulas de cerâmica em Barcelona?', 'Na La Mesa a aula de 2 horas custa €45 (modelagem manual) ou €65 (torno). Os cursos de modelagem manual e de torno custam €120/mês por 4 aulas de 2 horas. Pacotes de horas: 8 h · €120, 16 h · €220, 24 h · €300. Materiais e queimas incluídos.'],
        materials: ['Os materiais estão incluídos?', 'Sim. Todas as nossas aulas incluem ferramentas, materiais e queimas.'],
        online: ['Posso reservar online?', 'Sim. A aula de 2 horas, os cursos e os pacotes de horas são reservados diretamente online.'],
        where: ['Onde fica a La Mesa?', "Estamos na Carrer de l'Atlàntida 47, no bairro da Barceloneta, em Barcelona. A 5 minutos a pé da praia."],
        beginner: ['Posso experimentar cerâmica sem experiência prévia?', 'Sim. A aula de 2 horas não exige experiência, e os cursos foram pensados para quem está começando do zero: você vai no seu ritmo.'],
        groups: ['Vocês fazem eventos privados, team buildings ou despedidas de solteira?', 'Sim, organizamos sessões privadas para grupos de até 10 pessoas: aniversários, despedidas de solteira, team buildings e muito mais. Fale com a gente pelo WhatsApp ou por e-mail para receber um orçamento.'],
        pickup: ['Quando posso buscar minha peça?', 'O processo completo leva cerca de três ou quatro semanas. Avisamos pelo WhatsApp quando suas peças estiverem prontas para você buscar.'],
        languages: ['Em que idiomas são as aulas?', TODO],
        voucher: ['Como funciona o vale-presente?', 'Nosso vale-presente inclui um cartão e um mini pingente de cerâmica feito à mão. Pode ser usado em qualquer aula ou peça. Fale com a gente pelo WhatsApp para comprar.'],
        shipping: ['Vocês enviam os produtos da loja online?', TODO],
        restaurants: ['Vocês fazem louça para restaurantes?', 'Sim. Pratos, pratinhos, tigelas e xícaras de grés feitos à mão no nosso estúdio, para comprar ou alugar, nos tamanhos e cores de que a sua cozinha precisa. Não há pedido mínimo e enviamos para toda a Europa; o aluguel é só na região de Barcelona. No orçamento damos uma data concreta.'],
      },
    },
    foot: {
      h: 'Encontre a gente na Barceloneta', where: 'Onde estamos', contact: 'Fale com a gente', follow: 'Siga a gente', maps: 'Como chegar no Google Maps',
      tagline: 'La Mesa — Laboratório Criativo · La Barceloneta, Barcelona', rights: '© 2026 La Mesa · Todos os direitos reservados',
      wa: 'Olá! Gostaria de saber mais sobre a La Mesa',
    },
  },
};

export { wa };
