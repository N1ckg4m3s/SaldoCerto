import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllersDir = path.join(__dirname, '..', 'backend', 'controller');

export async function iniciarTodosControladores() {
    const files = fs.readdirSync(controllersDir);

    for (const file of files) {
        if (!file.endsWith('.js')) continue; // só JS compilado
        const controllerPath = path.join(controllersDir, file);

        // Extrai o nome da função de inicialização esperado

        const moduleUrl = pathToFileURL(controllerPath).href
        const module = await import(moduleUrl);

        if (module['IniciarControladores']) {
            module['IniciarControladores'](); // chama a função
        } else {
            console.warn(`Função não encontrada em ${file}`);
        }
    }
}
