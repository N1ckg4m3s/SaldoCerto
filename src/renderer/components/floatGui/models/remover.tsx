import * as s from '../style'
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";

interface Props {
    onError?: () => void;
    onComplete?: () => void;
    dados: Record<string, any>;
    url: string;
    idToRemove: string;
}

export const Remover_FloatGuiModule: React.FC<Props> = ({ onComplete, onError, url, idToRemove, dados }) => {
    const { addNotification } = useNotification();

    const handleSubmit = async () => {
        try {
            if (!idToRemove || !url) {
                addNotification({
                    id: String(Date.now()),
                    title: "Sem informações o suficiente",
                    type: 'error',
                });
                return;
            }

            const payload = { id: idToRemove };

            await ApiCaller({
                url,
                args: payload,
                onSuccess(data) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Sucesso',
                        message: 'Removido com sucesso',
                        type: 'success',
                    });
                },
                onError(erro) {
                    addNotification({
                        id: String(Date.now()),
                        title: 'Erro',
                        message: erro.message || '',
                        type: 'error',
                    });
                    console.error('Erro')
                },
            });

            onComplete?.();

        } catch (error: any) {
            addNotification({
                id: String(Date.now()),
                title: 'Erro',
                message: error?.message || 'Erro desconhecido',
                errorCode: error?.errorCode || 'ERR_UNKNOWN',
                type: 'error',
            });

            onError?.();
        }
    };

    return (
        <s.ModuleContainer gap={5}>
            {Object.entries(dados || {}).map(([chave, valor]) => (
                <s.ModuleFieldRow key={chave} start={true}>
                    <s.ModuleFormLabel>{chave}</s.ModuleFormLabel>
                    <span>{String(valor)}</span>
                </s.ModuleFieldRow>
            ))}
            <s.FillSpace />
            <s.ModuleFormButton onClick={handleSubmit}>Remover</s.ModuleFormButton>
        </s.ModuleContainer>
    );
};
