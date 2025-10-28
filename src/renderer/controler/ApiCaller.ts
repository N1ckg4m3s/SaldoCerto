/**
 * ApiCaller - responsável por invocar métodos expostos via contextBridge (IPC)
 * e tratar erros/sucesso de forma padronizada.
 */

interface ApiCallerProps {
    /** Caminho no formato "/namespace/metodo", ex: "/cliente/getList" */
    url: string;
    args?: any;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export const ApiCaller = async ({ url, args, onSuccess, onError }: ApiCallerProps) => {
    try {
        if (!url.startsWith('/')) {
            throw new Error(`URL inválida: ${url}. Deve começar com '/'`);
        }

        const parts: string[] = url.slice(1).split('/');
        const namespace: string = parts[0] || '';
        const action: string = parts[1] || '';
        console.log({ url, parts, namespace, action })

        if (namespace === '' || action === '') throw new Error("namespace ou action esta vazio");
        
        const api: any = (window as any).api;
        
        if (!api) throw new Error("sem api definida");
        if (!api[namespace]) throw new Error("namespace não encontrado");
        if (!api[namespace][action]) throw new Error("action não encontrado");

        const response = await api[namespace][action](args);

        onSuccess?.(response);
    } catch (error: any) {
        console.error(`[ApiCaller] Erro em ${url}:`, error);
        onError?.(error);
    }
};
