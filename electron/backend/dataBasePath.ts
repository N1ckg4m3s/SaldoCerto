import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development"

const userDataPath = app.getPath('userData');
const dbFileName = 'dev.db';
const dbPath = isDev
    ? path.resolve('prisma', dbFileName)
    : path.join(userDataPath, dbFileName);

let defaultDbPath: string;

if (!isDev) {
    defaultDbPath = path.join(process.resourcesPath, 'data', dbFileName);
} else {
    defaultDbPath = path.resolve('prisma', dbFileName);
}

if (!fs.existsSync(dbPath)) {
    if (fs.existsSync(defaultDbPath)) {
        fs.copyFileSync(defaultDbPath, dbPath);
    } else {
        console.warn(`Arquivo padrão do banco não encontrado: ${defaultDbPath}`);
    }
}


export default `file:${dbPath}`;