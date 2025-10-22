import * as s from './style';
import { useLocation } from 'react-router-dom';

const Botoes = {
    '/': "Dashboard",
    '/historicoDeLancamentos': 'Histórico de lançamentos',
    '/listaDeClientesCadastrados': 'Clientes cadastrados',
    '/TabelaDeClientesEmAtrazo': 'Clientes em atraso',
}

const BarraDeNavegacao = () => {
    const location = useLocation(); // pega a rota atual

    return (
        <s.NavBarContainer>
            {Object.entries(Botoes).map((i, v) => {
                const [endereco, nome] = i;
                return (
                    <s.NavLink
                        key={endereco}
                        to={endereco}
                        Selected={location.pathname === endereco}
                        aria-disabled={location.pathname === endereco}
                    >{nome}
                    </s.NavLink>)
            }
            )}
        </s.NavBarContainer>
    );
};

export default BarraDeNavegacao;
