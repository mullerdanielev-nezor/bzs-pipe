const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const port = 8734;

http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(dir, decodeURIComponent(filePath.split('?')[0]));
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving on http://localhost:${port}`);
});
