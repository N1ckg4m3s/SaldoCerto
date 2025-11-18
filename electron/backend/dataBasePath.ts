import path from 'path';
import { app } from 'electron';

const userDataPath = app.getPath('userData'); // pasta gravável pelo usuário
const dbFileName = 'dev.db'; // ou outro nome que você usar
const dbPath = path.join(userDataPath, dbFileName);

export default `file:${dbPath}`;