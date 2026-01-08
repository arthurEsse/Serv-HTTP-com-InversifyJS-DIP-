import { InvalidReportSizeError } from "../errors/InvalidReportSizeError";
import { ReportDataGenerator} from "../interfaces/ReportDataGenerator";
import { ReportRecord } from "../../types";
/*export class ReportService{
     // agora o método recebe os dados diretamente
    generateReport(n_registros: number, catalogo: ReportRecord[]): ReportRecord[] {
      this.validateReportSize(n_registros);

      // retorna apenas os primeiros n registros
      return catalogo.slice(0, n_registros);
    }

    private validateReportSize(n_registros: number): void {
      if (
        !Number.isInteger(n_registros) || // temos de garantir recebido um número
        n_registros < 1 ||
        n_registros > 10
      ) {
        throw new InvalidReportSizeError();
      }}}
        
      export const catalogo2: ReportRecord[] = [
  { nome: "Oswaldo Monte Negro", cidade: "Rio Janeiro" },
  { nome: "Videlino", cidade: "Brangaca" },
  { nome: "Cremildo", cidade: "Fortaleza" },
  { nome: "Ariano Silva", cidade: "São Paulo" },
  { nome: "Beatriz Ramos", cidade: "Belo Horizonte" },
  { nome: "Carlos Eduardo", cidade: "Curitiba" },
  { nome: "Daniela Costa", cidade: "Porto Alegre" },
  { nome: "Eduardo Lima", cidade: "Recife" },
  { nome: "Fernanda Melo", cidade: "Salvador" },
  { nome: "Gustavo Oliveira", cidade: "Manaus" },
  { nome: "Helena Duarte", cidade: "Florianópolis" }
];
const service = new ReportService();
// Exemplo : lista com 3 elementos
console.log(service.generateReport(11, catalogo2));*/
export class ReportService {
  constructor(private dataGenerator: ReportDataGenerator) {}

  generateReport(n_registros: number): ReportRecord[] {
    this.validateReportSize(n_registros);
    return this.dataGenerator.generate(n_registros);
  }

  private validateReportSize(n_registros: number): void {
    if (!Number.isInteger(n_registros) || n_registros < 1 || n_registros > 10) {
      throw new InvalidReportSizeError();
    }
  }
}
