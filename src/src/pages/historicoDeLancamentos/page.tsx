import PageTitle from '../../components/pageTitle/component';
import * as sh from '../sheredPageStyles'
import * as s from './style'

const HistoricoDeLancamentos = () => {
    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Historico de lançamentos'
                buttons={[
                    { label: 'Adicionar Movimentação', onClick: () => { } },
                    { label: 'Exportar', onClick: () => { } },
                ]}
            />
        </sh.MainPageContainer>
    )
}

export default HistoricoDeLancamentos;