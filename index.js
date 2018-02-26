// environment
require('dotenv').config();

const http = require('http');
const https = require('https');
const fs = require('fs');

const db = require('./src/db');
const initializeApp = require('./src/server');

db.then(db => initializeApp(db))
  .then(app => {
    // http
    http.createServer(app)
      .listen(
        process.env.APP_HTTP_PORT,
        () => console.log(`[HTTP] Listening on port ${process.env.APP_HTTP_PORT} (${process.env.NODE_ENV})`)
      );

    // https
    // https.createServer({
    //   key: fs.readFileSync(process.env.SSL_PATH + 'privkey.pem'),
    //   cert: fs.readFileSync(process.env.SSL_PATH + 'fullchain.pem')
    // }, app)
    // .listen(
    //   process.env.APP_HTTPS_PORT,
    //   () => console.log(`[HTTPS] Listening on port ${process.env.APP_HTTPS_PORT} (${process.env.NODE_ENV})`)
    // );
  });
