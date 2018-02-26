const debug = require('debug')('send-email');
const Email = require('email-templates');

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const contactTemplate = new Email();

module.exports = async (name, email, contact) => {
  try {
    const result = await contactTemplate.render('contact', {name, contact});
    const mailOptions = {
      from: 'Contacto <contacto@ideenegocios.com.ar>',
      to: email,
      subject: `Nuevo contacto en ${name}`,
      html: result
    };

    debug('mailOptions', mailOptions);

    debug('sending email');
    await mailgun.messages().send(mailOptions);
    debug('email sent');

    return result;
  } catch(err) {
    throw err;
  }
};
