import { faker } from "@faker-js/faker";
import { ReportDataGenerator } from "../../domain/interfaces/ReportDataGenerator";
import { ReportRecord } from "../../domain/services/ReportServiceImpl"


export class FakerReportDataGenerator implements ReportDataGenerator {
  generate(n: number): ReportRecord[] {
    const records: ReportRecord[] = [];

    for (let i = 0; i < n; i++) {
      records.push({
        nome: faker.person.fullName(),
        cidade: faker.location.city()
      });
    }

    return records;
  }
}