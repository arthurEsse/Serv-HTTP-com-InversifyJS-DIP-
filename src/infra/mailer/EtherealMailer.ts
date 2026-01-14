/*O Ethereal Email é um serviço de e-mail falso (mock) usado apenas para testes.*/
import nodemailer from 'nodemailer';
import { Mailer } from "../../domain/interfaces/Mailer";

export class EtherealMailer implements Mailer {
  async send(to: string, subject: string, body: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Relatórios" <no-reply@test.com>',
      to,
      subject,
      html: body,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}
