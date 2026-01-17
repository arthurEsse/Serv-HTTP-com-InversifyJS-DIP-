// container/container.ts
import { Container } from "inversify";
import { TYPES } from "./types.js";
import { WinstonLoggerProd } from "../infra/logger/WinstonLoggerProd.js";
import { WinstonLoggerDev } from "../infra/logger/WinstonLoggerDev.js";
import { SmtpMailer } from "../infra/mailer/SmtpMailer.js";
import { EtherealMailer } from "../infra/mailer/EtherealMailer.js";
import { FakerReportDataGenerator } from "../infra/gerador_dados/FakerReportDataGenerator.js";
import { ReportServiceImpl } from "../domain/services/ReportServiceImpl.js";


const container = new Container();

if (process.env.APP_ENV === "prod") {
  container.bind(TYPES.Logger).to(WinstonLoggerProd).inSingletonScope();
  container.bind(TYPES.Mailer).to(SmtpMailer).inSingletonScope();
} else {
  container.bind(TYPES.Logger).to(WinstonLoggerDev).inSingletonScope();
  container.bind(TYPES.Mailer).to(EtherealMailer).inSingletonScope();
}

container.bind(TYPES.ReportDataGenerator)
  .to(FakerReportDataGenerator)
  .inSingletonScope();



container.bind(TYPES.ReportService)
  .to(ReportServiceImpl);


export { container };
