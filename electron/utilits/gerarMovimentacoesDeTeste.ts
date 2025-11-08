import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { clientService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'backend', 'services', 'clientService.js')).href
);
const { movimentacoesService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'backend', 'services', 'movimentacoesService.js')).href
);

const movimentacoesTypes: ('Pedido' | 'Pagamento')[] = ['Pedido', 'Pagamento'];

const getAllClientesId = async () => {
    const clientes = await clientService.ObterClientes({ limit: 100 }); // Não tem 100, mas é para obter todos.
    if (!clientes.success) throw new Error('Erro ao obter clientes para gerar movimentações de teste.');
    return clientes.data.clients.map((cliente: any) => cliente.id);
}

function gerarDataAleatoria(inicio: Date, fim: Date) {
    return new Date(inicio.getTime() + Math.random() * (fim.getTime() - inicio.getTime()));
}

const hoje = new Date();
const DiasAtras_25 = new Date();
DiasAtras_25.setDate(hoje.getDate() - 25);

export const gerarMovimentacoesDeTeste = async (quantidade: number) => {
    console.log(`Gerando ${quantidade} movimentacoes de teste...`);

    const clientesId = await getAllClientesId();

    for (let i = 1; i <= quantidade; i++) {
        try {
            const movimentacaoTeste = {
                tipo: movimentacoesTypes[Math.floor(Math.random() * movimentacoesTypes.length)],
                data: gerarDataAleatoria(DiasAtras_25, hoje),
                valor: parseFloat((Math.random() * 1000).toFixed(2)),
                ClientId: clientesId[Math.floor(Math.random() * clientesId.length)],
            }
            const response = await movimentacoesService.AdicionarNovaMovimentação(movimentacaoTeste);
            if (!response.success) {
                console.log(`movimentação ${i} Não adicionado.. erro:`, response.message)
            } else {
                console.log(`movimentação ${i} adicionado`)
            }
        } catch (erro) {
            console.error(`❌ Erro ao criar movimentação ${i}:`, erro);
        }
    }

    console.log(`Movimentações de teste geradas com sucesso.`);
}