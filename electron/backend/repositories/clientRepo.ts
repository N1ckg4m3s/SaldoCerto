import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

export interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

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

export const RepositorioCliente = {
    adicionarCliente: async (dados: any): Promise<IPCResponseFormat> => {
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
                return { success: true }
            } else {
                return { success: false, message: '[Erro não identificado]: RepositorioCliente.adicionarCliente' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.adicionarCliente]: ${e}` }
        }
    }
}