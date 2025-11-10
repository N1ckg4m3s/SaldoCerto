import React, { useEffect, useState } from 'react';
import * as s from '../style'
import * as sh from './sheredModulesStyle'
import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { ApiCaller } from '@renderer/controler/ApiCaller';

interface props {
    onComplete?: () => void
}

export const ConfigBackupModule: React.FC<props> = ({ onComplete }) => {
    const { addNotification } = useNotification()

    const [loading, setLoading] = useState(false);

    const [config, setConfig] = useState({
        backupIntervalDays: 7, // backupInterval
        backupHistoryDays: 7, // movimentacaoExpiraEmDias
        backupFolderPath: '', // backupFilesPath
        maxBackupFiles: 1, // maxBackups
        lastBackup: '', // lastBackup
    });

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
            // onError?.(error);
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

            if (config.backupIntervalDays < 7) {
                throw new Error('O intervalo de backup deve ser maior que 7.');
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

    const handleDoBackupNow = () => {
        ApiCaller({
            url: '/backup/generateBackupFile',
            args: config,
            onSuccess: (data: any) => {
                addNotification({
                    id: String(Date.now()),
                    title: "Backup gerado",
                    type: 'success',
                    message: 'Backup foi gerado com sucesso na pasta',
                });
                onComplete?.();
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: "Erro ao gerar",
                    type: 'error',
                    message: erro.message || 'Erro gerar backup.',
                });
            },
        })
    }

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                ApiCaller({
                    url: '/backup/get',
                    onSuccess: (response: any) => {
                        if (response) setConfig({
                            backupIntervalDays: response.backupInterval,
                            backupHistoryDays: response.movimentacaoExpiraEmDias,
                            backupFolderPath: response.backupFilesPath,
                            maxBackupFiles: response.maxBackups,
                            lastBackup: response.lastBackup,
                        });
                    }
                })
            } catch {
                /* ignora se ainda não existir config */
            }
        };
        fetchConfig();
    }, []);

    /* Visual */
    const ShowPastaName = (): string => {
        const caminho = config.backupFolderPath?.trim();
        if (!caminho) return '-erro-';

        const partes = caminho.split(/[/\\]+/); // separa tanto / quanto \
        const nomePasta = partes.pop(); // última parte
        return nomePasta || '-erro-';
    };

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
                    value={config.backupIntervalDays}
                    onChange={e => handleInputChange('backupIntervalDays', Number(e.target.value))}
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
                    min={config.backupIntervalDays}
                    value={config.backupHistoryDays}
                    onChange={e => handleInputChange('backupHistoryDays', Number(e.target.value))}
                />
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormLabel>Pasta de backup:</sh.ModuleFormLabel>
                <sh.FieldTip>I
                    <span>
                        Local onde vai estar os arquivos de backup
                    </span>
                </sh.FieldTip>
                <sh.ModuleFormButton type="button" onClick={handleSelectFolder}>
                    {config.backupFolderPath ?
                        `Pasta Selecionada: [...\\${ShowPastaName()}]`
                        : 'Selecionar pasta'}
                </sh.ModuleFormButton>
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
                    value={config.maxBackupFiles}
                    onChange={e => handleInputChange('maxBackupFiles', Number(e.target.value))}
                />
            </sh.ModuleFieldRow>

            <sh.ModuleFieldRow>
                <sh.ModuleFormButton
                    disabled={loading}
                    onClick={handleSave}
                >
                    Salvar configuração
                </sh.ModuleFormButton>
                <sh.ModuleFormButton
                    disabled={loading}
                    onClick={handleDoBackupNow}
                >
                    Fazer backup agora
                </sh.ModuleFormButton>
            </sh.ModuleFieldRow>
        </s.SectionContainer>
    )
}