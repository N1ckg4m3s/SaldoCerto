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
import InterfaceFlutuante from './components/floatGui/component';
import { ControleDeBackup_FloatGuiModule } from './components/floatGui/models/controleDeBackup';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);

  const initBackgroundProcess = () => ApiCaller({
    url: '/backup/init',
    onSuccess: (data: any) => {
      console.log('Configuração inicial verificada', data);
      if (data) setHasConfig(true);
      setIsLoading(false);
    }
  })

  useEffect(() => {
    ApiCaller({
      url: '/backup/get',
      onSuccess: async (data: any) => {
        if (!data) setHasConfig(false);
        else await initBackgroundProcess();
        setIsLoading(false);
      }
    })
  }, [])

  if (isLoading) {
    return <LoadingComponent />;
  }

  // Fluxo normal do app.
  return (
    <NotificationProvider>
      {
        !hasConfig ?
          showBackupInterface() :
          <>
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
          </>
      }

    </NotificationProvider>
  )
}

export default App;

const showBackupInterface = () => {
  return (
    <InterfaceFlutuante
      title="Controle de Backup"
      onClose={() => { }}
    >
      <ControleDeBackup_FloatGuiModule onComplete={() => { }} />

    </InterfaceFlutuante>
  )
}