//Para Criar erros personalizados, utilizamos a classe built-in do JS "Error". 
export class InvalidReportSizeError extends Error {
  constructor() {
    super("O Parâmetro é inválido. Motivo provavel:\nNão foi informado um número.\nMenor que 1.\nMaior que 10.");
    this.name = "InvalidReportSizeError"; // só pra mostrar bonitinho o tipo do erro.
  }
}
