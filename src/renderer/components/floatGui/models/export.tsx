import * as s from '../style'
import { useNotification } from "@renderer/components/notificationContainer/notificationContext";
import { ApiCaller } from "@renderer/controler/ApiCaller";
import { useState } from 'react';

interface Props {
    onError?: () => void
    onComplete?: () => void
    urlDataOrigin: string
    necessaryPageData: any
    filters: any
}

export const ExportarInformacoes_FloatGuiModule: React.FC<Props> = ({ onComplete, onError, urlDataOrigin, necessaryPageData, filters }) => {
    const { addNotification } = useNotification();

    const [informations, setInformations] = useState({
        tipoExportacao: '',
        ApenasAPaginaVisivel: false,
        DeveUsarOsFiltrosAtuais: false,
    })

    const handleInputChange = (key: keyof typeof informations, value: any) => {
        setInformations(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (informations.tipoExportacao == '') {
            addNotification({
                id: String(Date.now()),
                title: "Falta informações",
                type: 'warning',
                message: 'Qual tipo de arquivo para exportar?'
            })
            return
        }
        const payload = {
            urlDataOrigin,
            necessaryPageData,
            filters,
            onlyCurrentPage: informations.ApenasAPaginaVisivel,
            tipo: informations.tipoExportacao,
        }

        ApiCaller({
            url: '/export/generate',
            args: payload,
            onSuccess(data) {
                addNotification({
                    id: String(Date.now()),
                    title: 'Exportação concluida',
                    message: `O arquivo esta em: ${data.filePath}, tamanho: ${data.total}`,
                    type: 'success',
                });
                onComplete?.();
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: 'Erro ao exportar',
                    message: erro.message || '- No Message -',
                    type: 'error',
                });
                onComplete?.();
            },
        });
    };

    return (
        <s.ModuleContainer gap={10}>
            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Tipo de arquivo:</s.ModuleFormLabel>
                <s.ModuleFormSelect
                    defaultValue={informations.tipoExportacao}
                    onChange={(e) => handleInputChange('tipoExportacao', e.target.value)}>
                    <option value=''>-Selecione-</option>
                    <option value="pdf">PDF</option>
                    <option value="csv">EXCEL</option>
                    <option value="json">JSON</option>
                </s.ModuleFormSelect>
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Manter os filtros usados?</s.ModuleFormLabel>
                <s.ModuleFormCheck
                    checked={informations.DeveUsarOsFiltrosAtuais}
                    onChange={e => handleInputChange('DeveUsarOsFiltrosAtuais', e.target.checked)}
                    type="checkbox"
                />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Apenas a pagina atual?</s.ModuleFormLabel>
                <s.ModuleFormCheck
                    checked={informations.ApenasAPaginaVisivel}
                    onChange={e => handleInputChange('ApenasAPaginaVisivel', e.target.checked)}
                    type="checkbox"
                />
            </s.ModuleFieldRow>

            <s.FillSpace />
            <s.ModuleFormButton onClick={handleSubmit}>Exportar</s.ModuleFormButton>
        </s.ModuleContainer>
    );
};
