# Jesus na Causa – Domínio e Implementação

## 1. Começando pelo Domínio

O **domínio deve ser independente de bibliotecas externas** como `express`, `winston` ou `nodemailer`.  

**Por quê?**  
- Facilita testes  
- Facilita manutenção  
- Facilita troca de tecnologia  

**Exemplo de requisito:**  
> “O sistema deve gerar um relatório de dados fictícios, logar a operação e enviá-lo por e-mail.”

**Responsabilidades do domínio:**  
- ✅ Gerar relatório  
- ❌ Logar  
- ❌ Notificar  

---

## 2. Definindo abstrações antes das implementações

Antes de criar implementações concretas, definimos **interfaces para dependências externas**:  

| Interface | Método | Observação |
|-----------|--------|------------|
| `Logger` | `info(msg)`, `warn(msg)`, `error(msg)` | Para logar mensagens |
| `Mailer` | `send(to, subject, body)` | Para enviar e-mails |
| `ReportService` | `generateAndSend(email, n)` | Para gerar e enviar relatórios |

> Veja [Logger](interfaces/Logger.ts), [Mailer](interfaces/Mailer.ts), [ReportService](interfaces/ReportService.ts)

---

## 3. Regra de negócio pura: gerar relatório

### 3.1 Validando número de registros
Foi criado uma regra pura
```ts
if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
  console.log("ERRO");
}
```
O `console.log("ERRO")` **não é adequado para tratamento em HTTP**.  

Criamos então um erro personalizado:

```ts
// errors/InvalidReportSizeError.ts
export class InvalidReportSizeError extends Error {
  constructor() {
    super("Número de registros inválido (deve ser entre 1 e 10)");
    this.name = "InvalidReportSizeError";
  }
}
```
Assim a validação ficou:
```ts
if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
  throw new InvalidReportSizeError();
}
```

### 3.2 Classe ReportService

Os registros de relatórios adotados foram simples, nome e cidade. Para isso, foi criado um type.
```ts
type ReportRecord = {
  nome: string;
  cidade: string;
};
```
A validação simples, anteriormente citada, foi então encapsulada em um método privado em uma classe para serviços de relatório, ReportService, essa função recebeu o nome de validadeReportSize. A essa classe também foi adicionada um novo metódo, o de gerar relatório, generateReport:
```ts
class ReportService {
  generateReport(n_registros: number, catalogo: ReportRecord[]): ReportRecord[] {
    this.validateReportSize(n_registros);
    // Retorna apenas os primeiros n registros
    return catalogo.slice(0, n_registros);
  }

  private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
```
Essa classe funciona: ela valida o número de registros e gera um relatório a partir de uma lista de ReportRecord. Para simplificar o uso e permitir testes mais realistas, o método generateReport será aprimorado para preencher os registros automaticamente por meio de um gerador de dados fictícios, eliminando a necessidade de fornecer manualmente cada entrada. Para isso, estabelecemos a interface [ReportDataGenerator](interfaces/ReportDataGenerator.ts).
A Interface:
**Permite flexibilidade e extensibilidade (Open/Closed Principle – OCP):**  
   - Podemos criar diferentes geradores de dados (por exemplo, usando `@faker-js/faker` ou dados fixos para testes) sem alterar a `ReportService`.  
   - A `ReportService` está “aberta para extensão, mas fechada para modificação”. 

A classe então toma forma:
```ts
export class ReportService {
  constructor(private dataGenerator: ReportDataGenerator) {}
  generateReport(n_registros: number): ReportRecord[] {
    this.validateReportSize(n_registros);
    // Retorna apenas os primeiros n registros
    return this.dataGenerator.generate(n_registros);
  }

  private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
```

Até esse momento, a classe cumpre o papel de gerar um relatório. Então desenvolvemos quem forneça dos dados, poderia ser um banco de dados, mas será utilizado a biblioteca "faker"

É costume que o banco de dados de dados fique na repartição de infraestrutura. O nosso "banco de dados", no caso o gerador de dados, fica desenvolvido em infra.Ver [FakerReportDataGenerator](../infra/gerador_dados/FakerReportDataGenerator.ts)

