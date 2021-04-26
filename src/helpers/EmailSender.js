import nodemailer from 'nodemailer';
import console from 'console';

async function sendEmail(dataToSend) {
  const {
    text, from, to, attachments, subject, html,
  } = dataToSend;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secureConnection: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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
