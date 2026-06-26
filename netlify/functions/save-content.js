// GrayCo Website - Cloud Content Sync
// Saves site content to GitHub so all devices stay in sync
const https = require('https');

function githubRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GrayCo-Website',
        'Content-Type': 'application/json'
      }
    };
    if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // Not configured yet — fail silently so the site still works locally
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: 'GITHUB_TOKEN not configured' }) };
  }

  let content;
  try {
    content = JSON.parse(event.body || '{}').content;
  } catch(e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid body' }) };
  }
  if (!content) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No content' }) };

  const filePath = '/repos/grayco-cs/grayco-website/contents/content.json';

  // Get current file SHA (required by GitHub API to update a file)
  let sha;
  try {
    const getRes = await githubRequest('GET', filePath, null, token);
    if (getRes.status === 200) sha = JSON.parse(getRes.body).sha;
  } catch(e) { /* file may not exist yet */ }

  // Write the updated content
  const payload = {
    message: 'Update site content',
    content: Buffer.from(content).toString('base64')
  };
  if (sha) payload.sha = sha;

  try {
    const putRes = await githubRequest('PUT', filePath, payload, token);
    if (putRes.status === 200 || putRes.status === 201) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } else {
      console.error('GitHub write failed:', putRes.status, putRes.body.substring(0, 200));
      return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'GitHub write failed' }) };
    }
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
