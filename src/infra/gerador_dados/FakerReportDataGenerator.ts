import { fakerPT_PT } from "@faker-js/faker";
import { ReportDataGenerator } from "../../domain/interfaces/ReportDataGenerator";
import { ReportRecord } from "../../types"

/* Essa função cria quantas pessoas forem pedidas pra ela fornecer, porém a validação
é anterior a ela na classe ReportService, então ela não gerará mais de 10.
Primeiramente ela foi colocada antes da validação, mas e se o usuario pedisse 1.000.000
registros, sendo que só seriam exibidos 10? É gasto de processamento, por isso é melhor
ela após a validação */
export class FakerReportDataGenerator implements ReportDataGenerator {
  generate(n: number): ReportRecord[] {
    const records: ReportRecord[] = [];

    for (let i = 0; i < n; i++) {
      records.push({
        nome: fakerPT_PT.person.fullName(),
        cidade: fakerPT_PT.location.city()
      });
    }

    return records;
  }
}