'use strict';

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
            const pages = rows.map((page) => { return new Page(page.id, page.title, page.author, page.date, page.publication_date) })
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
          if (row == undefined) {
            resolve({ error: 'Page not found!' });
          }
          else {
            const sqlBlocks = 'SELECT * FROM Blocks WHERE idPage=?';
            db.all(sqlBlocks, [pageId], (err, rows) => {
              if (err) {
                reject(err);
              }
              else {
                const blocks = rows.map((block) => { return new Block(block.id, block.type, block.content, block.idPage, block.position) })
                const page = new Page(row.id, row.title, row.author, row.date, row.publication_date); 
                resolve({page: page, blocks: blocks});
              }
            });
          }
        });
    });
};

exports.getPageInfo = (pageId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Pages WHERE id=?';
      db.get(sql, [pageId], (err, row) => {
        if (err) {
          reject(err);
        }
        if (row == undefined) {
          resolve({ error: 'Page not found!' });
        }
        else {
          const page = new Page(row.id, row.title, row.author, row.date, row.publication_date); 
          resolve({page: page});
        }
      });
  });
};

exports.createPage = (newPage) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Pages(title, author, date, publication_date) VALUES(?,?,?,?)';
        db.run(sql, [newPage.title, newPage.author, newPage.date, newPage.publication_date], function (err) {
          if (err) {
            reject(err);
          }
          else {
            resolve(new Page(this.lastID, newPage.title, newPage.author, newPage.date, newPage.publication_date));
          }
        });
    });
};

exports.updatePage = (pageId, page, updateBlocks, deleteBlocks, addBlocks) => {
    return new Promise((resolve, reject) => {
        // can not update `date` and `author` fields
        const sql = `UPDATE Pages SET title=?, publication_date=? WHERE id=?` ;

        db.run(sql, [page.title, page.publication_date, pageId], (err) => {
          if (err) {
            reject(err);
          }
          else {
            //update blocks
            const updateBlock = `UPDATE Blocks SET type=?, content=?, position=? WHERE id=? AND idPage=?`;
            updateBlocks.forEach(b => {
              db.run(updateBlock, [b.type, b.content, b.position, b.id, pageId], (err) => {
                if (err) {
                  reject(err)
                }
              });
            });
            //delete blocks
            const deleteBlock = `DELETE FROM Blocks WHERE id=? AND idPage=?`;
            deleteBlocks.forEach(b => {
              db.run(deleteBlock, [b.id, pageId], (err) => {
                if (err) {
                  reject(err)
                }
              });
            });
            // add new blocks
            const addBlock = 'INSERT INTO Blocks(type, content, idPage, position) VALUES(?,?,?,?)';
            addBlocks.forEach(b => {
              db.run(addBlock, [b.type, b.content, pageId, b.position], (err) => {
                if (err) {
                  reject(err);
                }
              });
            });
            resolve({});
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
          // if (this.changes < 1) { 
          //   resolve({ error: 'Page not found!' }); 
          // }
          // else{
             resolve(null);
          // }
        });
      }
    });
  });
};

exports.updateAuthor = (pageId, author) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Pages SET author=? WHERE id=?`;

    db.run(sql, [author, pageId], (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({});
      }
    });
  });
}
/******************** Blocks ********************/

exports.getAllBlocksByPage = (pageId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Blocks WHERE idPage=?';
      db.all(sql, [pageId], (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          const blocks = rows.map((block) => { return new Block(block.id, block.type, block.content, block.idPage, block.position)})
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
          resolve(new Block(row.id, row.type, row.content, row.idPage, row.position));
        }
      });
  });
};

exports.createBlock = (newBlock) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Blocks(type, content, idPage, position) VALUES(?,?,?,?)';
      db.run(sql, [newBlock.type, newBlock.content, newBlock.idPage, newBlock.position], function (err) {
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
      const sql = `UPDATE Blocks SET content=?, position=? WHERE id=?`;

      db.run(sql, [block.content, block.position, blockId], (err) => {
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