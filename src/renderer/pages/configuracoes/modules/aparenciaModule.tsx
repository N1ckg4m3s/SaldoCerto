import type { configsInformations } from '@renderer/shered/types';
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { useState } from 'react';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';

interface props {
    config: configsInformations;
    update: () => void
}

export const ConfigAparenciaModule: React.FC<props> = ({ config, update }) => {
    const { addNotification } = useNotification();
    const [configEditable, setConfig] = useState<configsInformations>(config);

    const handleInputChange = (key: keyof typeof configEditable, value: any) => {
        const updated = { ...configEditable, [key]: value }
        setConfig(updated)
        handleSave(updated)
    };


    const handleSave = async (updated: configsInformations) => {
        try {
            const payload = {
                darkMode: updated.darkMode || false,
                fontSize: updated.fontSize || 'normal'
            }

            ApiCaller({
                url: '/backup/setAparence',
                args: payload,
                onSuccess: (data: any) => {
                    addNotification({
                        id: String(Date.now()),
                        title: "Aparencia alterada",
                        type: 'success',
                        message: 'Configurações de aparencia salvas com sucesso.',
                    });
                    update()
                },
                onError(erro) {
                    addNotification({
                        id: String(Date.now()),
                        title: "Erro ao alterar a aparencia",
                        type: 'error',
                        message: erro.message || 'Erro ao alterar configurações de aparencia.',
                    });
                },
            })
        } catch (error) {
            addNotification({
                id: String(Date.now()),
                title: "Erro ao salvar",
                type: 'error',
                message: 'Erro ao salvar configurações de backup.',
            });
        }
    };

    return (
        <s.SectionContainer>
            <s.SectionTitle> Aparencia do sistema </s.SectionTitle>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Tamanho da fonte:</sh.ModuleFormLabel>
                <sh.ModuleFormSelect
                    value={configEditable.fontSize}
                    onChange={e => handleInputChange('fontSize', e.target.value)}
                >
                    <option value="small">Pequena</option>
                    <option value="normal">Normal</option>
                    <option value="big">Grande</option>
                </sh.ModuleFormSelect>
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Modo escuro:</sh.ModuleFormLabel>
                <sh.ModuleFormCheck
                    checked={!configEditable.darkMode}
                    onChange={e => handleInputChange('darkMode', e.target.checked)}
                    type="checkbox"
                />
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}