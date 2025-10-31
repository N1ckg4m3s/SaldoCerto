import { app, BrowserWindow } from 'electron';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// importando o iniciador dos controladores
const ControllerStartPath = path.join(__dirname, 'utilits', 'startControllers.js');
const ControllerStartURL = pathToFileURL(ControllerStartPath).href;

const { iniciarTodosControladores } = await import(ControllerStartURL);

let mainWindow: BrowserWindow | null = null;

const preloadPath = path.join(__dirname, 'preload.js');

async function createWindow() {
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

    mainWindow.loadURL('http://localhost:5173');

    mainWindow.maximize();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    iniciarTodosControladores();
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
