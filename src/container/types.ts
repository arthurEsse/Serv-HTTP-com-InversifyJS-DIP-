export type ReportRecord = {
  nome: string;
  cidade: string;
};

//Types do Inversify
export const TYPES = {
  Logger: Symbol.for("Logger"),
  Mailer: Symbol.for("Mailer"),
  ReportService: Symbol.for("ReportService"),
  ReportDataGenerator: Symbol.for("ReportDataGenerator"),
};