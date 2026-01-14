export interface Mailer {
  send( to: string, //para quem
        subject: string, // assunto
        body: string):void // corpo do e-mail
    //Promise<void>;
}
