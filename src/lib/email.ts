import { createTransport } from "nodemailer";
import MailType from "nodemailer/lib/mailer";
import { IMailSend } from "../types";

class MailHelper {
  private user = "bf91fb4aa9e2a8";
  private pass = "5576995bddd0b0";
  private transporter!: MailType;

  constructor() {
    this.transporter = createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: { user: this.user, pass: this.pass },
    });
  }

  public async send(config: MailType.Options) {
    console.log(config);
    const info = await this.transporter.sendMail(config);

    return info;
  }
}

const Mail = new MailHelper();

export default Mail;
