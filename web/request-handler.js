var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!



exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    if (req.url === '/' || req.url === '/index.html') {

      fs.readFile(archive.paths.index, 'utf8', (err, data) => {
        if (err) { throw err; }
        res.writeHead(200, exports.headers);
        res.end(data);
      });
    } else {
      fs.readFile(archive.paths.archivedSites + req.url, 'utf8', (err, data) => {
        if (data === undefined) {
          res.writeHead(404, exports.headers);
          //might need to require headers or some shit, check export.headers if there's a problem w/ headers
          res.end('err');
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
    // var inputUrl = body.split('=');
    console.log(archive.paths.list);
    req.on('end', function () {
      fs.write('archives.paths.list', body.slice(4), (err) => {
        if (err) { throw err; }
        console.log('The inputUrl was appended to file!');
        res.writeHead(302, exports.headers);
        res.end(archive.paths.list);
      });
    }
  );


  }


  // res.end(archive.paths.list);
};
