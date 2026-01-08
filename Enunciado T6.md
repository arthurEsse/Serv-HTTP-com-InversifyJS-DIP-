Implementar um serviço HTTP em Node.js + TypeScript utilizando InversifyJS para praticar Inversão de Dependência (DIP) e Inversão de Controle (IoC).

O sistema deve gerar um relatório de dados fictícios, logar a operação e enviá-lo por e-mail, alternando comportamentos baseados no ambiente (dev ou prod).
Entrega pelo GIT.

Trabalho em dupla. Coloque os RGAs na caixa de texto quando forem enviar o link do repositório git. Verifique que o repositório não esteja privado, caso contrário não consigo avaliar.

Clique e veja os detalhes do trabalho.

---------------------


Trabalho: Serviço HTTP com InversifyJS (DIP)

Objetivo

Implementar um serviço HTTP em Node.js + TypeScript utilizando InversifyJS para praticar Inversão de Dependência (DIP) e Inversão de Controle (IoC).

O sistema deve gerar um relatório de dados fictícios, logar a operação e enviá-lo por e-mail, alternando comportamentos baseados no ambiente (dev ou prod).
1. Requisitos de Ambiente

O sistema deve ler as seguintes variáveis de ambiente (use dotenv):

    APP_ENV: Define o comportamento da infraestrutura (dev ou prod).
    APP_PORT: Porta do servidor HTTP.
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS: Configurações para envio de e-mail.


2. Camada de Domínio

Esta camada não deve depender de bibliotecas de infraestrutura (Express, Nodemailer, Winston).
Interfaces

Defina as abstrações antes das implementações:

    Logger: Métodos info(msg), warn(msg), error(msg).
    Mailer: Método send(to, subject, body).
    ReportService: Método generateAndSend(email, n).

Regras de Negócio (ReportService)

A implementação do serviço deve:

    Validar o número n de registros (Máximo: 10). Se inválido, lançar InvalidReportSizeError.
    Gerar n registros fictícios (Nome e Cidade) usando @faker-js/faker.
    Logar o início da operação.
    Enviar o relatório por e-mail.
    Logar o sucesso da operação.


3. Camada de Infraestrutura

Implemente as interfaces usando bibliotecas reais. Registre-as no container do Inversify.
Logger (Singleton)

    Biblioteca: Winston.
    Comportamento dev: Log no Console (Colorido).
    Comportamento prod: Log em Arquivo (app.log).

Mailer (Singleton)

    Biblioteca: Nodemailer.
    Comportamento dev: Usar Ethereal Email (gerar link de visualização).
    Comportamento prod: Usar Gmail (ou outro SMTP real, como sendgrid).

Configuração do Container (IoC)

No arquivo de configuração do Inversify (container.ts):

    Faça o bind das interfaces (TYPES.Logger, TYPES.Mailer) para suas respectivas implementações.
    Utilize escopo Singleton para Logger e Mailer.
    Utilize a variável APP_ENV para decidir qual configuração ou implementação será injetada.


4. Camada HTTP (Adapter)

Crie um Adapter ou Controller que utilize o express.
Rota

GET /relatorio/:n?email=destino@email.com
Comportamento

    Receber n (rota) e email (query).
    Resolver o ReportService através do container.
    Executar o método.

Tratamento de Respostas

    200 OK: Relatório enviado com sucesso.
    400 Bad Request: Se email faltar ou se o domínio lançar InvalidReportSizeError.
    500 Internal Server Error: Erros genéricos (falha no envio de e-mail, erro de logger, etc).


5. Execução (Bootstrap)

No arquivo principal (main.ts):

    Inicializar o container.
    Resolver o Adapter HTTP.
    Iniciar o servidor Express na porta definida em APP_PORT.

Critérios de Aceite

    Código organizado em camadas (domain, infra, http).
    Uso correto dos decorators @injectable e @inject.
    O ReportService não deve ter import de express, winston ou nodemailer.
    A aplicação deve rodar corretamente trocando apenas o APP_ENV no .env.