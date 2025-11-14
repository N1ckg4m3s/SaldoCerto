import * as s from '../style'
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";

interface Props {
    dados: Record<string, any>;
}

export const ShowLogs_FloatGuiModule: React.FC<Props> = ({ dados }) => {
    return (
        <s.ModuleContainer gap={5}>
            {Object.entries(dados || {}).map(([chave, valor]) => (
                <s.ModuleFieldRow key={chave}>
                    <s.ModuleFormLabel>{chave}</s.ModuleFormLabel>
                    <span>{String(valor)}</span>
                </s.ModuleFieldRow>
            ))}
            <s.FillSpace />
        </s.ModuleContainer>
    );
};
