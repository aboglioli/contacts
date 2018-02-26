// express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const pkg = require('../package.json');
const {asyncMiddleware} = require('./middlewares')M

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set routes
module.exports = async (db) => {
  const handlers = require('./handlers')(db);

  app.get('/', (req, res) => req.send(pkg.version));

  app.get('/:passwd', asyncMiddleware(handlers.getContacts));
  app.get('/:contactId', asyncMiddleware(handlers.addContact));
  app.get('/configure/:passwd', asyncMiddleware(handlers.addProject));

  return app;
};
