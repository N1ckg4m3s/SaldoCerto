import PageTitle from '../../components/pageTitle/component';
import * as sh from '../sheredPageStyles'

const InformacoesDoCliente = () => {
    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Informações do cliente - [NOME]'
                buttons={[
                    { label: 'Registrar movimentação', onClick: () => { } },
                    { label: 'Exportar lista', onClick: () => { } },
                ]}
            />
        </sh.MainPageContainer>
    )
}

export default InformacoesDoCliente;