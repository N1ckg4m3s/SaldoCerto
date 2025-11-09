import * as s from '../style'
import * as sh from './sheredModulesStyle'

export const ConfigBackupModule = () => {
    return (
        <s.SectionContainer>
            <s.SectionTitle> Backup e restauração </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Intervalo de backup (dias):</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span> Tempo entre backups automáticos (em dias) </span>
                </sh.FieldTip>
                <sh.ModuleFormInput
                    type="number"
                    placeholder='Ex: 7'
                    min={7}
                />
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Manter histórico por (dias):</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span>
                        Quanto tempo as movimentações permanecerão no histórico (em dias) {'\n'}
                        O tempo deve ser maior que o intervalo de backup automático.
                    </span>
                </sh.FieldTip>
                <sh.ModuleFormInput
                    placeholder='Ex: 15'
                    type="number"
                />
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Pasta de backup:</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span>
                        Local onde vai estar os arquivos de backup
                    </span>
                </sh.FieldTip>
                <sh.ModuleFormButton type="button"> Selecionar pasta </sh.ModuleFormButton>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Máximo de arquivos:</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span>
                        Limite de backups a serem mantidos
                    </span>
                </sh.FieldTip>
                <sh.ModuleFormInput
                    placeholder='Ex: 5'
                    type="number"
                    min={1}
                />
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormButton> Salvar configuração </sh.ModuleFormButton>
                <sh.ModuleFormButton> Fazer backup agora </sh.ModuleFormButton>
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}