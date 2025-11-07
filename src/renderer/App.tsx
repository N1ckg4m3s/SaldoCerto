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
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);

  const initBackgroundProcess = () => ApiCaller({
    url: '/backup/init',
    onError(erro) {
      console.log('Erro ao iniciar processo de background', erro);
    },
  })

  useEffect(() => {
    ApiCaller({
      url: '/backup/get',
      onSuccess: async (response: any) => {
        if (response?.data !== null && response?.data !== undefined) {
          setHasConfig(true)
          await initBackgroundProcess()
        }
        setIsLoading(false);
      },
      onError(erro) {
        console.log('Erro ao obter configuração', erro);
      },
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
          showBackupInterface(() => {
            setHasConfig(true);
          }) :
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

const showBackupInterface = (onComplete: () => void) => {
  return (
    <InterfaceFlutuante
      title="Controle de Backup"
      onClose={() => { }}
    >
      <ControleDeBackup_FloatGuiModule
        onComplete={onComplete} />
    </InterfaceFlutuante>
  )
}