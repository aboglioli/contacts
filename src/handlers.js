const debug = require('debug')('handlers');
const moment = require('moment');

const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

const sendEmail = require('./send-email')(gmailEmail, gmailPassword);
const {formatContact} = require('./utils');

exports.getContacts = async (req, res, next) => {
  debug('getContacts');
  if(req.params.passwd !== process.env.APP_PASSWORD) {
    debug('invalid password');
    return res.send('Invalid password');
  }
  return res.send(req.db.get('root').value());
};

exports.addContact = async (req, res, next) => {
  const db = req.db;

  const contactId = req.params.contactId;
  debug('addContact to id', contactId);

  let contact = req.body;
  contact.fecha = contact.fecha || moment().format('DD/MM/YYYY HH:mm:ss');
  contact = formatContact(contact);

  debug('contact', contact);

  const dbData = db.get('root').find({id: contactId}).value();

  if(!dbData) {
    return res.status(404).send('ID does not exist');
  }

  const data =  await db.get('root')
        .find({id: contactId})
        .assign({contacts: [...dbData.contacts, contact]})
        .write();

  debug('contact added');

  try {
    debug('calling sendEmail');
    const email = await sendEmail(data.name, data.email, contact);
    debug('sendEmail called');

    if(!email) {
      return res.status(404).send('ERROR');
    }

    return res.send('OK');
  } catch(err) {
    console.error(err);
    return res.status(404).send(err);
  }
};

exports.addProject = async (req, res, next) => {
  debug('addProject');

  const db = req.db;

  if(req.params.passwd !== process.env.APP_PASSWORD) {
    debug('invalid password');
    return res.send('Invalid password');
  }

  const data = req.body;
  const missingProperties = ['id', 'name', 'url', 'email']
        .reduce((arr, prop) => !data[prop] ? [...arr, prop] : arr, []);

  if(missingProperties.length > 0) {
    debug('missing properties', missingProperties.join(', '));
    return res.status(404).send(`Missing properties: ${missingProperties.join(', ')}`);
  }

  debug('data', data);

  const dbData = db.get('root')
        .find({id: data.id})
        .value();

  const saved = !!dbData
        ? await db.get('root')
        .find({id: data.id})
        .assign(data)
        .write()
        : await db.get('root')
        .push({...data, contacts: []})
        .write();

  return res.send(saved);
};
