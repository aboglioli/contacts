// express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const pkg = require('../package.json');
const {asyncMiddleware} = require('./middlewares');
const handlers = require('./handlers');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set routes
module.exports = async (db) => {
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.get('/', (req, res) => res.send(pkg.version));

  app.get('/:passwd', asyncMiddleware(handlers.getContacts));
  app.post('/:contactId', asyncMiddleware(handlers.addContact));
  app.post('/configure/:passwd', asyncMiddleware(handlers.addProject));

  return app;
};
