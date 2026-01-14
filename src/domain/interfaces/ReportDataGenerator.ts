import { ReportRecord } from "../../container/types";

//Qualquer coisa que saiba gerar dados de relatório precisa ter esse método, seja por faker, banco de dados...
export interface ReportDataGenerator {
  generate(n: number): ReportRecord[];
}

// um método generate que recebe uma quantidade e devolve uma lista de ReportRecords