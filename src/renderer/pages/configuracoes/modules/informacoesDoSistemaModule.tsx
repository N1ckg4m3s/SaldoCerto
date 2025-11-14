import type { configsInformations } from '@renderer/shered/types';
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { formatarDateParaTexto } from '@renderer/controler/auxiliar';
import { useNavigate } from 'react-router-dom';

interface props {
    config: configsInformations;
}

export const ConfigInformacoesModule: React.FC<props> = ({ config }) => {
    const navigation = useNavigate();

    const handleViewLogs = () => {
        navigation('/TabelaDeLogsDoSistema')
    }
    return (
        <s.SectionContainer>
            <s.SectionTitle> Informações do sistema </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Versão do aplicativo:</sh.ModuleFormLabel>
                <sh.span> V 1.0.0 (local) </sh.span>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Último backup:</sh.ModuleFormLabel>
                <sh.span>{formatarDateParaTexto(config.lastBackup)}</sh.span>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Logs:</sh.ModuleFormLabel>
                <sh.ModuleFormButton onClick={handleViewLogs}> Visualizar Logs </sh.ModuleFormButton>
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}