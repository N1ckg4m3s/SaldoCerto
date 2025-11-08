import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { clientService } = await import(
    pathToFileURL(path.join(__dirname, '..', 'backend', 'services', 'clientService.js')).href
);

const contratoTypes: ('fechamento' | 'periodo')[] = ['fechamento', 'periodo'];

export const gerarClientesDeTeste = async (quantidade: number) => {
    console.log(`Gerando ${quantidade} clientes de teste...`);

    for (let i = 1; i <= quantidade; i++) {
        try {
            const clienteTeste = {
                nome: `Cliente Teste ${i}`,
                telefone: `(11) 90000-00${String(i).padStart(2, '0')}`,
                contrato: {
                    type: contratoTypes[Math.floor(Math.random() * contratoTypes.length)],
                    dia: String(Math.floor(Math.random() * 28) + 1)
                }
            };
            const clienteAdicionadoResponse = await clientService.AdicionarNovoCliente(clienteTeste);
            if (!clienteAdicionadoResponse.success) {
                console.log(`cliente ${i} Não adicionado.. erro:`, clienteAdicionadoResponse.message)
            } else {
                console.log(`cliente ${i} adicionado`)
            }
        } catch (erro) {
            console.error(`❌ Erro ao criar cliente ${i}:`, erro);
        }
    }

    console.log(`Clientes de teste gerados com sucesso.`);
};