# 07 — Domande per Lau e Vick (aggiornamento sito)

**Preparato il 23/09/2026.** Ogni domanda parte da **quello che il sito dice oggi**, così si risponde con «sí» o con la correzione, invece di dover scrivere tutto da zero.

Fonti confrontate: pagine pubbliche di lamesabcn.com, `pricing.md` e `llms.txt` (i file che leggono ChatGPT e le altre AI), e il **gestionale in produzione** interrogato via API il 23/09/2026.

Le domande sono in spagnolo, pronte da incollare. I blocchi sono separati: si possono mandare uno alla volta.

---

## ⚠️ Blocco 0 — Le tre cose che perdono soldi adesso

Queste tre non sono domande di contenuto: sono contraddizioni **visibili in questo momento** a chi apre la pagina di prenotazione. Vanno chiuse prima di tutto il resto.

### 0.1 — Il prezzo della Clase Suelta: 45 € o 50 €?
Sulla pagina `/clases/suelta.html`, **nella stessa schermata**, la scheda dice «Desde 45€» e tutte le date sotto dicono «50€». Il gestionale addebita **50 €**. Chi prenota vede due numeri diversi.

> **Clase Suelta de Modelado: ¿cuánto cuesta exactamente, 45€ o 50€?**
> Ahora mismo la página dice «Desde 45€» arriba y «50€» en cada fecha de abajo, y el sistema cobra 50€. Necesitamos un número único.
> ¿Y el precio incluye siempre 2 horas, o 45€/50€ es por hora?

### 0.2 — La Clase Suelta de Torno non è prenotabile
Il sito la vende a «Desde 65€», ma sotto compare «Sin fechas disponibles ahora mismo», e nel gestionale **non esiste nessuno slot di Clase Suelta Torno per i prossimi 90 giorni**.

> **La Clase Suelta de Torno aparece en la web a 65€ pero no tiene ninguna fecha disponible, ni hoy ni en los próximos 3 meses.**
> ¿La seguimos ofreciendo? Si sí: ¿qué días y a qué horas, y quién abre las fechas en el sistema?
> Si de momento no, la quitamos de la web o la dejamos solo como «consultar por WhatsApp»?

### 0.3 — I giorni della Clase Suelta: tre versioni diverse
| Fonte | Giorni |
|---|---|
| Gestionale (le date vere che si possono prenotare) | **lunedì 15:00 · sabato 11:00** |
| `pricing.md` e `llms.txt` (li legge ChatGPT) | martedì, mercoledì, venerdì |
| Documento interno | giovedì 16-18 |

> **¿Qué días y horas hacemos Clase Suelta?**
> En el sistema solo hay lunes 15:00 y sábado 11:00. En la web pone martes, miércoles y viernes. ¿Cuál es la buena?
> ¿Es fija todas las semanas o va cambiando según la semana?

### 0.4 — Slot duplicato
Nel gestionale il **lunedì 28 settembre alle 15:00** esistono due slot identici, e sulla pagina compaiono due volte di fila.

> **El lunes 28 de septiembre a las 15:00 aparece dos veces en la web. ¿Son dos grupos distintos o es un duplicado que hay que borrar?**

---

## Blocco 1 — Prezzi, tutti insieme

Questa è la tabella che oggi il sito dichiara, e che le AI ripetono ai clienti. Basta confermare riga per riga.

> **¿Nos confirmáis que estos precios son los correctos hoy? Marcad lo que esté mal:**
>
> | Servicio | Precio en la web | Formato |
> |---|---|---|
> | Taller Semanal Modelado | 120 € / mes | 4 clases de 2h, 1×/semana |
> | Taller Semanal Torno | 160 € / mes | 4 clases de 2h, 1×/semana |
> | Clase Suelta Modelado | 45 € (el sistema cobra 50 €) | 1 clase, mínimo 2h |
> | Clase Suelta Torno | 65 € | 1 clase, mínimo 2h, máx 2 personas |
> | Intro al Torno | 90 € | 2 clases de 2h, máx 2 personas |
> | Coworking Torno | 20 € / hora | mínimo 2h |
> | Taller Flex | desde 120 € (8h) | horas flexibles, con experiencia previa |
>
> Y tres preguntas sobre precios que la web no responde:
> - ¿Hay descuento si alguien paga varios meses por adelantado?
> - ¿El vale-regalo tiene un precio fijo o es por importe libre?
> - ¿Los precios de las sesiones privadas y team building tienen un mínimo de personas o un precio de partida que podamos publicar? Ahora ponemos solo «presupuesto a medida», y no poner ningún número hace que mucha gente no escriba.

