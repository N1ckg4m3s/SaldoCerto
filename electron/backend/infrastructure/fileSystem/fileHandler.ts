import fs from "fs";

export async function existsFile(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function copyFile(source: string, destination: string): Promise<void> {
    await fs.promises.copyFile(source, destination);
}