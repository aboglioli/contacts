const moment = require('moment');

const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

const sendEmail = require('./send-email')(gmailEmail, gmailPassword);
const {formatContact} = require('./utils');

module.exports = (db) => ({
  async getContact(req, res, next) {
    if(req.params.passwd !== process.env.APP_PASSWORD) {
      return res.send('Invalid password');
    }
    return res.send(db.get('root').value());
  },
  async addContact(req, res, next) {
    const contactId = req.params.contactId;
    let contact = req.body;
    contact.fecha = contact.fecha || moment().format('DD/MM/YYYY HH:mm:ss');
    contact = formatContact(contact);

    const dbData = db.get('root').find({id}).value();

    if(!dbData) {
      return res.send('ID does not exist');
    }

    const data =  await db.get('root')
        .find({id})
        .assign({contacts: [...dbData.contacts, contact]})
        .write();

    try {
      const email = await sendEmail(data.name, data.email, contact);

      if(!email) {
        return res.status(404).send('ERROR');
      }

      return res.send('OK');
    } catch(err) {
      return res.status(404).send(err);
    }
  },
  async addProject(req, res, next) {
    if(req.params.passwd !== process.env.APP_PASSWORD) {
      return res.send('Invalid password');
    }

    const data = req.body;
    const missingProperties = ['id', 'name', 'url', 'email']
          .reduce((arr, prop) => !data[prop] ? [...arr, prop] : arr, []);

    if(missingProperties.length > 0) {
      return res.status(404).send(`Missing properties: ${missingProperties.join(', ')}`);
    }

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
  }
});
