import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/* Chegar ao Repositorio */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RepositoryPath = path.join(__dirname, '..', 'repositories', 'clientRepo.js');

const RepositoryUrl = pathToFileURL(RepositoryPath).href;

const { RepositorioCliente } = await import(RepositoryUrl);

/*
    Service, tem como função tratar o 'pedido' de dados para o banco com base na regra de negocios
        Ele verifica, datas, acrescimos, juros..., tudo.
*/

const ValidateClientData = (dado: any): [boolean, string] => {
    try {
        if (!dado) throw new Error('Não chegou data');

        if (!dado.nome) throw new Error('Usuario sem nome informado');

        if (!dado.telefone) throw new Error('Usuario sem telefone informado');

        if (!dado.contrato) throw new Error('Usuario sem contrato informado');

        if (!dado.contrato.type) throw new Error('Usuario sem tipo de contrato informado');

        if (!dado.contrato.dia) throw new Error('Usuario sem tempo informado no contrato');

        return [true, '']
    } catch (e: any) {
        return [false, e.message];
    }

}

export const clientService = {
    AdicionarNovoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        const [valido, erro] = ValidateClientData(dados);
        if (!valido) return { success: false, message: `[ClientService.AdicionarNovoCliente]: ${erro}` }

        return await RepositorioCliente.adicionarCliente(dados);
    }
}