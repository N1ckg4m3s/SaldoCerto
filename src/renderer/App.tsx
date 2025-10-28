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
import { NotificationProvider } from './components/notificationContainer/notificationContext';

const App = () => (<>
  <NotificationProvider>
    <HashRouter>
      <BarraDeNavegacao />

      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/historicoDeLancamentos' element={<HistoricoDeLancamentos />} />
        <Route path='/informacoesDoCliente/:id' element={<InformacoesDoCliente />} />
        <Route path='/listaDeClientesCadastrados' element={<ListaDeClientesCadastrados />} />
        <Route path='/TabelaDeClientesEmAtrazo' element={<TabelaDeClientesEmAtrazo />} />
      </Routes>
    </HashRouter>
  </NotificationProvider>
</>)

export default App
