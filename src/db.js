const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');

module.exports  = low(adapter)
  .then(db => {
    db.defaults({ posts: [] }).write();
    return db;
  });
