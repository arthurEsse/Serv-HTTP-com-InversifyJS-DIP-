# Trabalhos – Aplicação Node.js + TypeScript

## Alunos
- **202426610050** – Arthur Esse Borges Xavier de Lima e Melo  
- **202426610030** – Gabriel Zardini Dourado Cunha

---

## TRABALHO 6

**Objetivo:**  
Implementar um serviço HTTP em **Node.js + TypeScript** utilizando **InversifyJS** para aplicar *Inversão de Dependência* (DIP) e *Inversão de Controle* (IoC).

O sistema deve:

- Gerar um relatório fictício.
- Registrar logs.
- Enviar o relatório por e-mail.
- Variar o comportamento conforme o ambiente (*dev* ou *prod*).

### Organização do Projeto
- domain/ → Regras de negócio e abstrações
- infra/ → Implementações técnicas (logger, mailer, IoC)
- http/ → Adapter HTTP (Express)


---

## TRABALHO 7 e TRABALHO 8

**Objetivo:**  
Implementar testes para o domínio e para a camada HTTP (*controller*), utilizando a biblioteca **vitest**.

---

### Testes – `ReportServiceImpl`

O serviço **ReportServiceImpl** deve possuir **3 testes**:

1. Inserir uma quantidade de relatório negativa.
2. Inserir uma quantidade de relatório acima de 10.
3. Inserir um e-mail válido e uma quantidade entre 0 e 10.

**Executar:**
npm run test:report


---

### Testes – `ReportController` (HTTP)

O *controller* deve possuir **2 testes**:

1. Resposta **400** quando o campo `email` estiver ausente.
2. Resposta **500** simulando um erro de conexão.

**Executar:**
npm run test:http


