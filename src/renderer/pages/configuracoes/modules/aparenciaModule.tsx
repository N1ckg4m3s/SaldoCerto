import * as s from '../style'
import * as sh from './sheredModulesStyle'

export const ConfigAparenciaModule = () => {
    return (
        <s.SectionContainer>
            <s.SectionTitle> Aparencia do sistema </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Tamanho da fonte:</sh.ModuleFormLabel>
                <sh.ModuleFormSelect>
                    <option value="small">Pequena</option>
                    <option value="normal">Normal</option>
                    <option value="big">Grande</option>
                </sh.ModuleFormSelect>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Modo escuro:</sh.ModuleFormLabel>
                <sh.ModuleFormCheck
                    type="checkbox"
                />
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}