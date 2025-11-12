import fs from "fs";
import path from "path";
import os from "os";
import { shell } from "electron";

export const salvarArquivoDeExportacao = async (filePath: string, baseName: string): Promise<string> => {
    const downloadsPath = path.join(os.homedir(), "Downloads");
    if (!fs.existsSync(downloadsPath)) {
        fs.mkdirSync(downloadsPath, { recursive: true });
    }

    const newFilePath = path.join(downloadsPath, path.basename(filePath));
    await fs.promises.copyFile(filePath, newFilePath);

    // Abre o arquivo no Explorer (seleciona ele)
    shell.showItemInFolder(newFilePath);

    return newFilePath;
};
