import { ApiCaller } from '@renderer/controler/ApiCaller';
import * as s from '../style';
import { useEffect, useRef, useState } from 'react';
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';

interface Props {
    onComplete?: () => void;
    onError?: (error: any) => void;
}

export const ControleDeBackup_FloatGuiModule: React.FC<Props> = ({ onComplete, onError }) => {
    const { addNotification } = useNotification()
    const [config, setConfig] = useState({
        backupIntervalDays: 0, // backupInterval
        backupHistoryDays: 0, // movimentacaoExpiraEmDias
        backupFolderPath: '', // backupFilesPath
        maxBackupFiles: 0, // maxBackups
        lastBackup: '', // lastBackup
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: keyof typeof config, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSelectFolder = async () => {
        try {
            ApiCaller({
                url: '/backup/selectFolder',
                onSuccess: (response: any) => {
                    if (response.data?.path) {
                        setConfig(prev => ({ ...prev, backupFolderPath: response.data.path }));
                    }
                }
            })
        } catch (error) {
            onError?.(error);
        }
    };

    const validateConfig = (): boolean => {
        try {
            if (config.backupIntervalDays == null || isNaN(config.backupIntervalDays)) {
                throw new Error('O intervalo de backup deve ser um número válido.');
            }
            if
                (config.backupHistoryDays == null || isNaN(config.backupHistoryDays)) {
                throw new Error('O histórico de backup deve ser um número válido.');
            }

            if (config.maxBackupFiles == null || isNaN(config.maxBackupFiles)) {
                throw new Error('O número máximo de arquivos de backup deve ser um número válido.');
            }

            if (config.backupIntervalDays <= 7) {
                throw new Error('O intervalo de backup deve ser maior que zero.');
            }

            if (config.backupHistoryDays < config.backupIntervalDays) {
                throw new Error('O histórico de backup deve ser maior que o intervalo de backup.');
            }

            if (config.maxBackupFiles <= 0) {
                throw new Error('O número máximo de arquivos de backup deve ser maior que zero.');
            }

            if (!config.backupFolderPath) {
                throw new Error('A pasta de backup deve ser selecionada.');
            }
            return true;
        } catch (error) {
            addNotification({
                id: String(Date.now()),
                title: "Erro de validação",
                type: 'error',
                message: error ? String(error) : 'Configuração inválida.',
            });
            return false;
        }
    };

    const handleSave = async () => {
        if (!validateConfig()) return;

        try {
            setLoading(true);
            ApiCaller({
                url: '/backup/set',
                args: config,
                onSuccess: (data: any) => {
                    addNotification({
                        id: String(Date.now()),
                        title: "Configuração salva",
                        type: 'success',
                        message: 'Configurações de backup salvas com sucesso.',
                    });
                    onComplete?.();
                },
                onError(erro) {
                    addNotification({
                        id: String(Date.now()),
                        title: "Erro ao salvar",
                        type: 'error',
                        message: erro.message || 'Erro ao salvar configurações de backup.',
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                ApiCaller({
                    url: '/backup/get',
                    onSuccess: (response: any) => {
                        if (response) setConfig(response.data);
                    }
                })
            } catch {
                /* ignora se ainda não existir config */
            }
        };
        fetchConfig();
    }, []);

    return (
        <s.ModuleContainer gap={10}>
            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Intervalo (dias):</s.ModuleFormLabel>
                <s.FieldTip>I
                    <span> Tempo entre backups automáticos (em dias) </span>
                </s.FieldTip>
                <s.ModuleFormInput
                    type="number"
                    min={7}
                    value={config.backupIntervalDays}
                    onChange={e => handleInputChange('backupIntervalDays', Number(e.target.value))}
                />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Histórico (dias):</s.ModuleFormLabel>
                <s.FieldTip>I
                    <span>
                        Quanto tempo as movimentações permanecerão no histórico (em dias) {'\n'}
                        O tempo deve ser maior que o intervalo de backup automático.
                    </span>
                </s.FieldTip>
                <s.ModuleFormInput
                    type="number"
                    min={config.backupIntervalDays}
                    value={config.backupHistoryDays}
                    onChange={e => handleInputChange('backupHistoryDays', Number(e.target.value))}
                />
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Pasta:</s.ModuleFormLabel>
                <s.FieldTip>I
                    <span>
                        Local onde vai estar os arquivos de backup
                    </span>
                </s.FieldTip>
                <s.ModuleFormButton type="button" onClick={handleSelectFolder}>
                    {config.backupFolderPath ? 'Pasta selecionada' : 'Selecionar pasta'}
                </s.ModuleFormButton>
            </s.ModuleFieldRow>

            <s.ModuleFieldRow>
                <s.ModuleFormLabel>Máx. arquivos:</s.ModuleFormLabel>
                <s.FieldTip>I
                    <span>
                        Limite de backups a serem mantidos
                    </span>
                </s.FieldTip>
                <s.ModuleFormInput
                    type="number"
                    min={1}
                    value={config.maxBackupFiles}
                    onChange={e => handleInputChange('maxBackupFiles', Number(e.target.value))}
                />
            </s.ModuleFieldRow>

            <s.FillSpace />

            <s.ModuleFormButton onClick={handleSave} disabled={loading}>
                Salvar configurações
            </s.ModuleFormButton>
        </s.ModuleContainer>
    );
};
