var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(value, callback) {
  exports.readListOfUrls(function(list) {
    if (list.indexOf(value) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, (err, data) => {
    if (err) { throw err; }
    callback(data);
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, list) => {
    if (err) { throw err; }
    if (list.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });

};

exports.downloadUrls = function(list, callback) {
  list.forEach(function(item) {
    exports.isUrlArchived(item, function(bool) {
      if (!bool) {
        fs.writeFile(exports.paths.archivedSites + '/' + item, {flag: 'wx'}, (err, callback) => {
          if (err) { throw err; }
        });
      }
    });
  });
};