---

## Blocco 2 — Turni del Taller Semanal

Nel gestionale sono pubblicati **22 turni**: 9 di Modelado e 13 di Torno. Sono tanti, e se qualcuno non esiste davvero un cliente può prenotare una classe che non si terrà.

**Modelado:** Mar 11:00 · Mar 16:00 · Mié 16:00 · Mié 18:30 · Jue 11:00 · Jue 16:00 · Vie 11:00 · Vie 15:00 · Sáb 11:00
**Torno:** Mar 11:00 · Mar 18:00 · Mié 11:00 · Mié 16:00 · Mié 18:30 · Jue 11:00 · Jue 14:00 · Jue 16:00 · Vie 11:00 · Vie 15:00 · Sáb 11:00 · Sáb 14:00

> **Estos son los 22 turnos que ahora mismo se pueden reservar en la web. ¿Están todos activos de verdad?**
> Modelado: Mar 11h · Mar 16h · Mié 16h · Mié 18:30 · Jue 11h · Jue 16h · Vie 11h · Vie 15h · Sáb 11h
> Torno: Mar 11h · Mar 18h · Mié 11h · Mié 16h · Mié 18:30 · Jue 11h · Jue 14h · Jue 16h · Vie 11h · Vie 15h · Sáb 11h · Sáb 14h
>
> - ¿Alguno hay que quitar porque ya no lo hacéis?
> - ¿Falta alguno que sí hacéis y no está en la lista?
> - ¿Cuántas plazas tiene cada turno de Modelado? (el sistema dice 8 para la Clase Suelta, pero no sabemos si el semanal es igual)
> - El Torno pone «máximo 2 personas». ¿Es así en todos los turnos de torno?

---

## Blocco 3 — Workshop: i 98 click che escono dal sito

Il pulsante «Ver próximos workshops» è **il link più cliccato di tutto il sito**: 98 click in 90 giorni, più di WhatsApp, Instagram ed Etsy messi insieme. Oggi porta a una cartella di Google Drive.

> **El botón «Ver próximos workshops» es el más clicado de toda la web: 98 clics en 3 meses, más que WhatsApp, Instagram y Etsy juntos.** Ahora lleva a una carpeta de Drive.
>
> - ¿Cuáles son los próximos workshops confirmados? (fecha, hora, tema, artista, precio, plazas)
> - ¿Cada cuánto salen workshops nuevos? ¿Una vez al mes, cuando surge?
> - ¿Quién los organiza y decide las fechas?
> - ¿Se pueden pagar online como las clases, o solo por WhatsApp?
> - ¿Queréis poder publicarlos vosotras desde el móvil sin pedírselo a Andrea?

