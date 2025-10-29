import { useRef, useState } from "react";
import * as s from '../style'
import type { Cliente } from "@renderer/shered/types";
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";
import { SelectClient } from "./selectClentInput";

interface Props {
    onError?: () => void;
    onComplete?: () => void;
    Cliente?: Cliente;
}

/*
export type Movimentacao = {
    ClientId: string,
    tipo: TipoMovimentacao,
    data: string,
    vencimento?: string,
    valor: number,
    valorAbatido?: number,
    codigo: string,
}
*/

export const AdicionarMovimentacao_FloatGuiModule: React.FC<Props> = ({ onComplete, onError, Cliente }) => {
    const { addNotification } = useNotification();

    const [clientId, setClientId] = useState<{ id: string, nome: string } | null>(null);
    const dataRef = useRef<HTMLInputElement>(null);
    const valorRef = useRef<HTMLInputElement>(null);
    const codigoRef = useRef<HTMLInputElement>(null);

    const [tipo, setTipo] = useState<'Pedido' | 'Pagamento' | ''>('');

    /** 
     * Valida o furmulario
     * @returns {boolean} valido ou não 
    */
    const validadeForm = (): boolean => {
        try {
            if (!clientId || clientId.id == '') throw new Error('Cliente não selecionado');

            if (tipo === '') throw new Error('Selecione o tipo da movimentação');

            if (!dataRef || dataRef.current?.value === '') throw new Error('Data não informada');

            if (!valorRef || valorRef.current?.value === '' || isNaN(Number(valorRef.current?.value))) throw new Error('Valor não informado');

            return true;
        } catch (e: any) {
            addNotification({
                id: String(Date.now()),
                title: 'Formulario incompleto',
                message: e?.message || 'no message',
                type: 'warning',
            })

            return false;
        }
    }

    const handleSubmit = () => {
        try {
            const IsFormularioValido = validadeForm();
            if (!IsFormularioValido) return;

            const payload = {
                ClientId: clientId?.id || '',
                tipo: tipo || '',
                data: dataRef.current?.value || '',
                vencimento: '',
                valor: Number(valorRef.current?.value || ''),
                valorAbatido: 0,
                codigo: codigoRef.current?.value || '',
            };

            ApiCaller({
                url: `/movimentacoes/create`,
                args: payload,
                onError(error) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Error',
                        message: error.message || 'Unknown error',
                        errorCode: error.errorCode || 'ERR_UNKNOWN',
                        type: 'error',
                    })
                },
                onSuccess(data) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Sucesso',
                        message: `Adicionado com sucesso`,
                        type: 'success',
                    })
                },
            })
            onComplete?.();

        } catch {
            console.log("on error chamado")
            onError?.();
        }
    }

    return (
        <s.ModuleContainer>
            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Cliente:</s.ModuleFormLabel>
                <SelectClient
                    showSelected={clientId?.nome || null}
                    onSelect={(selected: any) => setClientId(selected)}
                />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Tipo de movimentação:</s.ModuleFormLabel>
                <s.ModuleFormSelect
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as 'Pedido' | 'Pagamento' | '')}>
                    <option value=''>-Selecione-</option>
                    <option value="Pedido">Pedido</option>
                    <option value="Pagamento">Pagamento</option>
                </s.ModuleFormSelect>
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Data:</s.ModuleFormLabel>
                <s.ModuleFormInput placeholder="Data" type="date" defaultValue={''} ref={dataRef} />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Valor:</s.ModuleFormLabel>
                <s.ModuleFormInput placeholder="Valor" type="number" step={0.01} min={0} defaultValue={''} ref={valorRef} />
            </s.ModuleFieldRow>

            {
                tipo == 'Pedido' &&
                <s.ModuleFieldRow>
                    <s.ModuleFormLabel>Codigo:</s.ModuleFormLabel>
                    <s.FieldTip>I
                        <span> Opcional, caso tenha algum controle por fora </span>
                    </s.FieldTip>
                    <s.ModuleFormInput placeholder="Codigo do pedido" type="text" defaultValue={''} ref={codigoRef} />
                </s.ModuleFieldRow>
            }

            <s.ModuleFormButton onClick={handleSubmit}> Adicionar movimentação </s.ModuleFormButton>

        </s.ModuleContainer>
    )
    const isEditMode = !!Cliente

    // refs ao invés de useState
    const nomeRef = useRef<HTMLInputElement>(null);
    const telefoneRef = useRef<HTMLInputElement>(null);
    const contratoTypeRef = useRef<HTMLSelectElement>(null);
    const contratoDiaRef = useRef<HTMLInputElement>(null);

    /** 
     * Valida o furmulario
     * @returns {boolean} valido ou não 
    */
    const validadeForm_ = (): boolean => {
        try {
            if (!nomeRef.current || nomeRef.current.value === '') throw new Error("Nome não informado");

            if (!telefoneRef.current || telefoneRef.current.value === '') throw new Error("Contato não informado");

            if (!contratoTypeRef.current || contratoTypeRef.current.value === '') throw new Error("Tipo de contrato não informado");

            if (!contratoDiaRef.current || contratoDiaRef.current.value == '' || isNaN(Number(contratoDiaRef.current.value))) throw new Error("Prazo de cobrança não informado");

            return true
        } catch (e: any) {
            addNotification({
                id: String(Date.now()),
                title: 'Formulario incompleto',
                message: e?.message || 'no message',
                type: 'warning',
            })

            return false;
        }
    }

    const handleSubmit_ = async () => {
        try {
            const IsFormularioValido = validadeForm();
            if (!IsFormularioValido) return;

            const payload = {
                nome: nomeRef.current?.value || "",
                telefone: telefoneRef.current?.value || "",
                contrato: {
                    type: contratoTypeRef.current?.value as Cliente["contrato"]["type"],
                    dia: contratoDiaRef.current?.value || "",
                },
            };

            const url = `/cliente/${isEditMode ? 'update' : 'create'}`

            ApiCaller({
                url: url,
                args: payload,
                onError(error) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Error',
                        message: error.message || 'Unknown error',
                        errorCode: error.errorCode || 'ERR_UNKNOWN',
                        type: 'error',
                    })
                },
                onSuccess(data) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Sucesso',
                        message: `${isEditMode ? "Atualizado" : "Adicionado"} com sucesso`,
                        type: 'success',
                    })
                },
            })
            onComplete?.();

        } catch {
            console.log("on error chamado")
            onError?.();
        }
    };

    return (
        <s.ModuleContainer>
            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Nome:</s.ModuleFormLabel>
                <s.ModuleFormInput placeholder="Nome do cliente" type="text" defaultValue={Cliente?.nome} ref={nomeRef} />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Contato:</s.ModuleFormLabel>
                <s.ModuleFormInput placeholder="Contato do cliente" type="text" defaultValue={Cliente?.telefone} ref={telefoneRef} />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Tipo de contrato:</s.ModuleFormLabel>
                <s.FieldTip>I
                    <span>
                        Tipos de contrato: {'\n'}
                        * Praso: Define o tempo que a pessoa tem que pagar (tipo: 15 dias apartir da data) {'\n'}
                        * Fechamento: Define uma data final do mes que o cliente deve pagar (tipo: dia 20) {'\n'}
                        * Periodo: Define um periodo de tempo que as notas vão ser somadas (tipo: 10 em 10 dias)
                    </span>
                </s.FieldTip>
                <s.ModuleFormSelect defaultValue={Cliente?.contrato.type} ref={contratoTypeRef}>
                    <option value=''>-Selecione-</option>
                    <option value="praso">Prazo</option>
                    <option value="fechamento">Fechamento</option>
                    <option value="periodo">Período</option>
                </s.ModuleFormSelect>
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Dia / Período / Prazo:</s.ModuleFormLabel>
                <s.ModuleFormInput
                    placeholder="Informe o valor"
                    type="number"
                    defaultValue={Cliente?.contrato.dia}
                    ref={contratoDiaRef}
                />
            </s.ModuleFieldRow>

            <s.ModuleFormButton onClick={handleSubmit}>
                {isEditMode ? "Salvar Alterações" : "Criar Cliente"}
            </s.ModuleFormButton>
        </s.ModuleContainer >
    );
};
