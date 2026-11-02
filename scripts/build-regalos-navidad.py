#!/usr/bin/env python3
"""Genera le pagine regali di Natale (ES/CA) dai template encargos. Uso: build_regalos.py <repo>"""
import json, re, sys, html
from pathlib import Path

ROOT = Path(sys.argv[1])
BASE = 'https://lamesabcn.com'
TIENDA = 'https://tienda.lamesabcn.com'
# PENDIENTE: URL del prodotto kit in tienda (in vendita entro il 6/11)
KIT_SHOP_URL = TIENDA + '/collections/all'
# Kit esaurito: mettere False e rigenerare (bottone, testo e dati strutturati cambiano insieme)
KIT_AVAILABLE = True
WA = 'https://wa.me/34711552030'

PAGES = {
    'guide': {'es': 'regalos-originales-barcelona.html', 'ca': 'ca/regals-originals-barcelona.html'},
    'kit': {'es': 'kit-mosaico-ceramica.html', 'ca': 'ca/kit-mosaic-ceramica.html'},
}
TEMPLATES = {'es': 'encargos.html', 'ca': 'ca/encarrecs.html'}

def esc(s):
    return html.escape(s, quote=True)

def img(src, w, h, alt, sizes='(min-width: 1280px) 400px, (min-width: 768px) 31vw, 92vw', eager=False):
    load = 'fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    return f'<img src="{src}" sizes="{sizes}" width="{w}" height="{h}" {load} alt="{esc(alt)}">'

def faq_html(t, items):
    out = [f'    <section class="enc-section enc-section--cream" aria-labelledby="enc-faq">',
           '      <div class="container">', '        <div class="enc-faq">',
           f'          <h2 id="enc-faq" class="enc-h2">{t}</h2>']
    for q, a in items:
        out += ['          <details class="faq__item">',
                f'            <summary class="faq__question">{esc(q)}</summary>',
                f'            <p class="faq__answer">{esc(a)}</p>', '          </details>']
    out += ['        </div>', '      </div>', '    </section>']
    return '\n'.join(out)

