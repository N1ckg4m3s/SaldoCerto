import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

/* Chegar ao Repositorio */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RepositoryPath = path.join(__dirname, '..', 'repositories', 'clientRepo.js');

const RepositoryUrl = pathToFileURL(RepositoryPath).href;

const {RepositorioCliente} = await import(RepositoryUrl);

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
    AdicionarNovoCliente: (dados: any) => {
        const [valido, erro] = ValidateClientData(dados);

        if (!valido) return { Erro: `[ClientService.AdicionarNovoCliente]: ${erro}` };

        return RepositorioCliente.adicionarCliente(dados);
    }
}