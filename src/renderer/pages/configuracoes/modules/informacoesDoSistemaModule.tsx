import * as s from '../style'
import * as sh from './sheredModulesStyle'

export const ConfigInformacoesModule = () => {
    return (
        <s.SectionContainer>
            <s.SectionTitle> Informações do sistema </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Versão do aplicativo:</sh.ModuleFormLabel>
                <span> V 1.0.0 (local) </span>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Último backup:</sh.ModuleFormLabel>
                <span> ##/##/##</span>
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}