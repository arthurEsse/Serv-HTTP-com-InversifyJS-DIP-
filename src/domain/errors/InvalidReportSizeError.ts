//Para Criar erros personalizados, utilizamos a classe built-in do JS "Error". 
export class InvalidReportSizeError extends Error {
  constructor() {
    super("O Parâmetro é inválido. Pode ser por:\nNão foi informado um número.\nMenor que 1.\nMaior que 10.");
  }
}
