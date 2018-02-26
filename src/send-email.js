const debug = require('debug')('send-email');
const Email = require('email-templates');
const nodemailer = require('nodemailer');

module.exports = (gmailEmail, gmailPassword) => {
  const contactTemplate = new Email();

  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    }
  });

  debug('mailTransport created');

  return async (name, email, contact) => {
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
      await mailTransport.sendMail(mailOptions);
      debug('email sent');

      return result;
    } catch(err) {
      throw err;
    }
  };
};
