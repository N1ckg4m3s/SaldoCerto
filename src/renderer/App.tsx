import { HashRouter, Routes, Route } from 'react-router-dom';

// PAGES
import Dashboard from './pages/dashboard/page';
import HistoricoDeLancamentos from './pages/historicoDeLancamentos/page';
import InformacoesDoCliente from './pages/informacoesDoCliente/page';
import ListaDeClientesCadastrados from './pages/listaDeClientesCadastrados/page';
import TabelaDeClientesEmAtrazo from './pages/TabelaDeClientesEmAtrazo/page';
import BarraDeNavegacao from './components/navBar/component';

// CONTEXTS
import { NotificationProvider } from './components/notificationContainer/notificationContext';
import { ThemeProvider } from '../provider/theme/themeProvider'; // <- contexto de estado
import { ThemeProviderWrapper } from '../provider/theme/themeWarper';
import { useEffect, useState } from 'react';
import { ApiCaller } from './controler/ApiCaller';
import LoadingComponent from './components/loading/component';
import ConfiguracoesDoSistema from './pages/configuracoes/page';

// STYLE
import { GlobalStyle } from './globalStyleInformations';
import TabelaDeLogsDoSistema from './pages/logger/page';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const [themeConfig, setThemeConfig] = useState<{ darkMode: boolean; fontSize: "small" | "normal" | "big" }>({
    darkMode: false,
    fontSize: "normal"
  });

  const initBackgroundProcess = () =>
    ApiCaller({
      url: '/backup/init',
      onError(erro) {
        console.error('Erro ao iniciar processo de background', erro);
      },
    });

  useEffect(() => {
    ApiCaller({
      url: '/backup/get',
      onSuccess: async (response: any) => {
        if (response?.data !== null && response?.data !== undefined) {
          setThemeConfig({
            darkMode: response.data.darkMode ?? false,
            fontSize: response.data.fontSize ?? "normal"
          });

          setHasConfig(true);
          await initBackgroundProcess();
        }
        setIsLoading(false);
      },
      onError(erro) {
        console.error('Erro ao obter configuração', erro);
      },
    });
  }, []);

  if (isLoading) return <LoadingComponent />;

  return (
    <HashRouter>
      <ThemeProvider
        defaultDarkMode={themeConfig.darkMode}
        defaultFontSize={themeConfig.fontSize}
      >
        <ThemeProviderWrapper>
          <NotificationProvider>
            <GlobalStyle />
            {!hasConfig ? (
              <ConfiguracoesDoSistema onComplete={() => setHasConfig(true)} onlyBasicConfigs/>
            ) : (
              <>
                <BarraDeNavegacao />
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/HistoricoDeLancamentos' element={<HistoricoDeLancamentos />} />
                  <Route path='/informacoesDoCliente/:id' element={<InformacoesDoCliente />} />
                  <Route path='/ListaDeClientesCadastrados' element={<ListaDeClientesCadastrados />} />
                  <Route path='/TabelaDeClientesEmAtrazo' element={<TabelaDeClientesEmAtrazo />} />
                  <Route path='/ConfiguracoesDoSistema' element={<ConfiguracoesDoSistema />} />
                  <Route path='/TabelaDeLogsDoSistema' element={<TabelaDeLogsDoSistema />} />
                </Routes>
              </>
            )}
          </NotificationProvider>
        </ThemeProviderWrapper>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
