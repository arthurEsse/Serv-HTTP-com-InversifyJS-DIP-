/*Essa função não faz parte do projeto, tem apenas por finalidade extrair o nome
dos arquivos e seus testos, quando necessário. Pode ser útil para montar documentação */
import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(__dirname, "../src"); // raiz do projeto
const OUTPUT_FILE = path.resolve(__dirname, "../all-files.txt");

function exportTsFiles(dir: string, collected: string[] = []): string[] {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    // Ignora node_modules
    if (entry === "node_modules") continue;

    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      exportTsFiles(fullPath, collected);
    } else if (stat.isFile() && entry.endsWith(".ts")) {
      collected.push(fullPath);
    }
  }

  return collected;
}

function generateSingleFile(): void {
  const files = exportTsFiles(ROOT_DIR);

  let output = "";

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const relativePath = path.relative(ROOT_DIR, filePath);

    output +=
      `\n\n// ===== Arquivo: ${relativePath} =====\n\n` +
      content;
  }

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log("✅ Arquivos .ts exportados (node_modules ignorado)");
}

generateSingleFile();
