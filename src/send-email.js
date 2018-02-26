const path = require('path');

// email templates
const Email = require('email-templates');

// mailer
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

  return (name, email, contact) => {
    return contactTemplate.render('contact', {name, contact})
      .then((result) => ({
          from: 'Contacto <contacto@ideenegocios.com.ar>',
          to: email,
          subject: `Nuevo contacto en ${name}`,
          html: result.html
        }))
      .then((mailOptions => mailTransport.sendMail(mailOptions)))
      .catch(console.error);
  };
};
