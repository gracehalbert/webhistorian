var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var fetcher = require('../workers/htmlfetcher');
var http = require('http');
var Promise = require('bluebird');

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
  loading: path.join(__dirname, '../web/public/loading.html'),
  styles: path.join(__dirname, '../web/public/styles.css')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
readListOfUrlsAsync = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    callback(data.split('\n'));
  });
};

exports.readListOfUrls = Promise.promisify(readListOfUrlsAsync);

isUrlInListAsync = function(value, callback) {
  exports.readListOfUrls(function(list) {
    if (list.indexOf(value) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.isUrlInList = Promise.promisify(isUrlInListAsync);

addUrlToListAsync = function(url, callback) {
  fs.appendFile(exports.paths.list, url, (err, data) => {
    if (err) { throw err; }
    callback(data);
  });
};

exports.addUrlToList = Promise.promisify(addUrlToListAsync);

isUrlArchivedAsync = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, list) => {
    if (err) { throw err; }
    if (list.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};


exports.isUrlArchived = Promise.promisify(isUrlArchivedAsync);

downloadUrlsAsync = function(list, callback) {
  list.forEach(function(item) {
    exports.isUrlArchived(item, function(bool) {
      if (!bool) {
        fetcher.htmlfetcher(item, exports.paths.archivedSites + '/' + item);
      }
    });
  });
};

exports.downloadUrls = Promise.promisify(downloadUrlsAsync);
