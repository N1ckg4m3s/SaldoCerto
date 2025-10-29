import { contextBridge, ipcRenderer } from 'electron';
console.log('to aq no preload');
contextBridge.exposeInMainWorld('api', {
    cliente: {
        getList: (args) => ipcRenderer.invoke('cliente:list', args),
        getById: (args) => ipcRenderer.invoke('cliente:getById', args),
        getBySearch: (args) => ipcRenderer.invoke('cliente:getBySearch', args),
        create: (args) => ipcRenderer.invoke('cliente:create', args),
        update: (args) => ipcRenderer.invoke('cliente:update', args),
        delete: (args) => ipcRenderer.invoke('cliente:delete', args),
        getInadimplentesList: (args) => ipcRenderer.invoke('cliente:listInadimplentes', args),
        searchName: (args) => ipcRenderer.invoke('cliente:searchByName', args),
    },
    movimentacoes: {
        list: (args) => ipcRenderer.invoke('movimentacao:list', args),
        listByClient: (args) => ipcRenderer.invoke('movimentacao:listByClient', args),
        create: (args) => ipcRenderer.invoke('movimentacao:create', args),
        delete: (args) => ipcRenderer.invoke('movimentacao:delete', args),
    },
    dashboard: {
        getResumo: (args) => ipcRenderer.invoke('dashboard:getResumo', args),
        getProximasCobrancas: (args) => ipcRenderer.invoke('dashboard:getProximasCobrancas', args),
        getUltimasMovimentacoes: (args) => ipcRenderer.invoke('dashboard:getUltimasMovimentacoes', args),
    }
});
