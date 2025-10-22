import PageTitle from '../../components/pageTitle/component';
import * as sh from '../sheredPageStyles'

const TabelaDeClientesEmAtrazo = () => {
    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Tabela de clientes em atrazo'
                buttons={[
                    { label: 'Exportar', onClick: () => { } },
                ]}
            />
        </sh.MainPageContainer>
    )
}

export default TabelaDeClientesEmAtrazo;