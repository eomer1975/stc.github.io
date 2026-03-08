const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function sendResponse(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function resolveFilePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requestPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const absolutePath = path.normalize(path.join(ROOT_DIR, requestPath));

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';

  if (method !== 'GET' && method !== 'HEAD') {
    sendResponse(res, 405, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
    return;
  }

  const filePath = resolveFilePath(req.url || '/');

  if (!filePath) {
    sendResponse(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad Request');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      sendResponse(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (method === 'HEAD') {
      sendResponse(res, 200, { 'Content-Type': contentType, 'Content-Length': stats.size }, null);
      return;
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stats.size });
    stream.pipe(res);

    stream.on('error', () => {
      sendResponse(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Internal Server Error');
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server avviato su http://${HOST}:${PORT}`);
});
