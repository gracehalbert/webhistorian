// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var fs = require('fs');

// exports.htmlfetcher = function (url, fileName) {
//   http.get(url, function(response) {
//     if (response.statusCode !== 200) {
//       if (response) {
//         console.log(response.statusCode + ' error getting ' + url);
//       }
//       // process.exit(1);
//     }
//     response.on('data', function(chunk) {
//       fs.open(fileName, 'w', (err, data) => {
//         if (err) { throw err; }
//         console.log('fileName: ', fileName, 'chunk: ');
//         fs.write(fileName, chunk, 0, chunk.length, null, function (err, written, buffer) {
//           if (err) { throw err; }
//           // process.exit(1);
//         });
//       });
//     });
//     response.on('end', function () {
//       fs.close(fileName);
//       process.exit(0);
//     });
//   }).on('error', function(e) {
//     console.log(e.message);
//     process.exit(1);
//   });
// };

exports.htmlfetcher = function(url, dest) {
  var file = fs.createWriteStream(dest);
  console.log(file);
  var request = http.get('http://' + url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
  });
};
