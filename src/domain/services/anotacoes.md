Comecei com a regra pura.

if (
    !Number.isInteger(n_registros) ||
    n_registros < 1 ||
    n_registros > 10
  ) {
    throw new InvalidReportSizeError();}

