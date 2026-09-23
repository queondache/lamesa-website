# 08 — Risposte di Lau al blocco 0 (23/09/2026)

Risposte ricevute via WhatsApp da **Lau** il 23/09/2026 alle 12:24-12:26. Trascritte testualmente, poi tradotte in conseguenze operative.

## Testo originale

> **1-** 45€
> **2-** 65€ tenemos libre martes miércoles viernes sábado a las 11 y podemos hacer también miércoles 18.30
> **3-** clase suelta se puede siempre los lunes y domingos no porque estamos cerrados.
> **4-** duplicando

---

## Cosa è deciso

### 1. Prezzo Clase Suelta Modelado = **45 €**
Il gestionale addebita **50,00 €** su tutti i 26 slot pubblicati. Va corretto lì, non sul sito: le pagine, `pricing.md` e `llms.txt` dicono già 45.

### 2. Clase Suelta Torno = **65 €**, disponibilità confermata
Giorni liberi: **martedì, mercoledì, venerdì, sabato alle 11:00**. In più si può fare **mercoledì 18:30**.
Oggi nel gestionale **non esiste nessuno slot** di Clase Suelta Torno: vanno creati. Il sito la vende già a 65 €, quindi la pagina è corretta e manca solo la disponibilità.

### 3. Lo studio è **chiuso lunedì e domenica**
La Clase Suelta si può fare **sempre, tranne lunedì e domenica**. Quindi il range reale è **martedì → sabato**.

### 4. Lo slot del 28/09 è un **duplicato**, da cancellare.

---

## ⚠️ Conseguenza grave emersa dalla risposta 3

Nel gestionale ci sono **13 slot di Clase Suelta Modelado il LUNEDÌ alle 15:00**, prenotabili online da oggi fino al 21 novembre.

**Il lunedì lo studio è chiuso.** Un cliente può pagare adesso una lezione in un giorno in cui non c'è nessuno.

Slot lunedì attualmente prenotabili: 28/09 (×2, uno è il duplicato), 05/10, 12/10, 19/10, 26/10, 02/11, 09/11, 16/11.

Gli slot del **sabato alle 11:00** sono invece corretti e coerenti con quanto dice Lau.

---

## Azioni che ne derivano

| # | Azione | Dove | Note |
|---|---|---|---|
| 1 | Cancellare o spostare i 13 slot del lunedì | gestionale | Verificare prima se qualcuno ha già prenotato: in quel caso va avvisato, non cancellato in silenzio |
| 2 | Correggere il prezzo Clase Suelta Modelado 50 → 45 | gestionale | Il sito è già a 45 |
| 3 | Creare gli slot di Clase Suelta Torno | gestionale | Mar, Mié, Vie, Sáb 11:00 + Mié 18:30 · 65 € · max 2 persone |
| 4 | Cancellare il duplicato del 28/09 15:00 | gestionale | |
| 5 | Correggere i giorni in `pricing.md` e `llms.txt` | sito | Oggi dicono «Tuesday, Wednesday, Friday». Vanno allineati a quello che esisterà davvero dopo le azioni 1-3 |
| 6 | Correggere `istruzioni sito La Mesa.md` | repo | Dice «Jueves 16-18h», mai confermato da nessuno |

**Ordine:** prima il gestionale (1-4), poi il sito (5-6). Il sito deve descrivere una realtà che esiste già, non il contrario.

---

## Domande ancora aperte dopo queste risposte

1. **Il prezzo di 45 € copre 2 ore, o è una tariffa oraria?** La pagina dice «Mínimo 2 horas» e «Desde 45€»: se sono 45 € per 2 ore, «desde» è fuorviante e va tolto. Non risposto.
2. **La Clase Suelta di Modelado in che orari si fa?** Lau ha dato gli orari del Torno (11:00 e mercoledì 18:30) ma per il Modelado ha detto solo «sempre tranne lunedì e domenica». Oggi nel gestionale esiste solo il sabato 11:00 (più i lunedì sbagliati). Servono giorni e ore precise da pubblicare.
3. **Chi apre gli slot nel gestionale**, Lau e Vick o Andrea? Determina se il problema si ripresenterà.
4. **Le 8 persone di capienza** della Clase Suelta Modelado sono confermate?

I blocchi 1-10 del documento [07_PREGUNTAS_CONTENIDO.md](07_PREGUNTAS_CONTENIDO.md) restano da mandare.
