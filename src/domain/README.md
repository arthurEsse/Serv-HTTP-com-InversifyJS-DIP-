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

Próxima passo foi trabalhar a lógica pura de gerar dez relatório. Não houve grandes problemas.
Comecei com a regra pura.

if (
    !Number.isInteger(n_registros) ||
    n_registros < 1 ||
    n_registros > 10
  ) {
    console.log("ERRO");}
Após isso, foi definir uma classe error, utilizando a built-in Error do JS. Fez-se[InvalidReportSizeError](errors/InvalidReportSizeError.ts)
Assim, console.log("ERRO"); foi substituido por InvalidReportSizeError. "console.log" Não permite tratamento adequado no HTTP.
if (
    !Number.isInteger(n_registros) || // temos de garantir recebido um número
    n_registros < 1 ||
    n_registros > 10
  ) {
    throw new InvalidReportSizeError();
  }
Ok, pronto a parte de verificar a quantidade de relatório. Agora com os olhos voltados para gerar relatório. Encapsulamos a lógica de testar n_registro em uma classe criada com nome ReportService.
class ReportService{
    private validateReportSize(n_registros: number): void {
      if (
        !Number.isInteger(n_registros) || // temos de garantir recebido um número
        n_registros < 1 ||
        n_registros > 10
      ) {
        throw new InvalidReportSizeError();
      }}}

E adicionamos o método generateReport - gerar relatório- à essa classe.
class ReportService{
    generateReport():{}
    private validateReportSize(n_registros: number): void {
      if (
        !Number.isInteger(n_registros) || // temos de garantir recebido um número
        n_registros < 1 ||
        n_registros > 10
      ) {
        throw new InvalidReportSizeError();
      }}}
o Metódo relatório deve me delover uma lista com n_registros, a lista é composta por nome e cidade, para isso é criado um type ReportRecord. O método e a classe adquire o formato:
class ReportService{
    generateReport(n_registros: number, catalogo: ReportRecord[]): ReportRecord[] {
        this.validateReportSize(n_registros);
        // retorna apenas os primeiros n registros ISSO É MUITO IMPORTANTE (PODERIA HAVER EMBARALHAMENTO, RANDOMIZAÇÃO, mas por facilitação não será abortado. O Faker já fará dados aleatórios)
      return catalogo.slice(0, n_registros);
    }
    private validateReportSize(n_registros: number): void {
      if (
        !Number.isInteger(n_registros) || 
        n_registros < 1 ||
        n_registros > 10
      ) {
        throw new InvalidReportSizeError();
      }}}

      
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