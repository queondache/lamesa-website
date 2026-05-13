# MCP google-analytics (UFFICIALE Google) — configurazione attiva

**Setup completato:** 2026-05-13
**Repo ufficiale:** https://github.com/googleanalytics/google-analytics-mcp (2070+ stars, org `googleanalytics`)
**Pacchetto PyPI:** `analytics-mcp` v0.4.0
**Scope registrazione CC:** user (global, tutti i progetti)
**Binary:** `/Users/andreapesce/.local/bin/analytics-mcp` (pipx env, Python 3.14.5)
**Alias secondario:** `/Users/andreapesce/.local/bin/google-analytics-mcp` (stesso pkg)

## Credenziali

### OAuth Desktop client
- File: `~/.config/google-seo-mcp/credentials.json` (403 byte, type "installed")
- Client ID: `774941720325-k4qcvp4d9se2iafeboq0eackcnje7kao.apps.googleusercontent.com`

### ADC (Application Default Credentials)
- File: `~/.config/gcloud/application_default_credentials.json` (creato da gcloud auth)
- Scope autorizzati: `analytics.readonly` + `cloud-platform`
- Account: `lamesa.lc@gmail.com`

## GCP project

- **Nome:** lamesa-seo-mcp
- **Org:** Sin organización (account `lamesa.lc@gmail.com`)
- **API abilitate:** Google Analytics Admin API + Google Analytics Data API + Google Search Console API (Admin API abilitata 2026-05-13 post-403 SERVICE_DISABLED)
- **OAuth consent:** Externo, test user `lamesa.lc@gmail.com`

## MCP registrato in `~/.claude.json`

```json
{
  "google-analytics": {
    "type": "stdio",
    "command": "/Users/andreapesce/.local/bin/analytics-mcp",
    "env": {
      "GOOGLE_CLOUD_PROJECT": "lamesa-seo-mcp"
    }
  }
}
```

**Nota**: `GOOGLE_APPLICATION_CREDENTIALS` NON serve come env var — il path default `~/.config/gcloud/application_default_credentials.json` viene auto-rilevato da google-auth library.

## Risorse target (da confermare post-restart sessione)

### GA4
- Measurement ID: `G-SQ90MD674K`
- Property ID numerico: **532584494** (account `391057671` "La mesa", confermato 2026-05-13 via `get_account_summaries`)
- TZ property: `Atlantic/Canary` · Currency: `EUR`
- Smoke test `run_report` totalUsers 2026-05-12: 4 users → API live

### GSC
- Site URL: `https://lamesabcn.com/` (verifica vs `sc-domain:lamesabcn.com`)
- **TBD** — non c'è MCP ufficiale Google per GSC. Andrea sceglie tra:
  - **A** CSV manual export (10 min) salvati in `00_RAW_DATA/gsc_60d/`
  - **B** Cowork browser pilotato

## Sintassi che funziona per `claude mcp add`

```bash
# Corretto (-- prima del nome per terminare variadic -e)
claude mcp add --scope user \
  -e GOOGLE_CLOUD_PROJECT=lamesa-seo-mcp \
  -- google-analytics /Users/andreapesce/.local/bin/analytics-mcp
```

**Pattern errato** (variadic -e mangia il name): `claude mcp add -e KEY=val google-analytics /path/`.

## Comandi diagnostici

```bash
# Verifica MCP registrato
claude mcp list | grep google-analytics

# Status binary
which analytics-mcp
analytics-mcp 2>&1 | head -5  # se output "Starting MCP Stdio Server" = ok

# ADC valid
gcloud auth application-default print-access-token | head -c 100

# Rimuovere registrazione (se serve reset)
claude mcp remove google-analytics

# Re-add
claude mcp add --scope user -e GOOGLE_CLOUD_PROJECT=lamesa-seo-mcp -- google-analytics /Users/andreapesce/.local/bin/analytics-mcp
```

## .gitignore status

- ADC file in `~/.config/gcloud/` — fuori repo ✓
- OAuth credentials in `~/.config/google-seo-mcp/` — fuori repo ✓
- Repo `lamesa-website` non a rischio commit accidentale

## Note di rollback

In caso di reset completo:
```bash
claude mcp remove google-analytics
pipx uninstall analytics-mcp
# OAuth + ADC restano in ~/.config (cancellare manualmente se serve)
# brew uninstall --cask google-cloud-sdk  # solo se gcloud non più necessario
```
