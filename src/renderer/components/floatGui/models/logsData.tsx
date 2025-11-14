import * as s from '../style'
interface Props {
    dados: Record<string, any>;
}

export const ShowLogs_FloatGuiModule: React.FC<Props> = ({ dados }) => {
    return (
        <s.ModuleContainer gap={5}>
            {Object.entries(dados || {}).map(([chave, valor]) => (
                <s.ModuleFieldRow key={chave}>
                    <s.ModuleFormLabel>{chave}</s.ModuleFormLabel>
                    <span style={{ whiteSpace: 'pre-wrap' }}>{String(valor)}</span>
                </s.ModuleFieldRow>

            ))}
            <s.FillSpace />
        </s.ModuleContainer>
    );
};
