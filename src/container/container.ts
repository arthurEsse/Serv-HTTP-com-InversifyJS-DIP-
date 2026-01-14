// container/container.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import { WinstonLoggerProd } from "../infra/logger/WinstonLoggerProd";
import { WinstonLoggerDev } from "../infra/logger/WinstonLoggerDev";
import { SmtpMailer } from "../infra/mailer/SmtpMailer";
import { EtherealMailer } from "../infra/mailer/EtherealMailer";
import { FakerReportDataGenerator } from "../infra/gerador_dados/FakerReportDataGenerator";
import { ReportServiceImpl } from "../domain/services/ReportServiceImpl";

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
