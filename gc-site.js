/* gc-site.js — GrayCo website ↔ CRM (patch MKT2). Used by index.html and every city page.
   1. Where the visitor came from: utm_* tags, Google / Meta click ids, a tracked-link code (gc=) and a referral
      partner code (ref=RE-… / IN-… / PM-… / GP-…) are kept 90 days and added to every form sent to the CRM.
   2. Tags: the Google tag / Google Ads conversion / Meta pixel IDs come from the CRM (Marketing → Website, pixels &
      guides). Nothing loads until the visitor accepts the small cookie notice. A sent form fires a "lead" event —
      never a name, e-mail or phone.
   3. Forms: GC.send(body) posts to the CRM's website form door (a fresh form token first). */
(function(){
  if (window.GC) return;
  var CRM = 'https://crm.grayco-cs.com/.netlify/functions/', KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'gc'];
  function ls(k, v){ try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  /* 1. attribution */
  var A = (function(){ var o = ls('gc_attrib'); return o && o.t && Date.now() - o.t < 90 * 864e5 ? o.v || {} : {}; })();
  try {
    var q = new URLSearchParams(location.search), got = {};
    KEYS.forEach(function(k){ var v = q.get(k); if (v && /^[\w .:\/+-]{1,120}$/.test(v)) got[k] = v; });
    var r = q.get('ref'); if (r && /^(RE|IN|PM|GP)-[A-Z0-9]{2,12}$/i.test(r)) got.ref = r.toUpperCase();
    if (Object.keys(got).length) { if (got.utm_source || got.gclid || got.fbclid) KEYS.concat(['ref']).forEach(function(k){ if (!got[k]) delete A[k]; }); Object.assign(A, got); ls('gc_attrib', { v: A, t: Date.now() }); }
  } catch (e) {}
  /* 2. tags, only after consent */
  var PX = null, consent = ls('gc_consent');
  function loadTags(){
    if (!PX || window.__gcTags) return; window.__gcTags = true;
    var id = PX.gtag || (PX.ads && PX.ads.split('/')[0]);
    if (id) { var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id); document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function(){ dataLayer.push(arguments); }; gtag('js', new Date()); if (PX.gtag) gtag('config', PX.gtag); if (PX.ads) gtag('config', PX.ads.split('/')[0]); }
    if (PX.meta) { !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', PX.meta); fbq('track', 'PageView'); }
  }
  function banner(){
    if (consent || document.getElementById('gc-consent')) return;
    var d = document.createElement('div'); d.id = 'gc-consent';
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;max-width:560px;margin:0 auto;background:#0F1D2F;color:#fff;padding:14px 16px;border-radius:10px;font:14px/1.5 Outfit,Arial,sans-serif;z-index:99998;box-shadow:0 6px 24px rgba(0,0,0,.35);display:flex;gap:10px;align-items:center;flex-wrap:wrap';
    d.innerHTML = '<span style="flex:1;min-width:200px">We use cookies to see which ads and pages help people find GrayCo. OK?</span><button data-c="yes" style="background:#D4A017;color:#0F1D2F;border:none;border-radius:6px;padding:8px 14px;font-weight:700;cursor:pointer">Accept</button><button data-c="no" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:6px;padding:8px 14px;cursor:pointer">No thanks</button>';
    d.onclick = function(e){ var c = e.target.getAttribute && e.target.getAttribute('data-c'); if (!c) return; consent = c; ls('gc_consent', c); d.remove(); if (c === 'yes') loadTags(); };
    document.body.appendChild(d);
  }
  fetch(CRM + 'mkt-public?site=1').then(function(r){ return r.json(); }).then(function(j){
    window.GC_SITE = j; PX = j && j.pixels; if (PX && (PX.gtag || PX.ads || PX.meta)) { if (consent === 'yes') loadTags(); else if (!consent) { if (document.body) banner(); else document.addEventListener('DOMContentLoaded', banner); } }
    (window.GC_SITE_WAIT || []).forEach(function(f){ try { f(j); } catch (e) {} });
  }).catch(function(){});
  function conversion(kind){
    try { if (window.gtag) { gtag('event', 'generate_lead', { form: kind || 'website' }); if (PX && PX.ads && PX.ads.indexOf('/') > 0) gtag('event', 'conversion', { send_to: PX.ads }); } if (window.fbq) fbq('track', 'Lead'); } catch (e) {}
  }
  /* every form the page sends to the CRM carries the attribution, and a sent one fires the lead event (also the existing contact form) */
  var F0 = window.fetch;
  window.fetch = function(url, opts){
    var isForm = typeof url === 'string' && /\/website-intake(\?|$)/.test(url) && opts && opts.method === 'POST' && typeof opts.body === 'string';
    if (isForm) { try { var b = JSON.parse(opts.body); Object.keys(A).forEach(function(k){ if (b[k] == null) b[k] = A[k]; }); opts = Object.assign({}, opts, { body: JSON.stringify(b) }); var kind = b.type; } catch (e) {} }
    var p = F0.apply(this, [url, opts]);
    if (isForm) p.then(function(r){ if (r && r.ok) r.clone().json().then(function(j){ if (j && j.ok && j.received) conversion(kind); }).catch(function(){}); }).catch(function(){});
    return p;
  };
  /* 3. sending a form */
  var tok = '', got = 0;
  function token(){ return fetch(CRM + 'website-intake?form=1', { cache: 'no-store' }).then(function(r){ return r.json(); }).then(function(j){ if (j && j.token) { tok = j.token; got = Date.now(); } }).catch(function(){}); }
  token();
  function send(body){
    var ready = (!tok || Date.now() - got > 20 * 3600e3) ? token() : Promise.resolve();
    return ready.then(function(){ var w = Math.max(0, 3500 - (Date.now() - got)); return new Promise(function(r){ setTimeout(r, w); }); })
      .then(function(){ return fetch(CRM + 'website-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ token: tok, page: location.href }, body)) }); })
      .then(function(r){ return r.json().catch(function(){ return { ok: false }; }); }, function(){ return { ok: false, error: 'No connection — please call (901) 585-0944.' }; });
  }
  window.GC = { send: send, attrib: function(){ return Object.assign({}, A); }, site: function(f){ if (window.GC_SITE) f(window.GC_SITE); else (window.GC_SITE_WAIT = window.GC_SITE_WAIT || []).push(f); } };
})();
