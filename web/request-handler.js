var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var helpers = require('./http-helpers');
// require more modules/folders here!



exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    if (req.url === '/' || req.url === '/index.html') {

      fs.readFile(archive.paths.index, 'utf8', (err, data) => {
        console.log('index get');
        if (err) { throw err; }
        res.writeHead(200, exports.headers);
        res.end(data);
      });
    } else {
      fs.readFile(archive.paths.archivedSites + req.url, 'utf8', (err, data) => {
        if (data === undefined) {
          res.writeHead(404, exports.headers);
          //might need to require headers or some shit, check export.headers if there's a problem w/ headers
          // res.writeHead(301, {'Location': 'web/public/loading.html'}, exports.headers);
          res.end();
        } else {
          res.writeHead(200, exports.headers);
          res.end(data);
        }
      } );
    }
  }
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      fs.writeFile(archive.paths.list, body.slice(4) + '\n', (err, data) => {
        console.log('test');
        if (err) { throw err; }
        // console.log('test');
        res.writeHead(302, {'Location': archive.paths.loading}, exports.headers);
        res.end(data);
      });
    }
  );


  }


  // res.end(archive.paths.list);
};
