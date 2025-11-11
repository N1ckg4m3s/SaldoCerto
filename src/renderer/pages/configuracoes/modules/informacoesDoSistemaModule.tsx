import type { configsInformations } from '@renderer/shered/types';
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { formatarDateParaTexto } from '@renderer/controler/auxiliar';

interface props {
    config: configsInformations;
}

export const ConfigInformacoesModule: React.FC<props> = ({ config }) => {
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
        </s.SectionContainer>
    )
}