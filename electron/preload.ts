import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    cliente: {
        getList: (args?: any) => ipcRenderer.invoke('cliente:list', args),
        getById: (args?: any) => ipcRenderer.invoke('cliente:getById', args),
        create: (args?: any) => ipcRenderer.invoke('cliente:create', args),
        update: (args?: any) => ipcRenderer.invoke('cliente:update', args),
        delete: (args?: any) => ipcRenderer.invoke('cliente:delete', args),
        getInadimplentesList: (args?: any) => ipcRenderer.invoke('cliente:listInadimplentes', args),
    },
    movimentacoes: {
        list: (args?: any) => ipcRenderer.invoke('movimentacao:list', args),
        create: (args?: any) => ipcRenderer.invoke('movimentacao:create', args),
        delete: (args?: any) => ipcRenderer.invoke('movimentacao:delete', args),
    },
    dashboard: {
        getResumo: (args?: any) => ipcRenderer.invoke('dashboard:getResumo', args),
        getProximasCobrancas: (args?: any) => ipcRenderer.invoke('dashboard:getProximasCobrancas', args),
        getUltimasMovimentacoes: (args?: any) => ipcRenderer.invoke('dashboard:getUltimasMovimentacoes', args),
    }
});
