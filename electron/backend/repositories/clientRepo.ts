import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

interface IPCResponseFormat {
    success: boolean,
    message?: string,
    data?: any,
    errorCode?: string
}

/* Chegar ao Prisma */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { prisma } = await import(pathToFileURL(path.join(__dirname, '..', 'prismaConnection.js')).href);

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
    },

    atualizarInformacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const novoCliente = await prisma.cliente.update({
                where: { id: dados.id },
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
                return { success: false, message: '[Erro não identificado]: RepositorioCliente.atualizarInformacoesDoCliente' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.atualizarInformacoesDoCliente]: ${e}` }
        }
    },

    removerInformacoesDoCliente: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const movimentacoesApagadas = await prisma.movimentacao.deleteMany({
                where: { clienteId: dados.id },
            });

            const clienteApagado = await prisma.cliente.delete({
                where: { id: dados.id },
            });

            if (movimentacoesApagadas && clienteApagado) {
                return { success: true }
            } else {
                return { success: false, message: '[Erro não identificado]: RepositorioCliente.removerInformacoesDoCliente' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.removerInformacoesDoCliente]: ${e}` }
        }
    },

    obterClientePorId: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            const clienteEncontrado = await prisma.cliente.findUnique({
                where: { id: dados.id },
            });

            if (clienteEncontrado) {
                return { success: true, data: clienteEncontrado }
            } else {
                return { success: false, message: 'Cliente não encontrado' }
            }
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.obterClientePorId]: ${e}` }
        }
    },

    obterClientes: async (dados: any): Promise<IPCResponseFormat> => {
        try {
            // informações de filtragem
            const { page = 0, limit = 20, search = '' } = dados;

            const clientesEncontrado = await prisma.cliente.findMany({
                where: {
                    nome: { contains: search },
                },
                orderBy: { nome: 'asc' },
                skip: page * limit,
                take: limit,
            });

            const total = await prisma.cliente.count({
                where: { nome: { contains: search } },
            });

            return {
                success: true,
                data: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    clients: clientesEncontrado,
                },
            };
        } catch (e) {
            return { success: false, message: `[RepositorioCliente.obterClientes]: ${e}` }
        }
    },
}