// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var fs = require('fs');
var archive = require('../helpers/archive-helpers.js');


exports.htmlfetcher = function(url, dest) {
  var file = fs.createWriteStream(dest);
  var request = http.get('http://' + url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
  });
};
