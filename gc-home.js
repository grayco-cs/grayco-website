/* gc-home.js — GrayCo home page extras (patch MKT2): "Referral partners" (#partners: realtors, insurance agents,
   property managers — incl. the free pre-listing roof check) and "Free guides" (#guides: the Storm Damage Checklist and
   Before You Hire a Contractor — name + e-mail, joins GrayCo News) + the monthly giveaway. Added under the contact /
   referral sections once the page has drawn. Forms go to the CRM through gc-site.js (GC.send). */
(function(){
  if (window.__gcHome) return; window.__gcHome = true;
  var GW = 'https://crm.grayco-cs.com/giveaway.html?gc=website';
  var css = '#partners,#guides{padding:100px 24px;font-family:Outfit,Arial,sans-serif}#partners{background:#f6f4ef;color:#1b1640}#guides{background:#fff;color:#1b1640}' +
    '.gx-wrap{max-width:1100px;margin:0 auto}.gx-kick{font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#b8902f;font-weight:600;margin:0 0 12px}' +
    '.gx-wrap h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;font-size:clamp(32px,4vw,48px);line-height:1.1;margin:0 0 16px}.gx-wrap p{line-height:1.7;font-size:16px;color:#3a3858}' +
    '.gx-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}.gx-card{background:#fff;border:1px solid #e6e2d8;padding:28px;box-shadow:0 12px 30px rgba(27,22,64,.08)}' +
    '.gx-card h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:26px;font-weight:500;margin:0 0 8px}.gx-card label{display:block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8888a0;font-weight:600;margin:12px 0 6px}' +
    '.gx-card input,.gx-card select,.gx-card textarea{width:100%;box-sizing:border-box;padding:12px 13px;border:1px solid #dddde8;font:14px Outfit,Arial,sans-serif;color:#1b1640;background:#fff}' +
    '.gx-btn{display:inline-block;margin-top:16px;background:#b8902f;color:#fff;border:none;padding:14px 26px;font:700 13px Outfit,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;text-decoration:none}' +
    '.gx-ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:12px;margin-top:12px;font-weight:600}.gx-err{color:#b91c1c;margin-top:10px;font-weight:600}.gx-hp{position:absolute;left:-9999px;opacity:0;width:1px;height:1px}' +
    '.gx-list{margin:18px 0 0;padding:0;list-style:none}.gx-list li{padding:8px 0 8px 28px;position:relative}.gx-list li:before{content:"✓";position:absolute;left:0;color:#b8902f;font-weight:700}' +
    '.gx-three{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:28px}@media(max-width:860px){.gx-grid,.gx-three{grid-template-columns:1fr;gap:28px}#partners,#guides{padding:70px 16px}}';
  function el(h){ var d = document.createElement('div'); d.innerHTML = h; return d.firstChild; }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var partners = '<section id="partners"><div class="gx-wrap gx-grid"><div><div class="gx-kick">Referral partners</div><h2>Realtors, insurance agents &amp; property managers</h2>' +
    '<p>Your clients trust you for a recommendation. When an inspection flags the roof, a storm hits, or a rental needs work fast, send them to GrayCo — a licensed, local contractor that responds quickly and reports back to you.</p>' +
    '<ul class="gx-list"><li>Your own partner link and a page that shows every referral and where it stands</li><li><b>Realtors: a free pre-listing roof check</b> for your sellers — photos and a short written summary before you list</li><li>A thank-you for every referral that hires GrayCo</li><li>Lunch &amp; learns for your office — lunch is on us</li></ul></div>' +
    '<div class="gx-card"><h3>Become a partner</h3><p style="font-size:13px;color:#666">We will e-mail you your partner link once we set you up.</p>' +
    '<label>Your name</label><input data-f="name" autocomplete="name"><label>Company</label><input data-f="company" autocomplete="organization">' +
    '<label>You are a…</label><select data-f="partner_type"><option value="realtor">Realtor</option><option value="insurance">Insurance agent</option><option value="property">Property manager</option><option value="other">Other</option></select>' +
    '<label>E-mail</label><input data-f="email" type="email" autocomplete="email"><label>Phone</label><input data-f="phone" type="tel" autocomplete="tel"><label>Anything we should know? (e.g. a pre-listing roof check)</label><textarea data-f="message" rows="3"></textarea>' +
    '<input data-f="website" class="gx-hp" tabindex="-1" autocomplete="off"><button class="gx-btn" data-go="partner">Sign me up</button><div data-out></div></div></div></section>';
  var guides = '<section id="guides"><div class="gx-wrap"><div class="gx-kick">Free guides</div><h2>Know what to do — before you need it</h2><p>Two short, printable guides from GrayCo. Tell us where to send it and the download starts right away. You will also get GrayCo News (unsubscribe any time).</p>' +
    '<div class="gx-three">' + [['storm', 'Storm Damage Checklist', 'What to check, photograph and do after hail, wind or a falling tree — and when to call your insurance.'], ['hire', 'Before You Hire a Contractor', 'The questions to ask, what a good estimate includes, and the red flags to walk away from.']].map(function(g){
      return '<div class="gx-card" data-guide="' + g[0] + '"><h3>' + g[1] + '</h3><p style="font-size:14px">' + g[2] + '</p><label>Your name</label><input data-f="name" autocomplete="name"><label>E-mail</label><input data-f="email" type="email" autocomplete="email"><input data-f="website" class="gx-hp" tabindex="-1" autocomplete="off"><button class="gx-btn" data-go="magnet">Get the free guide</button><div data-out></div></div>'; }).join('') +
    '<div class="gx-card"><h3>🎁 Monthly giveaway</h3><p style="font-size:14px">Every month GrayCo gives away a FREE handyman hour. One entry per person, no purchase necessary.</p><a class="gx-btn" href="' + GW + '" target="_blank" rel="noopener">Enter this month</a></div></div></div></section>';
  function wire(sec){
    sec.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-go]'); if (!b) return; e.preventDefault();
      var box = b.closest('.gx-card'), out = box.querySelector('[data-out]'), body = { type: b.getAttribute('data-go') };
      box.querySelectorAll('[data-f]').forEach(function(i){ body[i.getAttribute('data-f')] = i.value; });
      if (box.getAttribute('data-guide')) body.guide = box.getAttribute('data-guide');
      if (!window.GC) { out.innerHTML = '<div class="gx-err">Please call (901) 585-0944.</div>'; return; }
      b.disabled = true; out.innerHTML = '';
      window.GC.send(body).then(function(j){
        b.disabled = false;
        if (j && j.ok) {
          out.innerHTML = '<div class="gx-ok">' + esc(j.message || 'Thank you!') + '</div>';
          if (j.file) { var a = document.createElement('a'); a.href = '/downloads/' + j.file; a.download = j.file; document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); }, 1000); out.innerHTML += '<p style="font-size:13px"><a href="/downloads/' + esc(j.file) + '" target="_blank">Open the guide</a></p>'; }
        } else out.innerHTML = '<div class="gx-err">' + esc((j && j.error) || 'Not sent — please call (901) 585-0944.') + '</div>';
      });
    });
  }
  function place(){
    if (document.getElementById('partners')) return true;
    var after = document.getElementById('referrals') || document.getElementById('contact'); if (!after) return false;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var p = el(partners), g = el(guides); after.parentNode.insertBefore(g, after.nextSibling); after.parentNode.insertBefore(p, after.nextSibling); wire(p); wire(g);
    if (/#(partners|guides)$/.test(location.hash)) setTimeout(function(){ var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }, 300);
    return true;
  }
  if (!place()) { var mo = new MutationObserver(function(){ if (place()) mo.disconnect(); }); mo.observe(document.documentElement, { childList: true, subtree: true }); setTimeout(function(){ mo.disconnect(); }, 30000); }
})();
