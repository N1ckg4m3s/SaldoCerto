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
import ConfiguracoesDoSistema from './pages/configuracoes/page';

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
        !hasConfig ? <ConfiguracoesDoSistema
          onComplete={() => setHasConfig(true)}
        /> :
          <>
            <HashRouter>
              <BarraDeNavegacao />
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/HistoricoDeLancamentos' element={<HistoricoDeLancamentos />} />
                <Route path='/informacoesDoCliente/:id' element={<InformacoesDoCliente />} />
                <Route path='/ListaDeClientesCadastrados' element={<ListaDeClientesCadastrados />} />
                <Route path='/TabelaDeClientesEmAtrazo' element={<TabelaDeClientesEmAtrazo />} />
                <Route path='/ConfiguracoesDoSistema' element={<ConfiguracoesDoSistema />} />
              </Routes>
            </HashRouter>
          </>
      }

    </NotificationProvider>
  )
}

export default App;