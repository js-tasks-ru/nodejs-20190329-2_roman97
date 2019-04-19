const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Not supported');
      }

      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitedStream = new LimitSizeStream({limit: 1000000});

      limitedStream.on('error', () => {
        fs.unlink(filepath, () => {});
        res.statusCode = 413;
        res.end('To big size');
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File is already exists');
        }
      });

      req
          .pipe(limitedStream)
          .pipe(writeStream);

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('success');
      });

      req.on('close', () => {
        fs.unlink(filepath, () => {
          res.statusCode = 500;
          res.end('Somthing went wrong');
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
