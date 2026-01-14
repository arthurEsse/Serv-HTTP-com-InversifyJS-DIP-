//esse mandará informações para o console, será colorido
import { createLogger, format, transports } from "winston";
import { Logger } from "../../domain/interfaces/Logger";

export class WinstonLoggerDev implements Logger {
  private logger = createLogger({
    level: "info",
    //Definir o formato do Log (ele pode ser uma combinação de formatos)
    format: format.combine(
      format.colorize(),
      format.simple()
    ),

    //será exibido no console.
    transports: [new transports.Console()],
  });

  //severidade nível 1 = só informativo
  info(msg: string): void {
    this.logger.info(msg);
  }
  //severidade nível 2 = alerta
  warn(msg: string): void {
    this.logger.warn(msg);
  }
  //severidade nível 3 = error
  error(msg: string): void {
    this.logger.error(msg);
  }
}
