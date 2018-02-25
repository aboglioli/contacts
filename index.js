const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const moment = require('moment');

// config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const sendEmail = require('./src/send-email')(gmailEmail, gmailPassword);
const {formatContact} = require('./src/utils');

const pkg = require('./package.json');

exports.addContact = functions.https.onRequest((req, res) => {
  const id = req.query.id;
  let contact = req.body;
  contact.fecha = contact.fecha || moment().format('DD/MM/YYYY HH:mm:ss');
  contact = formatContact(contact);

  return admin.database().ref('/messages').push(contact)
    .then(snapshot => {
      return res.redirect(303, snapshot.ref);
    });
});

exports.sendEmail = functions.database.ref('/messages/{pushId}').onWrite(event => {
  const snapshot = event.data;

  if(snapshot.previous.val() || !snapshot.val().name) {
    return;
  }

  const val = snapshot.val();

  sendEmail(val.name, val.email, val.contact);
});
