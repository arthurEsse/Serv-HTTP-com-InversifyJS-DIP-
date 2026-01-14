import nodemailer from 'nodemailer';

async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethel.runolfsdottir@ethereal.email',
        pass: 'UAuSR3MVJDH9ZrQzkZ'
    }
});
  const oswaldino = "oswaldino"
  const info = await transporter.sendMail({
    from: oswaldino,
    to: 'Humberto@gessinger.com',
    subject: 'Trecho: Cifra Inifita Highway, Cifra Terra de Gigantes',
    text:  `
D
 Cento e dez
E
 Cento e vinte
F#m
 Cento e sessenta
D           E            F#m
 Só pra ver até quando   o motor agüenta
...
...

F#m                     E
       Nessa terra de gigantes
F#m                            E
        Que trocam vidas por diamantes
F#m                        A             B
        A juventude é uma banda numa propaganda de
        E     C#m  E  C#m
Refrigerantes
    </pre>
  `
  });

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
