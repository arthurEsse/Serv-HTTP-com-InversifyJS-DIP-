import { Mailer } from "../../domain/interfaces/Mailer"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({ /* sua config */ })

export class NodemailerMailer implements Mailer {
  async send(to: string, subject: string, body: string): Promise<void> {
    await transporter.sendMail({
      to, subject, html: body, from: "no-reply@t6.com"
    })
  }
}
