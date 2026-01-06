import { InvalidReportSizeError } from "../errors/InvalidReportSizeError";
let n_registros = 0;
if(n_registros<1 || n_registros>10 || !Number.isInteger(n_registros)){
    throw new InvalidReportSizeError();
}else{console.log("Quantidade Válida.")}