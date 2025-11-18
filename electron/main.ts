import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';  // Importando o módulo fs para verificar a existência do arquivo
import dotenv from "dotenv";

/** .ENV SISTEM **/
const envPath = path.join(process.resourcesPath, "app.env");
dotenv.config({ path: envPath });

/** LOGS SISTEM **/
app.setAppLogsPath(); // deixa o Electron decidir onde salvar logs

const logFile = path.join(app.getPath("logs"), "main.log");

function log(...args: any[]) {
    const line = `[${new Date().toISOString()}] ${args.join(" ")}\n`;
    fs.appendFileSync(logFile, line);
}

global.console.log = (...args: any[]) => log("[LOG]", ...args);
global.console.error = (...args: any[]) => log("[ERROR]", ...args);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importando o iniciador dos controladores
const ControllerStartPath = path.join(__dirname, 'utilits', 'startControllers.js');
const ControllerStartURL = pathToFileURL(ControllerStartPath).href;

const { iniciarTodosControladores } = await import(ControllerStartURL);

let mainWindow: BrowserWindow | null = null;

const preloadPath = path.join(__dirname, 'preload.js');
const AppInterface = path.join(__dirname, '..', '..', 'dist', 'index.html')

// Função para verificar se o arquivo existe
function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);  // Verifica se o arquivo existe de forma síncrona
}

console.log("[DEBUG] __dirname:", __dirname);
console.log("[DEBUG] ControllerStartPath:", ControllerStartPath);
console.log("[DEBUG] Existe startControllers:", fs.existsSync(ControllerStartPath));

async function createWindow() {
    try {
        await iniciarTodosControladores();
        console.log("Controladores iniciados :)")
    } catch (e) {
        console.error('Erro ao iniciar controladores', e)
    }

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Saldo Certo',
        icon: path.join(__dirname, 'assets', 'IconeSaldoCerto.ico'),
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    const isDev = process.env.NODE_ENV === 'development';

    const appInterfaceExists = fileExists(AppInterface);

    if (isDev || !appInterfaceExists) {
        console.log('using Url Mode')
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(AppInterface);
    }

    mainWindow.maximize();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});