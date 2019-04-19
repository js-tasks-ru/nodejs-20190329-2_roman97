const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      fs.readFile(filepath, (err, data) => {
        if (err) {
          if (pathname.includes('/')) {
            res.writeHead(400);
            res.end('No supporting');
          }

          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('No such file');
          }

          res.writeHead(500);
          res.end('Server error');
        }

        res.end(data);
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
