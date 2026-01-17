import { InvalidReportSizeError } from "../errors/InvalidReportSizeError.js"
import { ReportDataGenerator } from "../interfaces/ReportDataGenerator.js";
import { Logger } from "../interfaces/Logger.js";
import { Mailer} from "../interfaces/Mailer.js"
import { ReportService } from "../interfaces/ReportService.js";
import { injectable, inject } from "inversify";
import { TYPES } from "../../container/types.js";

@injectable()
export class ReportServiceImpl implements ReportService {

  constructor(
    @inject(TYPES.ReportDataGenerator)
    private dataGenerator: ReportDataGenerator,

    @inject(TYPES.Logger)
    private logger: Logger,

    @inject(TYPES.Mailer)
    private mailer: Mailer
  ) {}

  async generateAndSend(email: string, n_registros: number): Promise<void> {
  try {
    this.validateReportSize(n_registros);
    this.logger.info(`Iniciando geração de relatório para ${n_registros} registros`);

    const report = this.dataGenerator.generate(n_registros);

    const body = report.map(r => `Nome: ${r.nome} - Cidade: ${r.cidade}`).join("<br>");

    this.logger.info(`Enviando relatório para ${email}`);
    await this.mailer.send(email, "Relatório de Dados", body);
    this.logger.info(`Relatório enviado com sucesso para ${email}`);

  } catch (err: any) {
    if (err instanceof InvalidReportSizeError) {
      this.logger.warn(`Tentativa de gerar relatório inválido: ${n_registros}`);
    } else {
      this.logger.error(`Falha ao gerar/enviar relatório: ${err.message}`);
    }
    throw err; // relança para o controller tratar a resposta HTTP
  }
}

  private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      this.logger.warn(`Tentativa de gerar relatório inválido: ${n_registros}`);
      throw new InvalidReportSizeError();
    }
  }
}