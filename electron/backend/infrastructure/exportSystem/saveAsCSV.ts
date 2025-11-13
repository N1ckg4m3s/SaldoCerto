import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { salvarArquivoDeExportacao } = await import(
    pathToFileURL(path.join(__dirname, "salvarArquivoDeExportacao.js")).href
);

export const saveAsCSV = async (
    rows: any[],
    baseName: string
): Promise<{ filePath: string; total: number }> => {
    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const filePath = path.join(exportDir, `${baseName}-${dateStr}.csv`);
    
    if (!rows.length) {
        fs.writeFileSync(filePath, "\uFEFF", "utf8"); // cria arquivo vazio com BOM
        return { filePath, total: 0 };
    }

    const headers = Object.keys(rows[0]);

    const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "object") value = JSON.stringify(value);
        value = String(value).replace(/"/g, '""'); // duplica aspas
        // se contém ; ou quebra de linha, envolve entre aspas
        if (/[;\n"]/.test(value)) return `"${value}"`;
        return value;
    };

    const csvLines = [
        headers.join(";"),
        ...rows.map(row => headers.map(h => escapeCSV(row[h])).join(";")),
    ];

    // adiciona BOM UTF-8 para compatibilidade com Excel
    fs.writeFileSync(filePath, "\uFEFF" + csvLines.join("\n"), "utf8");

    // salva cópia final (ex: em Downloads)
    const destino = await salvarArquivoDeExportacao(filePath, baseName);
    return { filePath: destino, total: rows.length };
};