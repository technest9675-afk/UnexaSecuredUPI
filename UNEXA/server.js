const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg']);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let sanitizedUrl = req.url.split('?')[0];
  if (sanitizedUrl === '/' || sanitizedUrl === '') {
    sanitizedUrl = '/index.html';
  }

  let filePath = path.join(ROOT, sanitizedUrl);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, 'app', sanitizedUrl);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Weak ETag based on mtime and file size
  const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304);
    res.end();
    return;
  }

  // Caching policy
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  // Compression support (gzip / deflate)
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canCompress = COMPRESSIBLE.has(ext) && stat.size > 1024;

  if (canCompress && /\bgzip\b/.test(acceptEncoding)) {
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Encoding': 'gzip',
      'Vary': 'Accept-Encoding'
    });
    fs.createReadStream(filePath).pipe(zlib.createGzip({ level: 6 })).pipe(res);
  } else if (canCompress && /\bdeflate\b/.test(acceptEncoding)) {
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Encoding': 'deflate',
      'Vary': 'Accept-Encoding'
    });
    fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`UNEXA High-Performance Server running at: http://localhost:${PORT}/`);
});
