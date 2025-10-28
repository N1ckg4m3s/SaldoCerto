import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

/* Chegar ao Prisma */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PrismaPath = path.join(__dirname, '..', 'prismaConnection.js');

const PrismaUrl = pathToFileURL(PrismaPath).href;

const { prisma } = await import(PrismaUrl);

/*
    Repositorio, tem como função ser o UNICO a acessar o banco de dados
        para todos os fins de acesso possive: GET, GET-FILTER, SET, UPDATE, DELETE...
*/

/*
data: {
    nome: "asd",
    telefone: "asd",
    diaContrato: undefined, + tipoContrato: TipoContrato
}
Argument `tipoContrato` is missing.
*/


export const RepositorioCliente = {
    adicionarCliente: async (dados: any) => {
        try {
            const novoCliente = await prisma.cliente.create({
                data: {
                    nome: dados.nome,
                    telefone: dados.telefone,
                    tipoContrato: dados.contrato.type,
                    diaContrato: dados.contrato.dia,
                }
            })

            if (novoCliente) {
                return { sucess: true }
            } else {
                return { erro: '[Erro não identificado]: RepositorioCliente.adicionarCliente' }
            }
        } catch (e) {
            return { erro: `[RepositorioCliente.adicionarCliente]: ${e}` }
        }
    }
}