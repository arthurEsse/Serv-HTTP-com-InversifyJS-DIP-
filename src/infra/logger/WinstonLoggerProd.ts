//esse mandará as informações para um arquivo "app.log"

/*O Winston é um pacote para Node.Js muito útil para fazer logs de aplicações. Aqui será usado para fazer log de texto, mas ele pode ser também usando com banco de dados, ou logs para nuvem */
import { createLogger, format, transports } from "winston";
import { Logger } from "../../domain/interfaces/Logger";

export class WinstonLoggerProd implements Logger {
  private logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.File({ filename: "app.log" })
    ],
  });

  info(msg: string): void {
    this.logger.info(msg);
  }

  warn(msg: string): void {
    this.logger.warn(msg);
  }

  error(msg: string): void {
    this.logger.error(msg);
  }
}
