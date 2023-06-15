'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');
const {Page, Block} = require('./pb-constructors');

/******************** Pages ********************/

exports.getAllPages = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Pages';
        db.all(sql, (err, rows) => {
          if (err) {
            reject(err);
          }
          else {
            const pages = rows.map((page) => { return new Page(page.id, page.title, page.author, page.date, page.publicationDate) })
            resolve(pages);
          }
        });
    });
};

exports.getPage = (pageId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Pages WHERE id=?';
        db.get(sql, [pageId], (err, row) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(new Page(row.id, row.title, row.author, row.date, row.publicationDate));
          }
        });
    });
};

exports.createPage = (newPage) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Pages(title, author, date, publicationDate) VALUES(?,?,?,?)';
        db.run(sql, [newPage.title, newPage.author, newPage.date.toISOString(), newPage.publicationDate], (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
    });
};

exports.updatePage = (pageId, page) => {
    return new Promise((resolve, reject) => {
        // can not update `date` and `author` fields
        const sql = `UPDATE Pages SET title=?, publicationDate=? WHERE id=?` ;

        db.run(sql, [page.title, page.publicationDate, pageId], (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(true);
          }
        });
    });
};

exports.deletePage = (pageId) => {
    //Delete all blocks first then delete the page
    return new Promise((resolve, reject) => {
        const sqlBlocks = 'DELETE FROM Blocks WHERE idPage=?';

        db.run(sqlBlocks, [pageId], (err) => {
          if (err) {
            reject(err);
          }
          else {
            const sqlPages = 'DELETE FROM Pages WHERE id=?';
            
            db.run(sqlPages, [pageId], (err) => {
              if (err) {
                reject(err);
              }
              else {
                resolve(true);
              }
            });
          }
        });
    });
};

/******************** Blocks ********************/

exports.getAllBlocks = () => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Blocks';
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          const blocks = rows.map((block) => { return new Block(block.id, block.type, block.content, block.idPage)})
          resolve(blocks);
        }
      });
  });
};

exports.getBlock = (blockId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Blocks WHERE id=?';
      db.get(sql, [blockId], (err, row) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(new Block(row.id, row.type, row.content, row.idPage));
        }
      });
  });
};

exports.createBlock = (newBlock) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Blocks(type, content, idPage) VALUES(?,?,?)';
      db.run(sql, [newBlock.type, newBlock.content, newBlock.idPage], function (err) {
        if (err) {
          reject(err);
        }
        else {
          resolve(this.lastID);
        }
      });
  });
};

exports.updateBlock = (blockId, block) => {
  return new Promise((resolve, reject) => {
      // do not change the type of a block
      const sql = `UPDATE Blocks SET content=? WHERE id=?`;

      db.run(sql, [block.content, blockId], (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });
  });
};

exports.deleteBlock= (blockId) => {
  //Delete all blocks first then delete the page
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Blocks WHERE id=?';

      db.run(sql, [blockId], (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });
  });
};