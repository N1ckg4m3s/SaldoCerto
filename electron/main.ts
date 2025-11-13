import { app, BrowserWindow } from 'electron';
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

    /* FAST - TESTS */
    const { exportService } = await import(pathToFileURL(path.join(__dirname, 'backend', 'services', 'exportService.js')).href)

    /* Gera um PDF com as informações do cliente e suas movimentações */
    exportService.exportarDados({
        urlDataOrigin: '/cliente/getInformationsById',
        necessaryPageData: { id: 'cmhqf3cyj0003vv04cy80g77p' },
        filters: {},
        onlyCurrentPage: true,
        tipo: 'pdf',
    })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
