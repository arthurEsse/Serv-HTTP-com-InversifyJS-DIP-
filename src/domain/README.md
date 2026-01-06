## Jesus na Causa

Começar pelo Domínio. O domínio tem de ser algo cru, não deve depender de express, winston, nodemailer...
Por que o domínio não deve depender de externos?
- Facilitar testes
- Facilitar manutenções
- Facilitar troca de tecnologia.

“O sistema deve gerar um relatório de dados fictícios, logar a operação e enviá-lo por e-mail.”
- Gerar relatório
- Logar
- Notificar


Quais são as abstrações do domínio?
- O dominío deve saber como gerar um relatório? Sim.
- O domínio deve saber como logar? Não.
- O domínio deve saber como notificar? Não.

Defina as abstrações antes das implementações: (como está no arquivo do AVA)
- Logger: Métodos info(msg), warn(msg), error(msg). [Logger](interfaces/Logger.ts) 
- Mailer: Método send(to, subject, body). [Mailer](interfaces/Mailer.ts)
- ReportService: Método generateAndSend(email, n). [ReportService](interfaces/ReportService.ts)

@faker-js/faker
O @faker-js/faker é uma biblioteca JavaScript/TypeScript usada para gerar dados falsos (mockados) de forma automática e realista, muito comum em testes, protótipos e desenvolvimento de aplicações.
npm install @faker-js/faker
import { faker } from '@faker-js/faker';
ou import { fakerPT_BR } from '@faker-js/faker';
const user = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  telefone: faker.phone.number(),
  endereco: faker.location.streetAddress(),
};