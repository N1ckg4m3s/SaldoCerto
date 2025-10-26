import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    cliente: {
        // getClientes: (args?:any) => ipcRenderer.invoke('get-clientes',args),
    },
    movimentacoes: {
        // getClientes: (args?:any) => ipcRenderer.invoke('get-clientes',args),
    },
    dashboard: {
        // getClientes: (args?:any) => ipcRenderer.invoke('get-clientes',args),
    }
});
