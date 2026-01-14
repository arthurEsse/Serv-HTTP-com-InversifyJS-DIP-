import { Logger } from "../../domain/interfaces/Logger"
import winston from "winston"

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

export class WinstonLogger implements Logger {
  info(msg: string) { logger.info(msg) }
  warn(msg: string) { logger.warn(msg) }
  error(msg: string) { logger.error(msg) }
}