# Configurazione GA4 in sospeso — Property 532584494 (lamesabcn.com)

## Perché è in sospeso

Il service account `ga4-reader@lamesa-seo-mcp.iam.gserviceaccount.com` ha accesso in sola lettura alla property GA4. I due interventi sotto richiedono permessi di **scrittura** (POST su customDimensions, PATCH su property settings), che generano errori 403 PERMISSION_DENIED quando invocati via API Admin. Google ha inoltre bloccato gli scope `analytics.*` sul client ID di default di gcloud, rendendo impossibile elevare i permessi via automation.

## Come sbloccare in futuro

### Opzione A — Ruolo Editor (consigliato per automazione futura)
Accedi a Google Analytics 4 → Amministrazione → (colonna Visualizzazione dati) Gestione accessi alla proprietà → Aggiungi accesso diretto → Inserisci l'email del service account (`ga4-reader@lamesa-seo-mcp.iam.gserviceaccount.com`) e assegnagli il ruolo **Editor**. Dopo questa modifica, i due interventi sotto tornano automatizzabili via API.

### Opzione B — Esecuzione manuale
Segui i due interventi qui sotto utilizzando la UI di GA4. Non richiedono accesso API né credenziali di servizio, solo accesso diretto alla property come Admin.

---

## Intervento 1 — Dimensione personalizzata `event_label`

### Stato attuale
La property **non ha alcuna dimensione personalizzata** registrata.

### Percorso UI
Google Analytics 4 → Amministrazione → (colonna Visualizzazione dati) Definizioni personalizzate → Dimensioni personalizzate → Crea dimensione personalizzata

### Valori da inserire
| Campo | Valore |
|---|---|
| **Nome dimensione** | Event label |
| **Ambito** | Evento |
| **Descrizione** | Etichetta CTA (taller_semanal / clase_suelta) inviata da click_cta e click_whatsapp |
| **Parametro evento** | event_label |

### Perché serve
Gli eventi `click_cta` e `click_whatsapp` inviano già il parametro `event_label` nelle pagine del sito, ma senza una dimensione personalizzata registrata in GA4, i click restano indistinguibili fra taller semanal e clase suelta. **Negli ultimi 90 giorni sono 214 click non categorizzati.**

### Nota importante
Le dimensioni personalizzate **non sono retroattive**. Raccolgono dati solo dai parametri inviati **dopo la creazione della dimensione**. I 214 click storici rimarranno non categorizzati; il tracking inizia dal momento in cui la dimensione è stata creata.

---

## Intervento 2 — Fuso orario

### Stato attuale
La property è configurata con fuso orario `Atlantic/Canary`, che è **un'ora indietro** rispetto all'orario reale dello studio a Barcellona (Europe/Madrid, GMT+01:00).

### Percorso UI
Google Analytics 4 → Amministrazione → Impostazioni della proprietà → Fuso orario dei report → `(GMT+01:00) Madrid`

### Perché serve
I report orari e i confini di giornata sono attualmente sfasati di un'ora. Questo rende difficile allineare i dati GA4 con gli orari effettivi delle lezioni e dei cron job del backend (che girano su Europe/Madrid). La correzione riporta i report in sincronia con la realtà operativa.

### Nota importante
Il cambio di fuso orario **non ricalcola i dati storici**. Il confine di giornata (mezzanotte, confine mensile) cambia solo da lì in avanti. **Nel giorno del cambio, gli aggregati giornalieri/mensili vanno letti con cautela** nei confronti mese su mese, perché il giorno avrà un'ora di dati nel vecchio fuso e il resto nel nuovo.

---

## Come verificare dopo gli interventi

Incolla il comando qui sotto nel terminale. Legge lo stato della property **senza scrivere nulla** (le credenziali in sola lettura bastano):

```bash
python3 -c "
from google.oauth2 import service_account
import google.auth.transport.requests as tr, urllib.request, json
c = service_account.Credentials.from_service_account_file('/Users/andreapesce/ga4-reader-key.json', scopes=['https://www.googleapis.com/auth/analytics.readonly'])
c.refresh(tr.Request())
for path in ['', '/customDimensions']:
    r = urllib.request.Request('https://analyticsadmin.googleapis.com/v1beta/properties/532584494' + path, headers={'Authorization': 'Bearer ' + c.token})
    print(urllib.request.urlopen(r).read().decode())
"
```

### Atteso dopo gli interventi
- Nel primo output (GET property): `"timeZone": "Europe/Madrid"`
- Nel secondo output (GET customDimensions): una dimensione con `"parameterName": "event_label"` e scope `"DIMENSION_SCOPE_UNSPECIFIED"`

### Se uno dei due interventi manca
- Manca event_label: il secondo output sarà una lista vuota o assente `"customDimensions"`.
- Manca il cambio fuso: il primo output avrà ancora `"timeZone": "America/Canary"` (non Europe/Madrid).

---

## Metadata
- **Data documento**: 22/09/2026
- **Backup property**: effettuare un export della configurazione property (GA4 → Amministrazione → Impostazioni della proprietà → Export) **prima di ogni tentativo di modifica**, salvare localmente con timestamp.
- **Property ID**: 532584494
- **Sito**: lamesabcn.com
- **Service account di riferimento**: ga4-reader@lamesa-seo-mcp.iam.gserviceaccount.com
