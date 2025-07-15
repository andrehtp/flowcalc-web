import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EstacaoForm } from './page/EstacaoForm';
import { DadosPage } from './page/DadosPage';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isInicio = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      {isInicio && <Header />}
      <main
        className={
          isInicio
            ? 'flex-grow flex items-center justify-center bg-gray-100'
            : 'flex-grow bg-gray-100 px-8 pt-8'
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <EstacaoForm />
            </Layout>
          }
        />
        <Route
          path="/dados-estacao"
          element={
            <Layout>
              <DadosPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;