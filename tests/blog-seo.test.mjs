import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const base = 'https://lamesabcn.com';
const read = p => readFileSync(resolve(root, p), 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(?:39|x27);/g, "'").replace(/&(?:ndash|#8211);/g, '–').replace(/&(?:mdash|#8212);/g, '—').replace(/&nbsp;/g, ' ');
const plain = s => decode(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const tags = (s, tag) => [...s.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map(m=>attrs(m[0]));
const schemas = s => [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const articles = readdirSync(resolve(root,'blog')).filter(f=>f.endsWith('.html') && f!=='index.html').map(f=>'blog/'+f);
const indexes = {es:'blog/index.html',en:'en/blog/index.html',ca:'ca/blog/index.html',pt:'pt/blog/index.html'};
const indexUrl = lang => `${base}/${lang==='es'?'':lang+'/'}blog/`;
const meta = (s, key) => tags(s,'meta').find(m=>m.name===key || m.property===key)?.content;
const canonical = s => tags(s,'link').find(l=>l.rel==='canonical')?.href;
const documentCache = new Map();
function localTarget(url) {
 const path=decodeURIComponent(url.pathname);
 return resolve(root,'.'+path+(path.endsWith('/')?'index.html':''));
}
function checkLinks(s, file) {
 for (const a of [...tags(s,'a'),...tags(s,'img'),...tags(s,'script'),...tags(s,'link')]) {
  const ref=a.href || a.src; if(!ref) continue;
  const url=new URL(ref,`${base}/${file}`);
  if(url.origin!==base) continue;
  const target=localTarget(url);
  assert.ok(existsSync(target)&&statSync(target).isFile(), `${file}: broken local resource ${ref}`);
  if(url.hash && target.endsWith('.html')) {
   if(!documentCache.has(target)) documentCache.set(target,readFileSync(target,'utf8'));
   const ids=tags(documentCache.get(target),'[a-zA-Z][\\w:-]*').map(a=>a.id).filter(Boolean);
   assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))),`${file}: missing anchor ${ref}`);
  }
 }
}

for (const file of articles) test(`blog SEO: ${file}`,()=>{
 const s=read(file);const lang=tags(s,'html')[0].lang;const url=`${base}/${file}`;
 assert.ok(indexes[lang]);
 const h1=[...s.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];assert.equal(h1.length,1);
 const title=plain(h1[0][1]);const description=meta(s,'description');assert.ok(description?.length>40);
 assert.equal(canonical(s),url);
 assert.doesNotMatch(s,/<meta[^>]+name="(?:robots|googlebot)"[^>]+noindex/i);
 const data=schemas(s);const post=data.find(o=>o['@type']==='BlogPosting');assert.ok(post);
 assert.equal(post.headline,title);assert.equal(post.description,description);assert.equal(post.inLanguage,lang);
 assert.equal(post.mainEntityOfPage,url);assert.equal(meta(s,'og:url'),url);assert.equal(meta(s,'og:description'),description);
 assert.ok(post.image);assert.match(post.datePublished,/^\d{4}-\d{2}-\d{2}$/);assert.match(post.dateModified,/^\d{4}-\d{2}-\d{2}$/);
 assert.ok(post.dateModified>=post.datePublished);
 assert.ok(s.includes(`datetime="${post.dateModified}"`),'visible review date');
 const crumbs=data.find(o=>o['@type']==='BreadcrumbList').itemListElement;
 assert.equal(crumbs[1].item,indexUrl(lang));assert.equal(crumbs.at(-1).item,url);assert.equal(crumbs.at(-1).name,title);
 const alternates=tags(s,'link').filter(l=>l.hreflang);
 assert.ok(alternates.some(a=>a.hreflang===lang&&a.href===url));
 for(const alternate of alternates.filter(a=>a.hreflang!=='x-default')) {
  const other=readFileSync(localTarget(new URL(alternate.href)),'utf8');
  assert.ok(tags(other,'link').some(a=>a.hreflang===lang&&a.href===url),`reciprocal ${alternate.hreflang}`);
  const languageLinks=tags(s,'a').filter(a=>a.lang===alternate.hreflang);
  assert.equal(languageLinks.length,2,'desktop and mobile language switch');
  for(const link of languageLinks) assert.equal(new URL(link.href,base).href,alternate.href,'language switch stays on article');
 }
 const body=s.match(/<article\b[\s\S]*?<\/article>/)[0];
 for(const img of tags(body,'img')) assert.ok(img.alt?.trim(),'descriptive image alt');
 const faq=data.find(o=>o['@type']==='FAQPage');
 if(faq) for(const qa of faq.mainEntity) {
  assert.ok(plain(body).includes(plain(qa.name)), 'FAQ question visible');
  assert.ok(plain(body).includes(plain(qa.acceptedAnswer.text)), 'FAQ answer matches visible copy');
 }
 checkLinks(s,file);
 assert.ok(read(indexes[lang]).includes(`href="/${file}"`),'discoverable from language blog index');
});
for (const [lang,file] of Object.entries(indexes)) test(`blog index SEO: ${lang}`,()=>{
 const s=read(file);assert.equal(canonical(s),indexUrl(lang));
 const listed=tags(s,'a').filter(a=>a.href?.startsWith('/blog/')&&a.href.endsWith('.html')).map(a=>a.href.slice(1));
 const expected=articles.filter(a=>tags(read(a),'html')[0].lang===lang);
 assert.deepEqual([...new Set(listed)].sort(),expected.sort());
 const blog=schemas(s).find(o=>o['@type']==='Blog');assert.ok(blog);assert.equal(blog.inLanguage,lang);
 assert.deepEqual(blog.blogPost.map(p=>p.url).sort(),expected.map(p=>`${base}/${p}`).sort());
 for (const entry of blog.blogPost) {
  const post=schemas(read(entry.url.replace(base+'/',''))).find(o=>o['@type']==='BlogPosting');
  assert.equal(entry.headline,post.headline);assert.equal(entry.dateModified,post.dateModified);
 }
 for (const link of tags(s,'a').filter(a=>a.lang&&indexes[a.lang])) assert.equal(new URL(link.href,base).href,indexUrl(link.lang));
 checkLinks(s,file);
});
