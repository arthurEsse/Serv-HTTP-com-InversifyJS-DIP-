/*habilitar suporte a metadata em tempo de execução no JavaScript/TypeScript,
 quase sempre que estiver usando decorators que dependem de metadata gerada por TypeScript, como:
InversifyJS com @injectable() e @inject( */
import "reflect-metadata";

//express para subir o servidor, requisões http...
import express from "express";

import { ReportController } from "./http/ReportController.js";

const app = express();

app.use(express.json());
app.use(ReportController);

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
