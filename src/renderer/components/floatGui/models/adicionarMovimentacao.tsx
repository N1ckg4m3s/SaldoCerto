import { useRef, useState } from "react";
import * as s from '../style'
import type { Cliente } from "@renderer/shered/types";
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";
import { SelectClient } from "./selectClentInput";

interface Props {
    onError?: () => void;
    onComplete?: () => void;
    ClienteDeterminado?: {
        id: string,
        nome: string
    }
}

export const AdicionarMovimentacao_FloatGuiModule: React.FC<Props> = ({ onComplete, onError, ClienteDeterminado }) => {
    const { addNotification } = useNotification();

    const [clientId, setClientId] = useState<{ id: string, nome: string } | null>(ClienteDeterminado || null);
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
};
