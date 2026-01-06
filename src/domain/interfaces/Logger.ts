export interface Logger {
  info(message: string): void; //nível 1, só uma mensagem sendo passado
  warn(message: string): void; //nível 2, um alerta
  error(message: string): void; //nível3, deu ruim
}