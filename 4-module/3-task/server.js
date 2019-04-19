const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (['/', '..'].includes(pathname)) {
        res.statusCode = 400;
        res.end('Bad request');
      }

      const readStream = fs.createReadStream(filepath);

      readStream.pipe(res);

      readStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not such file');
        }

        res.statusCode = 500;
        res.end('Server error');
      });

      readStream.on('end', () => {
        fs.unlink(filepath, (error) => {
          if (error) {
            res.statusCode = 500;
            res.end('Server error');
          }

          res.statusCode = 200;
          res.end('success');
        });
      });

      res.on('close', () => {
        if (res.finished) return;
        readStream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
