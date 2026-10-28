// The numbers for the "Call now" pop-up. The text line is the Twilio number, read from TWILIO_FROM in Netlify at run time
// so it never has to be written into the site's code (Netlify's secret scan watches that variable).
//   GET /.netlify/functions/phones → { text: "+19015551234" } or { text: "" }
export default async () => {
  const d = String(process.env.TWILIO_FROM || '').replace(/\D/g, '').slice(-10);
  return new Response(JSON.stringify({ text: d.length === 10 ? '+1' + d : '' }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' } });
};
