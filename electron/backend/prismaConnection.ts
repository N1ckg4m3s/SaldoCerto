import pkg from "@prisma/client";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const PrismaClient: any = (pkg as any).PrismaClient ?? pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = (await import(pathToFileURL(path.join(__dirname, 'dataBasePath.js')).href)).default;

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbPath,
        },
    },
});