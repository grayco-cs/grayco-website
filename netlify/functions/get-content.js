const https = require('https');

function githubRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'GrayCo-Website',
        'Cache-Control': 'no-cache'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store'
  };

  const token = process.env.GITHUB_TOKEN;
  if (!token) return { statusCode: 200, headers, body: '{}' };

  try {
    const res = await githubRequest(
      '/repos/grayco-cs/grayco-website/contents/content.json',
      token
    );
    if (res.status === 200) {
      return { statusCode: 200, headers, body: res.body };
    }
    return { statusCode: 200, headers, body: '{}' };
  } catch(e) {
    return { statusCode: 200, headers, body: '{}' };
  }
};
