import { useRef } from "react";
import * as s from '../style'
import type { Cliente } from "@renderer/shered/types";
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";

interface Props {
    onError?: () => void;
    onComplete?: () => void;
    Cliente?: Cliente;
}

export const CreateEditClient_FloatGuiModule: React.FC<Props> = ({ onComplete, onError, Cliente }) => {
    const { addNotification } = useNotification();

    const isEditMode = !!Cliente;

    // refs ao invés de useState
    const nomeRef = useRef<HTMLInputElement>(null);
    const telefoneRef = useRef<HTMLInputElement>(null);
    const contratoTypeRef = useRef<HTMLSelectElement>(null);
    const contratoDiaRef = useRef<HTMLInputElement>(null);

    /** 
     * Valida o furmulario
     * @returns {boolean} valido ou não 
    */
    const validadeForm = (): boolean => {
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

    const handleSubmit = async () => {
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
