import PageTitle from '@renderer/components/pageTitle/component';
import * as sh from '../sheredPageStyles'

import { useNotification } from '@renderer/components/notificationContainer/notificationContext';
import { ConfigBackupModule } from './modules/backupInformationsModule';
import { ConfigRestauracaoModule } from './modules/restauracaoDeDados';
import { ConfigAparenciaModule } from './modules/aparenciaModule';
import { ConfigInformacoesModule } from './modules/informacoesDoSistemaModule';

interface props {
    onComplete?: () => void;
}

const ConfiguracoesDoSistema: React.FC<props> = ({ onComplete }) => {
    const { addNotification } = useNotification();
    return (
        <sh.MainPageContainer>
            <PageTitle titulo='Configurações do sistema' />

            <ConfigBackupModule />

            <ConfigRestauracaoModule />

            <ConfigAparenciaModule />
            
            <ConfigInformacoesModule />
        </sh.MainPageContainer>
    )
}

export default ConfiguracoesDoSistema;