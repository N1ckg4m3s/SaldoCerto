import fs from "fs";
import path from "path";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

/**
 * Cria um arquivo de backup do banco SQLite usado pelo Prisma.
 * @param backupDir Caminho da pasta onde o backup será salvo.
 * @returns Caminho completo do arquivo de backup criado.
 */
export async function criarArquivoDeBackup(backupDir: string): Promise<string> {
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
    if (!fs.existsSync(dbPath)) {
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
