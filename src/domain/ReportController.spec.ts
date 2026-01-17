// src/http/ReportController.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportService } from "./interfaces/ReportService.js";
import { InvalidReportSizeError } from "./errors/InvalidReportSizeError.js";

// Mock do ReportService
const ReportServiceMock: ReportService = {
  generateAndSend: vi.fn() as unknown as (email: string, n: number) => Promise<void>,
  /*"as unknown as" = Typescrip, confia em mim que estou te passando string e number.
  é só para o TypeScript não reclamar sobre tipos. */
};

/* Função que simula o controller, pois devemos testar sem subir o servidor,
sem usar o express*/
const reportControllerHandler = async (req: any, res: any) => {
  try {
    const n = Number(req.params.batatinha);// ".n" e ".email" tal como foi escrito na rota real
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).send("Parâmetro email é obrigatório");
    }

    await ReportServiceMock.generateAndSend(email, n);

    return res.status(200).send("Relatório enviado com sucesso");
  } catch (error: any) {
    if (error instanceof InvalidReportSizeError) {
      return res.status(400).send(error.message);
    }
    return res.status(500).send("Erro interno do servidor");
  }
};

describe("Testes Unitários da Camada HTTP - sem Express", () => {
  beforeEach(() => {
    /* Reseta o mock antes de cada teste
    lembra que cada "it" é um teste? Então, resetamos o mock para não levar sujeira
    de um um teste para outro*/
    vi.clearAllMocks();
  });

  /* Agora é a escrita dos testes, os "it's" que serão 3 aqui. */
  it("deve retornar 400 se o email não for informado", async () => {
    const req = { params: { n: "5" }, query: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await reportControllerHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Parâmetro email é obrigatório");
  });

  it("deve retornar 500 se o serviço lançar um erro genérico", async () => {
    (ReportServiceMock.generateAndSend as unknown as any).mockImplementation(() => {
      throw new Error("Database down");
    });

    const req = { params: { n: "5" }, query: { email: "teste@email.com" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await reportControllerHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Erro interno do servidor");
  });
});
