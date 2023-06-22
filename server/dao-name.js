'use strict';

const db = require('./db');

exports.getName = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Website';
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
      }
      if (!row) {
        resolve({ error: 'Website name not found!' });
      }
      else {
        resolve({ name: row.name });
      }
    });
  });
};

exports.updateName = (newName) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Website SET name=?';
    db.run(sql, [newName], (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({});
      }
    });
  });
};