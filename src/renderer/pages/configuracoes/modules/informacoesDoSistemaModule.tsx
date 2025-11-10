import * as s from '../style'
import * as sh from './sheredModulesStyle'

export const ConfigInformacoesModule = () => {
    return (
        <s.SectionContainer>
            <s.SectionTitle> Informações do sistema </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Versão do aplicativo:</sh.ModuleFormLabel>
                <sh.span> V 1.0.0 (local) </sh.span>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Último backup:</sh.ModuleFormLabel>
                <sh.span> ##/##/##</sh.span>
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}