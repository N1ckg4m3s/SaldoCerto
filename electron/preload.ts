import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    cliente: {
        getList: (args?: any) => ipcRenderer.invoke('cliente:list', args),
        getById: (args?: any) => ipcRenderer.invoke('cliente:getById', args),
        getInformationsById: (args?: any) => ipcRenderer.invoke('cliente:getInformationsById', args),
        create: (args?: any) => ipcRenderer.invoke('cliente:create', args),
        update: (args?: any) => ipcRenderer.invoke('cliente:update', args),
        delete: (args?: any) => ipcRenderer.invoke('cliente:delete', args),
        searchName: (args?: any) => ipcRenderer.invoke('cliente:searchByName', args),
    },
    movimentacoes: {
        list: (args?: any) => ipcRenderer.invoke('movimentacao:list', args),
        listByClient: (args?: any) => ipcRenderer.invoke('movimentacao:listByClient', args),
        create: (args?: any) => ipcRenderer.invoke('movimentacao:create', args),
        delete: (args?: any) => ipcRenderer.invoke('movimentacao:delete', args),
        getInadimplentesList: (args?: any) => ipcRenderer.invoke('movimentacao:listInadimplentes', args),
    },
    dashboard: {
        getResumo: (args?: any) => ipcRenderer.invoke('dashboard:getResumo', args),
        getTableResumo: (args?: any) => ipcRenderer.invoke('dashboard:getTableResume', args),
    },
    backup: {
        get: () => ipcRenderer.invoke('config:get'),
        set: (args?: any) => ipcRenderer.invoke('config:set', args),
        generateBackupFile: (args?: any) => ipcRenderer.invoke('config:generateBackupFile', args),
        restoreFromBackupFile: (args?: any) => ipcRenderer.invoke('config:restoreFromBackupFile', args),
        selectFolder: () => ipcRenderer.invoke('config:selectFolder'),

        init: () => ipcRenderer.invoke('config:init'),
    },
});
