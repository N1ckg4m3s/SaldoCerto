import PageTitle from '../../components/pageTitle/component';
import * as sh from '../sheredPageStyles'

const ListaDeClientesCadastrados = () => {
    return (
        <sh.MainPageContainer>
            <PageTitle
                titulo='Clientes cadastrados'
                buttons={[
                    { label: 'Adicionar Cliente', onClick: () => { } }
                ]}
            />
        </sh.MainPageContainer>
    )
}

export default ListaDeClientesCadastrados;