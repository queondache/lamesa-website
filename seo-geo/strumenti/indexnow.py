#!/usr/bin/env python3
"""Avvisa Bing (e gli altri motori IndexNow) che alcune pagine di lamesabcn.com sono cambiate.

Uso, dopo che la modifica è online:
  python3 seo-geo/strumenti/indexnow.py https://lamesabcn.com/pagina.html [altre URL...]
  python3 seo-geo/strumenti/indexnow.py --sitemap        # tutte le URL della sitemap pubblica

La chiave è il file <chiave>.txt nella radice del sito (deciso da Andrea il 24/11/2026).
"""
import json
import re
import sys
import urllib.request

HOST = 'lamesabcn.com'
KEY = 'df01756e0ac4b224b3634e80122dedd1'
ENDPOINT = 'https://api.indexnow.org/indexnow'


def sitemap_urls():
    with urllib.request.urlopen(f'https://{HOST}/sitemap.xml', timeout=30) as r:
        return re.findall(r'<loc>([^<]+)</loc>', r.read().decode())


def main(argv):
    urls = sitemap_urls() if argv == ['--sitemap'] else argv
    urls = [u for u in urls if u.startswith(f'https://{HOST}/')]
    if not urls:
        sys.exit('Nessuna URL di lamesabcn.com da inviare')
    body = json.dumps({'host': HOST, 'key': KEY, 'keyLocation': f'https://{HOST}/{KEY}.txt', 'urlList': urls}).encode()
    req = urllib.request.Request(ENDPOINT, data=body, headers={'Content-Type': 'application/json; charset=utf-8'})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f'IndexNow: HTTP {r.status} per {len(urls)} URL')
    except urllib.error.HTTPError as e:
        # 200/202 = accettato; 403 = chiave non trovata online; 422 = URL non del dominio
        sys.exit(f'IndexNow: errore HTTP {e.code} {e.reason} per {len(urls)} URL')


if __name__ == '__main__':
    main(sys.argv[1:])