*(Nota per Andrea: l'ultima domanda serve a capire che tipo di CMS serve davvero. Se la risposta è «sì», la pagina workshop diventa il punto numero uno.)*

---

## Blocco 4 — Orari dello studio e cose pratiche

Servono sia per il sito sia per la scheda Google, dove oggi compare solo «Cierra 19:00».

> - **¿Cuál es el horario real del estudio, día por día?** (apertura y cierre, incluido si cerráis a mediodía)
> - ¿Hay días que cerráis fijos? ¿Festivos, agosto, Navidad?
> - ¿Se puede pasar sin cita para ver el espacio o comprar piezas? ¿En qué horas?
> - ¿Cuánto tarda una pieza en estar lista para recoger, y hasta cuándo la guardáis?
> - ¿Enviáis las piezas por correo si alguien es de fuera de Barcelona?
> - ¿Hay que traer algo? ¿Delantal, ropa concreta?
> - ¿Desde qué edad pueden venir niños? ¿Hacéis algo para familias con niños pequeños?
> - ¿El estudio es accesible para alguien con movilidad reducida?

---

## Blocco 5 — Idiomas

Metà di chi visita il sito ha il browser in inglese (268 sessioni contro 168 in spagnolo negli ultimi 90 giorni), e il pubblico turista è forte.

> - **¿En qué idiomas podéis dar la clase?** ¿Inglés sí o sí, o depende de quién esté ese día?
> - Si viene un grupo que solo habla inglés, ¿hay algún turno que funcione mejor?
> - ¿Alguna de las dos habla otro idioma que podamos poner en la web? (portugués, catalán, francés…)

---

## Blocco 6 — La scheda de Google

Porta il **29% del traffico** del sito ed è il canale che converte meglio dopo Instagram. Oggi la categoria è «Escuela de arte», che non contiene la parola cerámica.

> - En Google aparecemos como **«Escuela de arte»**, no como estudio de cerámica. ¿Quién tiene el acceso al perfil de Google del negocio? Hay que cambiar la categoría y cuesta dos minutos.
> - ¿Queréis que activemos el botón de «Reservar» directamente en Google, que lleve a la web?
> - ¿Podéis contar los **servicios con precio** en la ficha? Ahora está vacío.
> - Las reseñas: tenéis **5,0 con 41 reseñas**, buenísimo. Pero hay respuestas que tardan meses. ¿Quién puede encargarse de contestar en 48 horas? ¿Os llega la notificación al móvil?
> - ¿Cuáles son las 5 preguntas que más os hacen por WhatsApp? Las ponemos como preguntas y respuestas en la ficha de Google y en la web, y dejáis de contestarlas una por una.

---

## Blocco 7 — Tienda e vale-regalo

> - La tienda de Etsy: ¿está actualizada? ¿Merece la pena mantenerla o preferís vender solo en el estudio?
> - ¿Qué tipo de piezas hay normalmente disponibles y en qué rango de precio?
> - El **vale-regalo**: ¿cómo funciona exactamente? ¿Importe libre o importes fijos? ¿Caduca? ¿Se puede comprar online o solo escribiendo?
> - ¿Los encargos personalizados los hacéis siempre o depende de la época?

---

## Blocco 8 — Sesiones privadas y team building

C'è già una pagina dedicata, ma dice poco e non ha prezzi.

> - ¿Cuál es el **número mínimo y máximo** de personas para una sesión privada? La web dice «hasta 10».
> - ¿Cuánto dura una sesión de team building y qué incluye?
> - ¿Cuánto cuesta, aunque sea un «desde X€ por persona»? Sin ningún número, muchas empresas ni preguntan.
> - ¿Con cuánta antelación hay que reservar?
> - ¿Habéis hecho ya alguna con empresas? Si podemos nombrarlas o poner una foto, ayuda muchísimo.
> - ¿Hacéis factura con IVA para empresas?

---

## Blocco 9 — Foto e materiale

> - ¿Tenéis fotos buenas y recientes del espacio vacío, de gente en clase y de piezas terminadas? ¿Podéis pasarnos las que más os gusten?
> - ¿Hay algún vídeo corto que podamos usar en la web?
> - ¿Tenemos permiso de las personas que salen en las fotos para publicarlas?
> - ¿Alguna alumna estaría dispuesta a que pongamos su testimonio con nombre y foto en la web?

---

## Blocco 10 — Come lavorate, per non rompere niente

> - Cuando abrís o cerráis un turno, ¿lo hacéis en el gestionale vosotras o se lo pedís a Andrea?
> - ¿Hay algo del gestionale que os resulte incómodo o que evitáis usar porque da miedo tocarlo?
> - ¿Qué es lo que más veces tenéis que explicar por WhatsApp? Eso va a la web, para que no lo escribáis más.

---

## Per Andrea — cosa fare con le risposte

1. **Blocco 0 per primo, oggi.** Finché prezzo, torno e giorni non sono decisi, ogni altra modifica al sito costruisce su un dato falso. Il numero del prezzo va cambiato in **due posti**: le pagine del sito e il gestionale, altrimenti la contraddizione resta.
2. I giorni della Clase Suelta vanno corretti anche in `pricing.md` e `llms.txt`: sono i file che ChatGPT legge per rispondere ai clienti, e oggi dicono giorni in cui non esiste nessuna lezione.
3. Le risposte al blocco 6 si riversano nel piano `04_PLAN_GBP.md`, che ha già le azioni pronte.
4. La risposta all'ultima domanda del blocco 3 dice se serve davvero un CMS e di che tipo.