def faq_ld(items):
    return {'@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in items]}

def section(cls, hid, title, body, grid=None):
    extra = f'\n        <ul class="enc-grid enc-grid--3">\n{grid}\n        </ul>' if grid else ''
    return (f'    <section class="enc-section enc-section--{cls}" aria-labelledby="{hid}">\n'
            f'      <div class="container">\n        <div class="enc-head">\n'
            f'          <h2 id="{hid}" class="enc-h2">{title}</h2>\n{body}\n'
            f'        </div>{extra}\n      </div>\n    </section>')

# ---------------------------------------------------------------- testi
T = {
 'es': {
  'home': 'Inicio', 'locale': 'es_ES',
  'guide': {
   'title': 'Regalos originales hechos a mano en Barcelona | La Mesa',
   'desc': 'Regalos originales de Navidad hechos a mano en Barcelona: kit de mosaico de cerámica, tazas, bowls y jarrones únicos. Recogida gratis en la Barceloneta.',
   'og': 'Piezas únicas de cerámica y un kit de mosaico para crear en casa, hechos en la Barceloneta.',
   'crumb': 'Regalos originales',
   'kicker': 'Regalos de Navidad · Hecho a mano en Barcelona',
   'h1': 'Regalos originales hechos a mano en Barcelona',
   'lead': 'Piezas únicas de cerámica hechas en nuestro taller de la Barceloneta y un kit para crear un mosaico en casa. Para regalar algo que nadie más tiene.',
   'answer': 'En La Mesa, taller de cerámica en la Barceloneta, encuentras regalos originales hechos a mano: un kit de mosaico de cerámica por 30 € y piezas únicas como tazas, bowls, jarrones y lámparas. Compras online y lo recoges gratis en el taller o lo recibes en casa. Para Navidad, pide hasta el 14 de diciembre.',
   'cta': 'Ver la tienda', 'cta2': 'Ver el kit de mosaico',
   'kit_h': 'El regalo estrella: kit de mosaico de cerámica',
   'kit_p': 'Una caja para crear tu propio mosaico de cerámica en casa, como el trencadís de Barcelona. 30 €. Edición limitada de Navidad: hemos preparado unas 30 cajas.',
   'kit_link': 'Descubrir el kit',
   'who_h': 'Ideas según a quién se lo regalas',
   'who_p': 'Cada pieza de la tienda es única: existe una sola. Estas son las secciones donde buscar.',
   'who': [
     ('Para quien ama el café', 'Tazas y vasos para el café o el té de cada mañana.', [('Tazas y vasos', '/collections/tazas')], '/images/encargos/abrazo-puntitos-480.webp', 480, 320, 'Taza Abrazo de gres hecha a mano con puntitos marrones'),
     ('Para la casa', 'Jarrones, macetas y lámparas de cerámica para darle carácter a un rincón.', [('Jarrones', '/collections/jarrones'), ('Macetas', '/collections/macetas'), ('Lámparas', '/collections/lamparas')], '/images/pieza-03.jpg', 800, 800, 'Pieza de cerámica hecha a mano en el taller de La Mesa'),
     ('Para quien cocina', 'Bowls, platos y piezas de cocina para servir y compartir.', [('Bowls', '/collections/bowls'), ('Platos', '/collections/platos'), ('Cocina', '/collections/cocina')], '/images/encargos/promesa-verde-piedra-480.webp', 480, 320, 'Bowl Promesa de gres con esmalte Verde Piedra'),
   ],
   'price_h': 'Ideas según tu presupuesto',
   'price_p': 'Hay piezas pequeñas para un detalle y piezas grandes para un regalo especial. En la tienda puedes ordenarlas de menor a mayor precio.',
   'price_link': 'Ver piezas de menor a mayor precio',
   'exp_h': 'Regala una experiencia',
   'exp_p': 'Una clase de cerámica en el taller, con vale-regalo, tarjeta y un mini charm de cerámica.',
   'exp_links': [('Pedir un vale-regalo por WhatsApp', WA + '?text=Hola!%20Me%20interesa%20comprar%20un%20vale-regalo%20de%20La%20Mesa.%20%C2%BFC%C3%B3mo%20funciona%3F'), ('Ver la clase de torno', '/experiencias/torno.html')],
   'get_h': 'Cómo lo recibes',
   'get': ['<strong>Recogida gratis</strong>En nuestro taller de Carrer de l’Atlàntida, 47, en la Barceloneta.',
           '<strong>Envío a casa</strong>14,99 € por pedido, a toda España y a la UE.',
           '<strong>Para Navidad</strong>Pide en la tienda online hasta el 14 de diciembre.'],
   'faq_t': 'Preguntas frecuentes',
   'faq': [
     ('¿Dónde comprar regalos originales hechos a mano en Barcelona?', 'En La Mesa, taller de cerámica en la Barceloneta. Tenemos piezas únicas hechas a mano y un kit de mosaico de cerámica por 30 €. Compras en nuestra tienda online y lo recoges gratis en el taller o te lo enviamos.'),
     ('¿Hasta cuándo puedo pedir para que llegue en Navidad?', 'Hasta el 14 de diciembre en la tienda online.'),
     ('¿Puedo recogerlo en el taller?', 'Sí, la recogida en el taller de Carrer de l’Atlàntida, 47 es gratis. Si prefieres, te lo enviamos por 14,99 € por pedido.'),
     ('¿Las piezas son únicas?', 'Sí. Cada pieza de la tienda está hecha a mano y existe una sola: cuando se vende, desaparece de la tienda.'),
     ('¿Hacéis regalos personalizados?', 'Sí, con nombres, fechas o frases. Las piezas personalizadas tardan 2–3 semanas: escríbenos por WhatsApp o email con antelación.'),
   ],
   'more_h': 'Otras ideas',
   'more': [('/encargos/regalos-empresa.html', 'Regalos de empresa', 'tazas y platitos personalizados para el equipo o los clientes.'),
            ('/blog/regalos-ceramica-personalizados-barcelona.html', 'Regalos de cerámica personalizados', 'ideas y ejemplos.'),
            ('/team-building.html', 'Team building de cerámica', 'una tarde en el taller para el equipo.')],
  },
  'kit': {
   'title': 'Kit de mosaico de cerámica para hacer en casa | La Mesa',
   'desc': 'Kit de mosaico de cerámica para crear en casa, de un taller de Barcelona: regalo original de Navidad. 30 €, edición limitada. Recogida gratis en la Barceloneta.',
   'og': 'Una caja para crear tu propio mosaico de cerámica en casa. 30 €, edición limitada de Navidad.',
   'crumb': 'Kit de mosaico de cerámica',
   'kicker': 'Regalos de Navidad · Edición limitada',
   'h1': 'Kit de mosaico de cerámica para hacer en casa',
   'lead': 'Una caja para crear tu propio mosaico de cerámica en casa, como el trencadís de Barcelona. De La Mesa, taller de cerámica en la Barceloneta. Un regalo original para Navidad.',
   'price': '30 €', 'buy': 'Comprar en la tienda', 'see': 'Qué hay en la caja',
   'soldout': 'Agotado · ver otros regalos', 'soldout_p': 'Las cajas de esta Navidad se han agotado. En la tienda siguen las piezas únicas hechas a mano.',
   'box_h': 'Qué hay en la caja',
   'box_p': 'Te contamos aquí qué trae la caja y cómo se hace el mosaico.',
   'who_h': 'Para quién es',
   'who': ['<strong>Para regalar en pareja</strong>Para crear algo juntos con las manos.',
           '<strong>Para una amiga o la familia</strong>Un plan creativo para compartir en casa.',
           '<strong>Para quien disfruta las manualidades</strong>Un proyecto creativo para hacer sin prisa.',
           '<strong>Para quien lo tiene todo</strong>Un regalo que no se compra en cualquier tienda.',
           '<strong>Para quien ama Barcelona</strong>El trencadís de Gaudí, hecho en casa.'],
   'lim_h': 'Edición limitada de Navidad',
   'lim_p': 'Hemos preparado unas 30 cajas para esta Navidad. Cuando se acaben, en la tienda siguen las piezas únicas hechas a mano.',
   'get_h': 'Cómo lo recibes',
   'get': ['<strong>Recogida gratis</strong>En nuestro taller de Carrer de l’Atlàntida, 47, en la Barceloneta.',
           '<strong>Envío a casa</strong>14,99 € por pedido, a toda España y a la UE.',
           '<strong>Para Navidad</strong>Pide en la tienda online hasta el 14 de diciembre.'],
   'faq_t': 'Preguntas frecuentes',
   'faq': [
     ('¿Cuánto cuesta el kit de mosaico?', '30 €. Puedes recogerlo gratis en el taller o recibirlo en casa por 14,99 € de envío por pedido.'),
     ('¿Hasta cuándo puedo pedirlo para Navidad?', 'Hasta el 14 de diciembre en la tienda online.'),
     ('¿Dónde se recoge?', 'En el taller La Mesa, Carrer de l’Atlàntida, 47, en la Barceloneta, Barcelona.'),
     ('¿Cuántos kits hay?', 'Es una edición limitada: hemos preparado unas 30 cajas para esta Navidad.'),
   ],
   'guide_h': '¿Buscas más ideas?',
   'guide_p': 'Tazas, bowls, jarrones y lámparas únicos, hechos a mano en el taller.',
   'guide_link': 'Ver la guía de regalos originales',
  },
 },
 'ca': {
  'home': 'Inici', 'locale': 'ca_ES',
  'guide': {
   'title': 'Regals originals fets a mà a Barcelona | La Mesa',
   'desc': 'Regals originals de Nadal fets a mà a Barcelona: kit de mosaic de ceràmica, tasses, bols i gerros únics. Recollida gratuïta a la Barceloneta.',
   'og': 'Peces úniques de ceràmica i un kit de mosaic per crear a casa, fets a la Barceloneta.',
   'crumb': 'Regals originals',
   'kicker': 'Regals de Nadal · Fet a mà a Barcelona',
   'h1': 'Regals originals fets a mà a Barcelona',
   'lead': 'Peces úniques de ceràmica fetes al nostre taller de la Barceloneta i un kit per crear un mosaic a casa. Per regalar una cosa que ningú més té.',
   'answer': 'A La Mesa, taller de ceràmica a la Barceloneta, trobes regals originals fets a mà: un kit de mosaic de ceràmica per 30 € i peces úniques com tasses, bols, gerros i làmpades. Compres en línia i ho reculls gratis al taller o ho reps a casa. Per Nadal, demana fins al 14 de desembre.',
   'cta': 'Veure la botiga', 'cta2': 'Veure el kit de mosaic',
   'kit_h': 'El regal estrella: kit de mosaic de ceràmica',
   'kit_p': 'Una capsa per crear el teu propi mosaic de ceràmica a casa, com el trencadís de Barcelona. 30 €. Edició limitada de Nadal: hem preparat unes 30 capses.',
   'kit_link': 'Descobrir el kit',
   'who_h': 'Idees segons a qui ho regales',
   'who_p': 'Cada peça de la botiga és única: només n’hi ha una. Aquestes són les seccions on buscar.',
   'who': [
     ('Per a qui estima el cafè', 'Tasses i gots per al cafè o el te de cada matí.', [('Tasses i gots', '/collections/tazas')], '/images/encargos/abrazo-puntitos-480.webp', 480, 320, 'Tassa Abrazo de gres feta a mà amb puntets marrons'),
     ('Per a la casa', 'Gerros, testos i làmpades de ceràmica per donar caràcter a un racó.', [('Gerros', '/collections/jarrones'), ('Testos', '/collections/macetas'), ('Làmpades', '/collections/lamparas')], '/images/pieza-03.jpg', 800, 800, 'Peça de ceràmica feta a mà al taller de La Mesa'),
     ('Per a qui cuina', 'Bols, plats i peces de cuina per servir i compartir.', [('Bols', '/collections/bowls'), ('Plats', '/collections/platos'), ('Cuina', '/collections/cocina')], '/images/encargos/promesa-verde-piedra-480.webp', 480, 320, 'Bol Promesa de gres amb esmalt Verd Pedra'),
   ],
   'price_h': 'Idees segons el teu pressupost',
   'price_p': 'Hi ha peces petites per a un detall i peces grans per a un regal especial. A la botiga les pots ordenar de menor a major preu.',
   'price_link': 'Veure peces de menor a major preu',
   'exp_h': 'Regala una experiència',
   'exp_p': 'Una classe de ceràmica al taller, amb val de regal, targeta i un mini charm de ceràmica.',
   'exp_links': [('Demanar un val de regal per WhatsApp', WA + '?text=Hola!%20M%E2%80%99interessa%20comprar%20un%20val%20de%20regal%20de%20La%20Mesa.%20Com%20funciona%3F'), ('Veure la classe de torn', '/ca/experiencias/torno.html')],
   'get_h': 'Com el reps',
   'get': ['<strong>Recollida gratuïta</strong>Al nostre taller del carrer de l’Atlàntida, 47, a la Barceloneta.',
           '<strong>Enviament a casa</strong>14,99 € per comanda, a tot l’Estat i a la UE.',
           '<strong>Per Nadal</strong>Demana a la botiga en línia fins al 14 de desembre.'],
   'faq_t': 'Preguntes freqüents',
   'faq': [
     ('On comprar regals originals fets a mà a Barcelona?', 'A La Mesa, taller de ceràmica a la Barceloneta. Tenim peces úniques fetes a mà i un kit de mosaic de ceràmica per 30 €. Compres a la nostra botiga en línia i ho reculls gratis al taller o te l’enviem.'),
     ('Fins quan puc demanar perquè arribi per Nadal?', 'Fins al 14 de desembre a la botiga en línia.'),
     ('Ho puc recollir al taller?', 'Sí, la recollida al taller del carrer de l’Atlàntida, 47 és gratuïta. Si ho prefereixes, te l’enviem per 14,99 € per comanda.'),
     ('Les peces són úniques?', 'Sí. Cada peça de la botiga està feta a mà i només n’hi ha una: quan es ven, desapareix de la botiga.'),
     ('Feu regals personalitzats?', 'Sí, amb noms, dates o frases. Les peces personalitzades triguen 2–3 setmanes: escriu-nos per WhatsApp o correu amb antelació.'),
   ],
   'more_h': 'Altres idees',
   'more': [('/blog/regals-ceramica-personalitzats-barcelona.html', 'Regals de ceràmica personalitzats', 'idees i exemples.'),
            ('/ca/team-building.html', 'Team building de ceràmica', 'una tarda al taller per a l’equip.'),
            ('/ca/encarrecs.html', 'Per encàrrec', 'vaixella i peces a mida.')],
  },
  'kit': {
   'title': 'Kit de mosaic de ceràmica per fer a casa | La Mesa',
   'desc': 'Kit de mosaic de ceràmica per crear a casa, d’un taller de Barcelona: regal original de Nadal. 30 €, edició limitada. Recollida gratuïta a la Barceloneta.',
   'og': 'Una capsa per crear el teu propi mosaic de ceràmica a casa. 30 €, edició limitada de Nadal.',
   'crumb': 'Kit de mosaic de ceràmica',
   'kicker': 'Regals de Nadal · Edició limitada',
   'h1': 'Kit de mosaic de ceràmica per fer a casa',
   'lead': 'Una capsa per crear el teu propi mosaic de ceràmica a casa, com el trencadís de Barcelona. De La Mesa, taller de ceràmica a la Barceloneta. Un regal original per Nadal.',
   'price': '30 €', 'buy': 'Comprar a la botiga', 'see': 'Què hi ha a la capsa',
   'soldout': 'Esgotat · veure altres regals', 'soldout_p': 'Les capses d’aquest Nadal s’han esgotat. A la botiga continuen les peces úniques fetes a mà.',
   'box_h': 'Què hi ha a la capsa',
   'box_p': 'T’expliquem aquí què porta la capsa i com es fa el mosaic.',
   'who_h': 'Per a qui és',
   'who': ['<strong>Per regalar en parella</strong>Per crear alguna cosa junts amb les mans.',
           '<strong>Per a una amiga o la família</strong>Un pla creatiu per compartir a casa.',
           '<strong>Per a qui gaudeix de les manualitats</strong>Un projecte creatiu per fer sense pressa.',
           '<strong>Per a qui ho té tot</strong>Un regal que no es compra a qualsevol botiga.',
           '<strong>Per a qui estima Barcelona</strong>El trencadís de Gaudí, fet a casa.'],
   'lim_h': 'Edició limitada de Nadal',
   'lim_p': 'Hem preparat unes 30 capses per aquest Nadal. Quan s’acabin, a la botiga continuen les peces úniques fetes a mà.',
   'get_h': 'Com el reps',
   'get': ['<strong>Recollida gratuïta</strong>Al nostre taller del carrer de l’Atlàntida, 47, a la Barceloneta.',
           '<strong>Enviament a casa</strong>14,99 € per comanda, a tot l’Estat i a la UE.',
           '<strong>Per Nadal</strong>Demana a la botiga en línia fins al 14 de desembre.'],
   'faq_t': 'Preguntes freqüents',
   'faq': [
     ('Quant costa el kit de mosaic?', '30 €. El pots recollir gratis al taller o rebre’l a casa per 14,99 € d’enviament per comanda.'),
     ('Fins quan el puc demanar per Nadal?', 'Fins al 14 de desembre a la botiga en línia.'),
     ('On es recull?', 'Al taller La Mesa, carrer de l’Atlàntida, 47, a la Barceloneta, Barcelona.'),
     ('Quants kits hi ha?', 'És una edició limitada: hem preparat unes 30 capses per aquest Nadal.'),
   ],
   'guide_h': 'Busques més idees?',
   'guide_p': 'Tasses, bols, gerros i làmpades únics, fets a mà al taller.',
   'guide_link': 'Veure la guia de regals originals',
  },
 },
}

def points(items):
    return '          <ul class="enc-points">\n' + '\n'.join(f'            <li>{i}</li>' for i in items) + '\n          </ul>'

def hero(c, actions, image):
    return f'''    <section class="enc-hero" aria-labelledby="enc-title">
      <div class="container enc-hero__grid">
        <div>
          <p class="enc-kicker">{esc(c['kicker'])}</p>
          <h1 id="enc-title" class="enc-h1">{esc(c['h1'])}</h1>
          <p class="enc-lead">{esc(c['lead'])}</p>
          <div class="enc-actions">
{actions}
          </div>
        </div>
        <figure class="enc-hero__media">
          {image}
        </figure>
      </div>
    </section>'''

def guide_main(lang, c):
    kit = '/' + PAGES['kit'][lang]
    actions = (f'            <a class="btn btn--primary" href="{TIENDA}/collections/all" data-track="regalos_tienda">{esc(c["cta"])}</a>\n'
               f'            <a class="enc-link" href="{kit}">{esc(c["cta2"])}</a>')
    h = hero(c, actions, '<!-- PENDIENTE EQUIPO: foto del kit mosaico (sostituisce questa immagine) -->\n          '
             + img('/images/foto-tienda-4.jpg', 800, 600, c['who'][1][5] if False else 'Piezas de cerámica de La Mesa en la estantería del estudio' if lang == 'es' else 'Peces de ceràmica de La Mesa a la prestatgeria de l’estudi', '(min-width: 900px) 50vw, 92vw', eager=True))
    parts = [h,
      section('white', 'enc-respuesta', esc(c['h1']), f'          <p class="enc-text">{esc(c["answer"])}</p>'),
      section('cream', 'enc-kit', esc(c['kit_h']),
              f'          <!-- PENDIENTE EQUIPO: foto della scatola aperta -->\n          <p class="enc-text">{esc(c["kit_p"])}</p>\n'
              f'          <p class="enc-text"><a class="enc-link" href="{kit}">{esc(c["kit_link"])}</a></p>')]
    cards = []
    for title, text, links, src, w, hgt, alt in c['who']:
        ls = ' · '.join(f'<a class="enc-link" href="{TIENDA}{u}">{esc(n)}</a>' for n, u in links)
        cards.append(f'            <li><figure class="enc-piece">{img(src, w, hgt, alt)}<figcaption><strong>{esc(title)}</strong>{esc(text)}<span class="enc-size">{ls}</span></figcaption></figure></li>')
    parts.append(section('white', 'enc-quien', esc(c['who_h']),
        f'          <p class="enc-text">{esc(c["who_p"])}</p>', grid='\n'.join(cards)))
    parts.append(section('cream', 'enc-precio', esc(c['price_h']),
        f'          <p class="enc-text">{esc(c["price_p"])}</p>\n          <p class="enc-text"><a class="enc-link" href="{TIENDA}/collections/all?sort_by=price-ascending">{esc(c["price_link"])}</a></p>'))
    exp = ' · '.join(f'<a class="enc-link" href="{u}"' + (' target="_blank" rel="noopener noreferrer"' if u.startswith('http') else '') + f'>{esc(n)}</a>' for n, u in c['exp_links'])
    parts.append(section('white', 'enc-experiencia', esc(c['exp_h']), f'          <p class="enc-text">{esc(c["exp_p"])}</p>\n          <p class="enc-text">{exp}</p>'))
    parts.append(section('cream', 'enc-recibir', esc(c['get_h']), points(c['get'])))
    parts.append(faq_html(c['faq_t'], c['faq']))
    more = '\n'.join(f'            <li><a class="enc-link" href="{u}">{esc(n)}</a>: {esc(d)}</li>' for u, n, d in c['more'])
    parts.append(section('white', 'enc-otras', esc(c['more_h']), f'          <ul class="enc-list">\n{more}\n          </ul>'))
    return '\n\n'.join(parts)

def kit_main(lang, c):
    guide = '/' + PAGES['guide'][lang]
    buy = (f'            <a class="btn btn--primary" href="{KIT_SHOP_URL}" data-track="kit_mosaico_comprar">{esc(c["buy"])} · {c["price"]}</a>\n'
           if KIT_AVAILABLE else f'            <a class="btn btn--primary" href="{guide}">{esc(c["soldout"])}</a>\n')
    actions = (f'            <!-- PENDIENTE: link prodotto kit in tienda (KIT_SHOP_URL) -->\n' + buy +
               f'            <a class="enc-link" href="#enc-caja">{esc(c["see"])}</a>')
    alt = 'Piezas de cerámica de La Mesa en la estantería del estudio' if lang == 'es' else 'Peces de ceràmica de La Mesa a la prestatgeria de l’estudi'
    h = hero(c, actions, '<!-- PENDIENTE EQUIPO: foto della scatola kit (sostituisce questa immagine) -->\n          '
             + img('/images/foto-tienda-4.jpg', 800, 600, alt, '(min-width: 900px) 50vw, 92vw', eager=True))
    parts = [h,
      section('white', 'enc-caja', esc(c['box_h']),
              f'          <!-- PENDIENTE EQUIPO: contenuto esatto della scatola, tempo indicativo, età consigliata, foto scatola aperta e mosaico finito -->\n'
              f'          <p class="enc-text">{esc(c["box_p"])}</p>'),
      section('cream', 'enc-para', esc(c['who_h']), points(c['who'])),
      section('white', 'enc-limitada', esc(c['lim_h']), f'          <p class="enc-text">{esc(c["lim_p"] if KIT_AVAILABLE else c["soldout_p"])}</p>'),
      section('cream', 'enc-recibir', esc(c['get_h']), points(c['get'])),
      faq_html(c['faq_t'], c['faq']),
      section('white', 'enc-mas', esc(c['guide_h']), f'          <p class="enc-text">{esc(c["guide_p"])}</p>\n          <p class="enc-text"><a class="enc-link" href="{guide}">{esc(c["guide_link"])}</a></p>'),
    ]
    return '\n\n'.join(parts)

def jsonld(kind, lang, c):
    url = f'{BASE}/{PAGES[kind][lang]}'
    home = BASE + ('/' if lang == 'es' else '/ca/')
    crumbs = [{'@type': 'ListItem', 'position': 1, 'name': T[lang]['home'], 'item': home}]
    if kind == 'kit':
        crumbs.append({'@type': 'ListItem', 'position': 2, 'name': T[lang]['guide']['crumb'], 'item': f'{BASE}/{PAGES["guide"][lang]}'})
    crumbs.append({'@type': 'ListItem', 'position': len(crumbs) + 1, 'name': c['crumb'], 'item': url})
    g = [{'@type': 'BreadcrumbList', 'itemListElement': crumbs}]
    if kind == 'kit':
        g.append({'@type': 'Product', 'name': c['h1'], 'description': c['lead'],
                  'image': f'{BASE}/images/foto-tienda-4.jpg',  # PENDIENTE: foto kit
                  'brand': {'@type': 'Brand', 'name': 'La Mesa'},
                  'offers': {'@type': 'Offer', 'price': '30', 'priceCurrency': 'EUR',
                             'availability': 'https://schema.org/' + ('InStock' if KIT_AVAILABLE else 'OutOfStock'),
                             'url': KIT_SHOP_URL,
                             'seller': {'@type': 'Organization', 'name': 'La Mesa – Laboratorio Creativo', 'url': BASE}}})
    else:
        g.append({'@type': 'ItemList', 'name': c['h1'], 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': T[lang]['kit']['h1'], 'url': f'{BASE}/{PAGES["kit"][lang]}'}] + [
            {'@type': 'ListItem', 'position': i + 2, 'name': w[0], 'url': TIENDA + w[2][0][1]} for i, w in enumerate(c['who'])]})
    g.append(faq_ld(c['faq']))
    note = '  <!-- PENDIENTE: Product.image = foto del kit; Offer.url = prodotto kit in tienda -->\n' if kind == 'kit' else ''
    return note + '  <script type="application/ld+json">\n' + json.dumps({'@context': 'https://schema.org', '@graph': g}, ensure_ascii=False, indent=2) + '\n  </script>\n'

