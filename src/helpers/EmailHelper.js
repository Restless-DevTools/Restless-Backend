import FSHelper from './FSHelper';
import EmailSender from './EmailSender';

export default class SendEmail {
  constructor() {
    this.fsHelper = new FSHelper();
  }

  async createEmail(payload) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: payload.email,
        subject: payload.subject,
        text: payload.body,
        attachments: payload.attachments,
      };

      if (payload.html) {
        mailOptions.html = payload.body;
      }

      if (payload.attachments) {
        mailOptions.attachments = await Promise.all(payload.attachments.map(async (attach) => {
          const { path } = attach;
          const encoding = 'base64';
          const content = await this.fsHelper.readFile(path, encoding);

          return {
            content,
            encoding,
            filename: path.split('/')[1],
          };
        }));
      }

      return EmailSender.sendEmail(mailOptions);
    } catch (error) {
      return { message: 'Erro', status: false };
    }
  }
}
