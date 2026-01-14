202426610050 - ARTHUR ESSE BORGES XAVIER DE LIMA E MELO
202426610030 - GABRIEL ZARDINI DOURADO CUNHA

Implementar um serviço HTTP em Node.js + TypeScript utilizando InversifyJS para aplicar Inversão de Dependência (DIP) e Inversão de Controle (IoC).

O sistema gera um relatório fictício, registra logs e envia o relatório por e-mail, variando o comportamento conforme o ambiente (dev ou prod).

O projeto é organizado em camadas:

domain/   → regras de negócio e abstrações
infra/    → implementações técnicas (logger, mailer, IoC)
http/     → adapter HTTP (Express)