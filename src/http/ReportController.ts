// http/ReportController.ts
import { Router } from "express";
import { container } from "../container/container";
import { TYPES } from "../container/types";
import { ReportService } from "../domain/interfaces/ReportService";
import { InvalidReportSizeError } from "../domain/errors/InvalidReportSizeError";

const router = Router();

router.get("/relatorio/:n", async (req, res) => {
  try {
    const n = Number(req.params.n);
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).send("Parâmetro email é obrigatório");
    }

    const service = container.get<ReportService>(TYPES.ReportService);

    await service.generateAndSend(email, n);

    return res.status(200).send("Relatório enviado com sucesso");
  } catch (error) {
    if (error instanceof InvalidReportSizeError) {
      return res.status(400).send(error.message);
    }

    return res.status(500).send("Erro interno do servidor");
  }
});

export { router as ReportController };
