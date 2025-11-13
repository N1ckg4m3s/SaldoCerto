import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { salvarArquivoDeExportacao } = await import(
    pathToFileURL(path.join(__dirname, "salvarArquivoDeExportacao.js")).href
);

export const saveAsJSON = async (data: any, baseName: string): Promise<string> => {
    try {
        const exportDir = path.join(__dirname, "exports");
        if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const filePath = path.join(exportDir, `${baseName}-${dateStr}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        const destino = await salvarArquivoDeExportacao(filePath, baseName);
        return destino; // ✅ retorna o caminho final, não o temporário
    } catch (err) {
        console.error("Erro ao salvar JSON:", err);
        throw err;
    }
};