import "reflect-metadata";
import express from "express";
import { ReportController } from "./http/ReportController";

const app = express();

app.use(express.json());
app.use(ReportController);

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
