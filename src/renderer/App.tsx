import { HashRouter, Routes, Route } from 'react-router-dom';

// PAGES
import Dashboard from './pages/dashboard/page';
import HistoricoDeLancamentos from './pages/historicoDeLancamentos/page';
import InformacoesDoCliente from './pages/informacoesDoCliente/page';
import ListaDeClientesCadastrados from './pages/listaDeClientesCadastrados/page';
import TabelaDeClientesEmAtrazo from './pages/TabelaDeClientesEmAtrazo/page';
import BarraDeNavegacao from './components/navBar/component';

// CONTEXT PROVIDERS
import { NotificationProvider } from './components/notificationContainer/notificationContext';
import { useEffect, useState } from 'react';
import { ApiCaller } from './controler/ApiCaller';
import LoadingComponent from './components/loading/component';


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    // ApiCaller({
    //   url: '',
    //   onSuccess: (data: any) => {
    //     if (data) {
    //       setHasConfig(true);
    //     }
    //     setIsLoading(false);
    //   }
    // })
  }, [])

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!hasConfig) return (<>Tela caso não tenha config setada</>);

  // Fluxo normal do app.
  return (
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
  )
}

export default App
