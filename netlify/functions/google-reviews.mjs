// Google reviews for the website (Reviews section) and the /review short link (QR codes, cards, trucks).
// Netlify → Site configuration → Environment variables:
//   GOOGLE_PLACES_KEY  a Google Maps Platform API key with "Places API (New)" turned on (keep it secret).
//   GOOGLE_PLACE_ID    optional. Without it the place is found once by name (GOOGLE_PLACE_QUERY, default below) and remembered.
// Without the key the site still works: it shows the reviews typed into the editor and the review link from the editor.
// Google is asked at most once every 12 hours (the answer is kept in Netlify Blobs), so the API cost stays near zero.
//   GET /.netlify/functions/google-reviews          → { ok, rating, count, reviews:[…], mapsUrl, writeUrl }
//   GET /review  (→ ?go=write)                      → 302 to Google's "write a review" box for GrayCo
import { getStore } from '@netlify/blobs';

const TTL = 12 * 3600 * 1000;
const QUERY = () => process.env.GOOGLE_PLACE_QUERY || 'GrayCo Construction Services, Bartlett, TN';
const json = (body, status = 200, maxAge = 3600) => new Response(JSON.stringify(body), { status,
  headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=' + maxAge, 'access-control-allow-origin': '*' } });
const writeUrl = id => id ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(id) : '';

async function placeId(key, store) {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID.trim();
  const kept = await store.get('place-id').catch(() => null);
  if (kept) return kept;
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id' },
    body: JSON.stringify({ textQuery: QUERY(), maxResultCount: 1 }) });
  if (!r.ok) throw new Error('place search ' + r.status);
  const id = ((await r.json()).places || [])[0]?.id || '';
  if (id) await store.set('place-id', id).catch(() => {});
  return id;
}

async function fresh(key, store) {
  const id = await placeId(key, store);
  if (!id) throw new Error('GrayCo was not found on Google Maps — set GOOGLE_PLACE_ID');
  const r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id), {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,rating,userRatingCount,reviews,googleMapsUri' } });
  if (!r.ok) throw new Error('place details ' + r.status);
  const p = await r.json();
  return { ok: true, at: Date.now(), rating: p.rating || 0, count: p.userRatingCount || 0, mapsUrl: p.googleMapsUri || '', writeUrl: writeUrl(p.id || id),
    reviews: (p.reviews || []).map(v => ({ name: v.authorAttribution?.displayName || 'Google user', url: v.authorAttribution?.uri || '',
      photo: v.authorAttribution?.photoUri || '', stars: v.rating || 0, text: (v.text?.text || v.originalText?.text || '').slice(0, 1200),
      when: v.relativePublishTimeDescription || '', link: v.googleMapsUri || '' })) };
}

export default async (req) => {
  const go = new URL(req.url).searchParams.get('go');
  const key = (process.env.GOOGLE_PLACES_KEY || '').trim();
  const store = getStore('grayco-site');
  let data = null;
  try { data = JSON.parse(await store.get('google-reviews') || 'null'); } catch (e) {}
  if (key && (!data || Date.now() - (data.at || 0) > TTL)) {
    try { data = await fresh(key, store); await store.set('google-reviews', JSON.stringify(data)); }
    catch (e) { console.log('google-reviews:', e.message); }          // keep showing the last good answer
  }
  if (go === 'write') {
    let to = data?.writeUrl || writeUrl((process.env.GOOGLE_PLACE_ID || '').trim());
    if (!to) { try { const c = JSON.parse(await store.get('content') || '{}'); to = c.footer?.reviewLink || c.footer?.google || ''; } catch (e) {} }
    return new Response(null, { status: 302, headers: { location: to || 'https://grayco-cs.com/', 'cache-control': 'no-store' } });
  }
  if (!data) return json({ ok: false, setup: !key }, 200, 600);
  return json(data);
};
