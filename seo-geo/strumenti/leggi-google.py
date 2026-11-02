# Legge le misure encargos da GA4 (proprieta 532584494) e Search Console (sc-domain:lamesabcn.com).
# Uso: python3 seo-geo/strumenti/leggi-google.py ~/ga4-reader-key.json [inizio_ga4] [inizio_gsc] [fine_gsc]
# La chiave del service account ga4-reader@lamesa-seo-mcp resta fuori dal repository.
# Serve: pip install google-auth
import json,sys,urllib.parse,urllib.request,urllib.error,warnings
warnings.filterwarnings("ignore")
from google.oauth2 import service_account
from google.auth.transport.requests import Request
c=service_account.Credentials.from_service_account_file(sys.argv[1],scopes=["https://www.googleapis.com/auth/analytics.readonly","https://www.googleapis.com/auth/webmasters.readonly"])
c.refresh(Request())
def post(url,body):
    r=urllib.request.Request(url,data=json.dumps(body).encode(),headers={"Authorization":"Bearer "+c.token,"Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(r))
    except urllib.error.HTTPError as e: return {"err":e.code,"body":e.read().decode()[:300]}
a=sys.argv+[None]*4
ga_start=a[2] or "2026-09-29"
gsc_start=a[3] or "2026-08-03"
gsc_end=a[4] or "2026-10-31"
rx="encarg|encarrec|encomenda|custom-tableware|corporate-gifts"
ga=post("https://analyticsdata.googleapis.com/v1beta/properties/532584494:runReport",{
 "dateRanges":[{"startDate":ga_start,"endDate":"yesterday"}],
 "dimensions":[{"name":"pagePath"},{"name":"eventName"}],"metrics":[{"name":"eventCount"},{"name":"totalUsers"}],
 "dimensionFilter":{"andGroup":{"expressions":[{"filter":{"fieldName":"pagePath","stringFilter":{"matchType":"PARTIAL_REGEXP","value":rx}}},{"filter":{"fieldName":"eventName","inListFilter":{"values":["page_view","click_whatsapp","click_email"]}}}]}},"limit":200})
print("GA4:",json.dumps([[x["value"] for x in r["dimensionValues"]]+[x["value"] for x in r["metricValues"]] for r in ga.get("rows",[])]) if "rows" in ga else ga)
for site in ["sc-domain:lamesabcn.com","https://lamesabcn.com/"]:
  for dims in (["page"],["query"]):
    sc=post("https://www.googleapis.com/webmasters/v3/sites/"+urllib.parse.quote(site,safe="")+"/searchAnalytics/query",{
     "startDate":gsc_start,"endDate":gsc_end,"dimensions":dims,"rowLimit":50,
     "dimensionFilterGroups":[{"filters":[{"dimension":"page","operator":"includingRegex","expression":rx}]}]})
    print("GSC",site,dims,json.dumps(sc.get("rows",sc))[:2500])
