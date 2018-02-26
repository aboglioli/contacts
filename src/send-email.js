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

  return async (name, email, contact) => {
    const result = await contactTemplate.render('contact', {name, contact});
    const mailOptions = {
      from: 'Contacto <contacto@ideenegocios.com.ar>',
      to: email,
      subject: `Nuevo contacto en ${name}`,
      html: result
    };

    console.log('mailOptions', mailOptions);

    // await mailTransport.sendMail(mailOptions);

    return result;
  };
};
