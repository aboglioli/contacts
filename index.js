// environment
require('dotenv').config();
const debug = require('debug')('boot');

const http = require('http');
const https = require('https');
const fs = require('fs');

const db = require('./src/db');
const initializeApp = require('./src/server');

db.then(db => initializeApp(db))
  .then(app => {
    debug(`ENV: ${process.env.NODE_ENV}`);

    // http
    http.createServer(app)
      .listen(
        process.env.APP_HTTP_PORT,
        () => debug(`[HTTP] Listening on port ${process.env.APP_HTTP_PORT}`)
      );

    const certsExists = fs.existsSync(process.env.SSL_PATH + 'privkey.pem') &&
          fs.existsSync(process.env.SSL_PATH + 'fullchain.pem');

    if (certsExists) {
      const key = fs.readFileSync(process.env.SSL_PATH + 'privkey.pem');
      const cert = fs.readFileSync(process.env.SSL_PATH + 'fullchain.pem');

      https.createServer({key, cert}, app)
        .listen(
          process.env.APP_HTTPS_PORT,
          () => debug(`[HTTPS] Listening on port ${process.env.APP_HTTPS_PORT}`)
        );
    } else {
      debug(`[HTTPS] Certs were not found`);
    }
  });
