import type { configsInformations } from '@renderer/shered/types';
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { useState } from 'react';
import { ApiCaller } from '@renderer/controler/ApiCaller';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { useTheme } from '../../../../provider/theme/themeProvider';

interface props {
    config: configsInformations;
    update: () => void
}

export const ConfigAparenciaModule: React.FC<props> = ({ config, update }) => {
    const { darkMode, fontSize, setDarkMode, setFontSize } = useTheme()
    const { addNotification } = useNotification();
    const [configEditable, setConfig] = useState<configsInformations>(config);

    const handleInputChange = (key: keyof typeof configEditable, value: any) => {
        const updated = { ...configEditable, [key]: value }

        if (key == 'darkMode') {
            setDarkMode(value)
        } else if (key == 'fontSize') {
            setFontSize(value)
        }

        setConfig(updated)
        handleSave()
    };

    const handleSave = async () => {
        try {
            const payload = {
                darkMode: !darkMode, // o contrario.
                fontSize: fontSize
            }

            ApiCaller({
                url: '/backup/setAparence',
                args: payload,
                onSuccess: (data: any) => update(),
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
                    value={fontSize}
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
                    checked={darkMode}
                    onChange={e => handleInputChange('darkMode', e.target.checked)}
                    type="checkbox"
                />
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}