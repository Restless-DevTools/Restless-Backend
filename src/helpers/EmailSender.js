import nodemailer from 'nodemailer';
import console from 'console';

async function sendEmail(dataToSend) {
  const {
    text, from, to, attachments, subject, html,
  } = dataToSend;

  const transport = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    secureConnection: true,
    port: 587,
    auth: {
      user: 'f0c77f40dbf917ed03e7d645259e7295',
      pass: '87fba9564c6182ff932bc635909f1ff0',
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
    text,
    attachments,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Message sent to: ${to}`);
    transport.close();
    return { message: 'E-mail was sended with success.', status: true };
  } catch (error) {
    transport.close();
    console.log(error);
    return { message: 'Something went wrong.', status: false };
  }
}

export default { sendEmail };
