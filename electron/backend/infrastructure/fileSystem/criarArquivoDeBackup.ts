import fs from "fs";
import path from "path";
import { promisify } from "util";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

/**
 * Cria um arquivo de backup do banco SQLite usado pelo Prisma.
 * @param backupDir Caminho da pasta onde o backup será salvo.
 * @returns Caminho completo do arquivo de backup criado.
 */
export const criarArquivoDeBackup = async (backupDir: string): Promise<string> => {
    const { existsFile, copyFile } = await import(
        pathToFileURL(path.join(__dirname, "fileHandler.js")).href
    );

    if (!backupDir) {
        throw new Error("Caminho de backup não fornecido.");
    }

    // Garante que o diretório existe
    try {
        await stat(backupDir);
    } catch {
        await mkdir(backupDir, { recursive: true });
    }

    // Pega o caminho do banco a partir do .env
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.startsWith("file:")) {
        throw new Error("DATABASE_URL inválida ou ausente no .env");
    }

    // Extrai o caminho físico do arquivo SQLite
    const dbPath = path.resolve('prisma', dbUrl.replace("file:", ""));
    if (!(await existsFile(dbPath))) {
        throw new Error(`Banco de dados não encontrado em: ${dbPath}`);
    }

    // Cria nome do arquivo de backup com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `backup-${timestamp}.db`;
    const backupPath = path.join(backupDir, backupName);

    // Copia o arquivo físico
    await copyFile(dbPath, backupPath);

    return backupPath;
}
