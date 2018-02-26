// environment
require('dotenv').config();

const http = require('http');
const https = require('https');
const fs = require('fs');

const db = require('./src/db');
const initializeApp = require('./src/server');

db.then(db => initializeApp(db))
  .then(app => {
    console.log(`ENV: ${process.env.NODE_ENV}`);

    // http
    http.createServer(app)
      .listen(
        process.env.APP_HTTP_PORT,
        () => console.log(`[HTTP] Listening on port ${process.env.APP_HTTP_PORT})`)
      );

    const certsExists = fs.existsSync(process.env.SSL_PATH + 'privkey.pem') &&
          fs.existsSync(process.env.SSL_PATH + 'fullchain.pem');

    if (certsExists) {
      const key = fs.readFileSync(process.env.SSL_PATH + 'privkey.pem');
      const cert = fs.readFileSync(process.env.SSL_PATH + 'fullchain.pem');

      https.createServer({key, cert}, app)
        .listen(
          process.env.APP_HTTPS_PORT,
          () => console.log(`[HTTPS] Listening on port ${process.env.APP_HTTPS_PORT}`)
        );
    } else {
      console.log(`[HTTPS] Certs were not found`);
    }
  });
