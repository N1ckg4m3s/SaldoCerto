import { HashRouter, Routes, Route } from 'react-router-dom';

// NAVEGAÇÃO DO APP
// import ...

// PAGINAS DO APP
import Dashboard from './pages/dashboard/page';
import HistoricoDeLancamentos from './pages/historicoDeLancamentos/page';
import InformacoesDoCliente from './pages/informacoesDoCliente/page';
import ListaDeClientesCadastrados from './pages/listaDeClientesCadastrados/page';
import TabelaDeClientesEmAtrazo from './pages/TabelaDeClientesEmAtrazo/page';
import BarraDeNavegacao from './components/navBar/component';

const App = () => (<>
  <HashRouter>
    {/* Navbar padrão */}
    <BarraDeNavegacao />

    {/* Rotas */}
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/historicoDeLancamentos' element={<HistoricoDeLancamentos />} />
      <Route path='/informacoesDoCliente' element={<InformacoesDoCliente />} />
      <Route path='/listaDeClientesCadastrados' element={<ListaDeClientesCadastrados />} />
      <Route path='/TabelaDeClientesEmAtrazo' element={<TabelaDeClientesEmAtrazo />} />
    </Routes>
  </HashRouter>
</>)

export default App