def build(kind, lang):
    c = T[lang][kind]
    src = (ROOT / TEMPLATES[lang]).read_text(encoding='utf-8')
    lines = src.split('\n')
    i_title = next(i for i, l in enumerate(lines) if '<title>' in l)
    i_theme = next(i for i, l in enumerate(lines) if '<!-- Theme color' in l)
    i_ld = next(i for i, l in enumerate(lines) if '<!-- Structured Data' in l)
    i_ga = next(i for i, l in enumerate(lines) if '<!-- Google Analytics' in l)
    i_main = next(i for i, l in enumerate(lines) if '<main class="enc">' in l)
    i_foot = next(i for i, l in enumerate(lines) if 'CONTACTO / FOOTER' in l) - 1
    url = f'{BASE}/{PAGES[kind][lang]}'
    alts = PAGES[kind]
    head = [f'  <title>{esc(c["title"])}</title>',
            f'  <meta name="description" content="{esc(c["desc"])}">', '',
            '  <!-- Canonical -->', f'  <link rel="canonical" href="{url}">',
            f'  <link rel="alternate" hreflang="es" href="{BASE}/{alts["es"]}">',
            f'  <link rel="alternate" hreflang="ca" href="{BASE}/{alts["ca"]}">',
            f'  <link rel="alternate" hreflang="x-default" href="{BASE}/{alts["es"]}">', '',
            '  <!-- Open Graph -->', '  <meta property="og:type" content="website">',
            f'  <meta property="og:title" content="{esc(c["title"])}">',
            f'  <meta property="og:description" content="{esc(c["og"])}">',
            f'  <meta property="og:url" content="{url}">',
            f'  <meta property="og:image" content="{BASE}/images/foto-tienda-4.jpg">',
            f'  <meta property="og:locale" content="{T[lang]["locale"]}">',
            '  <meta property="og:site_name" content="La Mesa Barcelona">', '']
    mid = [l for l in lines[i_theme:i_ld] if 'rel="preload" as="image"' not in l and 'Preload immagine' not in l]
    rest = '\n'.join(lines[i_ga:i_main + 1])
    # selettore lingua: ES/CA verso le pagine nuove, EN/PT verso le home
    def langs(m):
        b = m.group(0)
        b = re.sub(r'href="[^"]*"( class="active" aria-current="page")? lang="es"', lambda x: f'href="/{alts["es"]}"' + (x.group(1) or '') + ' lang="es"', b)
        b = re.sub(r'href="[^"]*"( class="active" aria-current="page")? lang="ca"', lambda x: f'href="/{alts["ca"]}"' + (x.group(1) or '') + ' lang="ca"', b)
        b = re.sub(r'href="[^"]*"( class="active" aria-current="page")? lang="en"', lambda x: 'href="/en/"' + (x.group(1) or '') + ' lang="en"', b)
        b = re.sub(r'href="[^"]*"( class="active" aria-current="page")? lang="pt"', lambda x: 'href="/pt/"' + (x.group(1) or '') + ' lang="pt"', b)
        return b
    rest = re.sub(r'<div class="navbar__(?:mobile-)?lang"[\s\S]*?</div>', langs, rest)
    main = guide_main(lang, c) if kind == 'guide' else kit_main(lang, c)
    out = '\n'.join(lines[:i_title] + head + mid) + '\n' + '  <!-- Structured Data -->\n' + jsonld(kind, lang, c) + '\n' + rest + '\n\n' + main + '\n\n' + '\n'.join(lines[i_foot:])
    dest = ROOT / PAGES[kind][lang]
    dest.write_text(out, encoding='utf-8')
    print('scritto', dest.relative_to(ROOT))

for kind in PAGES:
    for lang in ('es', 'ca'):
        build(kind, lang)
