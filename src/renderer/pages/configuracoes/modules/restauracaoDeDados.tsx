import * as s from '../style'
import * as sh from './sheredModulesStyle'

export const ConfigRestauracaoModule = () => {
    return (
        <s.SectionContainer_Danger>
            <s.SectionTitle_Danger> Restauração de dados (⚠️ uso avançado) </s.SectionTitle_Danger>

            <s.SectionMessage_Danger>
                A restauração substitui todos os dados atuais pelos dados do backup selecionado.
                <br />
                Use apenas se tiver certeza do que está fazendo!
            </s.SectionMessage_Danger>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Arquivo para restaurar:</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span> Arquivo usado restaurar </span>
                </sh.FieldTip>
                <sh.ModuleFormButton type="button"> Selecionar Arquivo </sh.ModuleFormButton>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormButton> Restaurar dados </sh.ModuleFormButton>
            </sh.ModuleFieldRow>
        </s.SectionContainer_Danger>
    )
}