import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'

import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { ConfigBackupModule } from './modules/backupInformationsModule';
import { ConfigRestauracaoModule } from './modules/restauracaoDeDados';
import { ConfigAparenciaModule } from './modules/aparenciaModule';
import { ConfigInformacoesModule } from './modules/informacoesDoSistemaModule';
import { useEffect, useState } from 'react';
import type { configsInformations } from '@renderer/shered/types';
import { ApiCaller } from '@renderer/controler/ApiCaller';

interface props {
    onComplete?: () => void;
}

const ConfiguracoesDoSistema: React.FC<props> = ({ onComplete }) => {
    const { addNotification } = useNotification();
    const [config, setConfig] = useState<configsInformations>({
        backupIntervalDays: 7, // backupInterval
        backupHistoryDays: 7, // movimentacaoExpiraEmDias
        backupFolderPath: '', // backupFilesPath
        maxBackupFiles: 1, // maxBackups
        lastBackup: '', // lastBackup,
        fontSize: 'normal', // fontSize
        darkMode: false, // darkMode
    });

    const fetchApiConfigs = () => {
        ApiCaller({
            url: '/backup/get',
            onSuccess: (response: any) => {
                if (response) setConfig({
                    backupFolderPath: response.backupFilesPath || '',
                    backupIntervalDays: response.backupInterval || 7,
                    darkMode: response.darkMode,
                    fontSize: response.fontSize || 'normal',
                    lastBackup: response.lastBackup || '',
                    maxBackupFiles: response.maxBackups || 1,
                    backupHistoryDays: response.movimentacaoExpiraEmDias || 7,
                });
            },
            onError(erro) {
                addNotification({
                    id: String(Date.now()),
                    title: "Erro ao obter configurações",
                    type: 'error',
                    message: erro.message || ''
                })
            },
        })
    }
    useEffect(() => { fetchApiConfigs() }, []);

    return (
        <sh.MainPageContainer>
            <PageTitle titulo='Configurações do sistema' />

            <ConfigBackupModule
                config={config}
                onComplete={() => onComplete?.()}
            />

            <ConfigRestauracaoModule />

            <ConfigAparenciaModule
                update={fetchApiConfigs}
                config={config}
            />

            <ConfigInformacoesModule
                config={config}
            />
        </sh.MainPageContainer>
    )
}

export default ConfiguracoesDoSistema;