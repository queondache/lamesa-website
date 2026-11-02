# Regali originali per Natale (kit mosaico + guida regali) — design

Data: 2/11/2026 · Decisore: Andrea · Base: intervista in chat (brainstorming), tienda Shopify
letta il 2/11 (86 pezzi), suggerimenti di ricerca Google letti il 2/11.

## Perché

A novembre-dicembre a Barcellona la gente cerca «regalos originales» per Natale. Andrea vuole
che La Mesa compaia su Google e nelle risposte degli assistenti AI per chi cerca regali
originali e di design, e che chi arriva compri **i pezzi dell'ecommerce**. Il prodotto nuovo di
punta è la **scatolina mosaico di ceramica da fare a casa** (30 €), preparata dal team insieme
al materiale marketing.

Ricerche reali osservate (suggerimenti Google, ES): «regalos originales navidad» (+ hombre,
mujer, pareja, familia), «regalos de diseño originales», «regalos artesanales», «regalos hechos
a mano», «tienda regalos originales barcelona», «kit mosaico manualidades», «kit mosaico diy»,
«kit manualidades adultos», «kit manualidades navidad adultos», «regalo manualidades pareja».
«Cerámica» + «Navidad» ha pochissime ricerche: si punta su «regalo original / hecho a mano»,
non su «cerámica». Volumi non misurati.

## Per chi

Persone **di Barcellona** che cercano un regalo per Natale (decisione Andrea). Conseguenza: il
ritiro gratuito in taller (Carrer de l'Atlàntida 47, Barceloneta) va in evidenza perché evita
i 14,99 € di spedizione.

## Cosa si costruisce

1. **Pagina del kit mosaico** sul sito principale (`lamesabcn.com`), ES e CA.
   Contenuto: cos'è, cosa c'è nella scatola, quanto tempo serve, per chi è (coppia, amica,
   chi ama il fai-da-te, famiglia), 30 €, ritiro gratuito in taller o spedizione, bottone
   «Comprar» verso il prodotto in tienda, domande frequenti. Aggancio locale: il trencadís di
   Barcellona da fare a casa. Dati strutturati Product + Offer (30 €, EUR) + FAQPage.
2. **Guida «Regalos originales hechos a mano en Barcelona»** sul sito principale, ES e CA.
   Ordine: kit mosaico in alto; poi sezioni per persona (es. «para quien ama el café»,
   «para la casa», «para quien lo tiene todo») e per prezzo («menos de 25 €», «menos de 50 €»);
   poi il vale-regalo per una lezione (oggi si chiede su WhatsApp); poi ritiro in taller e
   ultima data utile (14/12 per la tienda online, decisione Andrea del 2/11). Le sezioni non
   elencano pezzi singoli fissi: ogni pezzo esiste in una sola copia e si esaurisce. Ogni
   sezione mostra 2–4 foto d'esempio e porta a una **collezione Shopify già esistente**, che si
   aggiorna da sola.
3. **Collegamenti**: menu «Tienda» e home (riquadro «Hacer un regalo») verso la guida; guida
   ↔ kit ↔ articolo blog esistente «regalos de cerámica personalizados» ↔ regali aziendali;
   `sitemap.xml`, `llms.txt`.

## Tempi

- 6/11: il kit è in vendita in tienda a 30 € (Andrea / team).
- Pagine pronte da pubblicare entro **il 10/11**, online appena il kit è in tienda, prima del
  picco di ricerche di dicembre.
- 14/12: ultima data d'ordine online per Natale (già sul sito).

## Fuori perimetro

- Spedizioni, prezzi, stock e checkout: restano in Shopify, mai copiati sul sito.
- **Shopify non si tocca** (né tema, né prodotti, né collezioni): Codex sta sviluppando
  l'ecommerce sul server (decisione Andrea 2/11: «non creiamo entropia»).
- Buoni regalo digitali: li sta costruendo Codex (proposta sito #57, `regalos-preview.html`,
  in bozza). Non si creano pagine o indirizzi `regalos-preview*` né un sistema buoni parallelo.
- Pagina in inglese: in un secondo momento (pubblico di Barcellona).
- Nessuna pubblicità a pagamento, nessun nuovo account o app Shopify.
- Non si modifica il tema Shopify né la grafica della tienda.

## Da evitare (anti-obiettivi)

- Inventare contenuto del kit, tempi o recensioni: si usa solo il materiale del team.
- Pagine che si svuotano quando i pezzi unici si vendono.
- Promettere consegne per Natale oltre il 14/12.

## Dipendenze dal team (materiale marketing in preparazione)

Foto della scatola chiusa e aperta, foto di un mosaico finito, elenco del contenuto, tempo
indicativo, età consigliata, testo breve del team. Finché mancano, le pagine si costruiscono
con segnaposto marcati e non si pubblicano.

## Kit: scorte e consegna (Andrea 2/11)

- Circa **30 scatoline**: è un'edizione limitata di Natale e la pagina lo dice («edición
  limitada»). Il numero esatto di pezzi rimasti lo mostra solo la tienda.
- Ritiro gratuito in taller **oppure** spedizione, a scelta in tienda.
- Quando finiscono: Andrea lo segnala, la pagina del kit passa a «agotado» con rimando alla
  guida, i dati strutturati passano a OutOfStock, la guida mette in alto i pezzi della tienda.

## Scelte prese da Claude (da controllare)

- **Sezioni per persona = collezioni Shopify già esistenti**, nessun tag nuovo: «para quien
  ama el café» → Tazas y Vasos; «para la casa» → Jarrones, Macetas, Lámparas, Decoración;
  «para quien cocina» → Cocina, Platos, Bowls.
- **Sezioni per prezzo senza collezioni nuove**: link alla tienda ordinata per prezzo
  (`/collections/all?sort_by=price-ascending`) con 2–4 esempi sotto i 25 € e sotto i 50 €.
- **Vale-regalo resta su WhatsApp** come oggi; quando i buoni di Codex saranno online si
  cambia solo il link.
- **14/12 vale come ultima data per Natale per tutti**, anche per il ritiro in taller (Andrea
  non ha indicato una data diversa per il ritiro).

## Lasciato a chi costruisce

Indirizzi delle pagine, titoli e descrizioni per Google, struttura dei dati strutturati,
quante sezioni per persona/prezzo (in base ai prodotti disponibili),
grafica coerente con le pagine esistenti (riuso stili `enc-*`), test e verifica.
