export interface Mailer {
  send( to: string, //para quem
        subject: string, // assunto
        body: string): // corpo do e-mail
    Promise<void>;
}