Para testar a classe, fazendo o uso do "Banco de Dados", utilizou-se o código em main.ts:
```ts
import { FakerReportDataGenerator } from "./infrastructure/faker/FakerReportDataGenerator";
import { ReportService } from "./domain/services/ReportService";

const generator = new FakerReportDataGenerator();
const service = new ReportService(generator);
const relatório = service.generateReport(3);
console.log(relatório);

/* SAIDA:
[
  { nome: 'Matias Costa', cidade: 'Freamunde' },
  { nome: 'Carolina Batista', cidade: 'Fiães' },
  { nome: 'Letícia Henriques', cidade: 'Viseu' }
]*/
```


Vamos para outra função que a classe deve contribuir, a de Logger.
Vamos injetar o Logger na classe. -> injetar =fornecer uma dependência para um objeto, em vez de o próprio objeto criar ou procurar essa dependência sozinho. Exemplificar a injeção ajuda melhor a compreendê-la:

1️⃣ Comparando “criar dentro” vs “injetar”

Sem injeção (cria dentro):

```ts
class ReportService {
  private logger = new ConsoleLogger(); // aqui ele cria sozinho
  metodoQualquer() {
    this.logger.info("Fazendo algo...");
  }
}
```
Problema: O ReportService depende diretamente de ConsoleLogger. Se quiser trocar o Logger por outro (por exemplo Winston ou um Logger falso para testes), terá que mexer dentro da classe.

Com injeção (injectar):
```ts
class ReportService {
  constructor(private logger: Logger) {} // aqui o Logger é fornecido de fora

  doSomething() {
    this.logger.info("Fazendo algo...");
  }
}
```
// Em algum outro lugar, é criado o serviço e fornecemos o logger
```ts
const logger = new ConsoleLogger();
const service = new ReportService(logger)
```
Nossa classe é atualizada então para:
```ts
export class ReportService {
  constructor(private dataGenerator: ReportDataGenerator,
              private logger: Logger
  ) {}
  generateReport(n_registros: number): ReportRecord[] {
    this.logger.info(`Gerando relatório para ${n_registros} registros`);
    const report = this.dataGenerator.generate(n_registros); // antes estava no return,
    this.logger.info(`Relatório gerado com sucesso`);
    return report;
    
  }

  private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
```
Utilizamos o código no main.ts para testar agora o service+logger+gerador
```ts
import { Logger } from "./domain/interfaces/Logger";
import { FakerReportDataGenerator } from "./infra/gerador_dados/FakerReportDataGenerator";
import { ReportService } from "./domain/services/ReportServiceImpl";

class ConsoleLogger implements Logger {
  info(msg: string) { console.log("INFO:", msg); }
  warn(msg: string) { console.log("WARN:", msg); }
  error(msg: string) { console.log("ERROR:", msg); }
}

const generator = new FakerReportDataGenerator();
const logger = new ConsoleLogger();

const service = new ReportService(generator, logger);

const relatório = service.generateReport(3);
console.log(relatório);
/*
INFO: Gerando relatório para 3 registros
INFO: Relatório gerado com sucesso
[
  { nome: 'Melissa Reis', cidade: 'Santa Cruz' },
  { nome: 'Roberto Ribeiro', cidade: 'São João da Madeira' },
  { nome: 'Francisca Paiva', cidade: 'Vila Nova de Gaia' }
]*/
```
A Classe ReportService cumpre 2 de 3 requisitos, o de gerar gelatório, o de logger, mas ainda faltando o Mailer. O método que antes era só de gerar o relatório, agora tbm enviará.
```ts
export class ReportService {
  constructor(private dataGenerator: ReportDataGenerator,
              private logger: Logger,
              private mailer: Mailer
  ) {}

  generateAndSend(email: string, n_registros: number): void {
  this.validateReportSize(n_registros);
  this.logger.info(`Iniciando geração de relatório para ${n_registros} registros`);
  const report = this.dataGenerator.generate(n_registros);
  const body = report.map(r => `Nome: ${r.nome} - Cidade: ${r.cidade}`).join(";");
  this.logger.info(`Enviando relatório para ${email}`);
  this.mailer.send(email, "Relatório de Dados", body);
  this.logger.info(`Relatório enviado com sucesso para ${email}`);
}
    private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
```
Explicando um pouco o trecho:
```ts
 const body = report.map(r => `Nome: ${r.nome} - Cidade: ${r.cidade}`).join(";");
```
- report é um array de ReportRecord.
- O método .map() percorre cada elemento do array e retorna um novo array.
- Para cada registro r, ele cria uma string no formato: "Nome: Alice - Cidade: Lisboa"
- .join(";") concatena com todo o novo array com o separador ";".

