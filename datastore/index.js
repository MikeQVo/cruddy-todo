const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw 'error';
    } else {
      var filePath = exports.dataDir + '/' + id + '.txt';
      fs.writeFile(filePath, text, () => {
        callback(null, { id, text });
      });
    }
  });
};


exports.readAll = (callback) => {
  var promise1 = new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

// fs.readdir(exports.dataDir, (err, files) => {
//   if (err) {
//     throw 'error';
//   } else {
//     var data = _.map(files, (text, index) => {
//       return { id: text.slice(0, 5), text: text.slice(0, 5) };
//     });
//     callback(null, data);
//   }
// });

exports.readOne = (id, callback) => {

  var filePath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw `No item with id: ${id}`;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