De forma similar, injetamos o Mailer na Classe RportService:
```ts
export class ReportService {
  constructor(private dataGenerator: ReportDataGenerator,
              private logger: Logger,
              private mailer: Mailer
  ) {}

  generateAndSend(email: string, n_registros: number): void {
  this.validateReportSize(n_registros);
  this.logger.info(`Iniciando geração de relatório para ${n_registros} registros`);
  const report = this.dataGenerator.generate(n_registros);
  const body = report
    .map(r => `Nome: ${r.nome} - Cidade: ${r.cidade}`)
    .join("<br>");
  this.logger.info(`Enviando relatório para ${email}`);
  this.mailer.send(email, "Relatório de Dados", body);
  this.logger.info(`Relatório enviado com sucesso para ${email}`);
}
    private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
```
Até aqui, a classe ReportService já cumpre completamente sua responsabilidade de regra de negócio:
- valida o tamanho do relatório
- gera os dados
- registra logs
- envia o e-mail
No entanto, ainda existe um detalhe importante: quem decide quais implementações concretas serão usadas?

Atualmente, isso ainda é feito na mão:
```ts
const generator = new FakerReportDataGenerator();
const logger = new ConsoleLogger();
const mailer = new Falso_SendMailer();

const service = new ReportService(generator, logger, mailer);
```

Foi feita a Inversão de Dependência (DIP), juntamente com a Inversão de Controle (IoC). Nesse ponto, os termos se misturaram (para mim). E acho que aqui vale mais uma pausa.
Já estava confundindo DIP e IoC, achando que um era o D e o outro I de S.O.L.I.D. Mas não, eles são coisas distintas.

## SOLID
- **D → DIP (Dependency Inversion Principle) um dos princípios de fato do SOLID**
  - Módulos de alto nível não devem depender de módulos de baixo nível.
  - Ambos devem depender de abstrações.

## Arquitetura
- **IoC (Inversion of Control) - é um princípio arquitetural**
  - A classe não controla a criação nem o ciclo de vida de suas dependências;
    isso é delegado para algo externo.

## Técnica
- **DI (Dependency Injection) - é umas das técnicas de como aplicar IoC**
  - Técnica usada para fornecer dependências a uma classe
    (ex: via construtor).

## Ferramenta
- **InversifyJS**
  - Biblioteca que implementa injeção de dependência para aplicar IoC,
    facilitando o cumprimento do DIP.



A classe ReportService já aplica Inversão de Controle ao receber todas as suas dependências via construtor.
No entanto, a criação dessas dependências ainda é feita manualmente, espalhando decisões pelo código.
O InversifyJS entra como um facilitador, centralizando a configuração e automatizando a resolução das dependências.
O verdadeiro “pulo do gato” é que, com ele, podemos trocar implementações (por exemplo, Logger, Mailer ou ReportDataGenerator) de forma transparente, sem alterar a classe de domínio nem o código que a consome, respeitando o princípio Open/Closed e mantendo o domínio totalmente independente de detalhes de infraestrutura.


Para que o InversifyJS consiga “entender” quais dependências entregar a cada classe, precisamos de identificadores que existam em tempo de execução.
Em TypeScript, interfaces não existem depois da compilação, então não podemos usá-las diretamente.

A solução é criar símbolos (Symbol) únicos para cada abstração que queremos injetar. Ver: [TYPES](../container/types.ts)

