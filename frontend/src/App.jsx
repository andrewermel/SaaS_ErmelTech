import { useEffect, useState } from 'react';
import { Loading } from './components/Loading';
import { ToastProvider } from './components/Toast';
import { ROUTES } from './constants';
import {
  AuthProvider,
  useAuth,
} from './contexts/AuthContext';
import HomePage from './pages/HomePage.jsx';
import IngredientPage from './pages/IngredientPage.jsx';
import Login from './pages/Login.jsx';
import PortionPage from './pages/PortionPage.jsx';
import Register from './pages/Register.jsx';
import SnackPage from './pages/SnackPage.jsx';

function AppContent() {
  const { isAuthenticated, logout, loading } = useAuth();
  const [route, setRoute] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (isAuthenticated && !hash) {
      window.location.hash = ROUTES.SNACKS;
      setRoute(ROUTES.SNACKS);
    } else if (!isAuthenticated && !hash) {
      window.location.hash = ROUTES.LOGIN;
      setRoute(ROUTES.LOGIN);
    } else {
      setRoute(hash);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || ROUTES.LOGIN;

      // Redireciona para login se não autenticado e tenta acessar rota protegida
      const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
      if (
        !isAuthenticated &&
        !publicRoutes.includes(hash)
      ) {
        window.location.hash = ROUTES.LOGIN;
        setRoute(ROUTES.LOGIN);
        return;
      }

      setRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () =>
      window.removeEventListener(
        'hashchange',
        handleHashChange
      );
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  if (loading) {
    return (
      <Loading
        fullScreen
        message="Carregando aplicação..."
      />
    );
  }

  return (
    <div className="app-container">
      <header>
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="title">BlackLanches</h1>
        {isAuthenticated && (
          <button
            className="btn-logout-header"
            onClick={handleLogout}
          >
            Sair
          </button>
        )}
      </header>

      {/* Menu Lateral */}
      <div
        className={`side-menu ${menuOpen ? 'open' : ''}`}
      >
        <button className="close-menu" onClick={closeMenu}>
          ✕
        </button>
        <nav>
          {!isAuthenticated ? (
            <>
              <a href={ROUTES.LOGIN} onClick={closeMenu}>
                Login
              </a>
              <a href={ROUTES.REGISTER} onClick={closeMenu}>
                Cadastro
              </a>
            </>
          ) : (
            <>
              <a href={ROUTES.SNACKS} onClick={closeMenu}>
                🍔 Lanches
              </a>
              <a href={ROUTES.HOME} onClick={closeMenu}>
                🏠 Home
              </a>
              <a
                href={ROUTES.INGREDIENTS}
                onClick={closeMenu}
              >
                🥬 Ingredientes
              </a>
              <a href={ROUTES.PORTIONS} onClick={closeMenu}>
                🍽️ Porções
              </a>
            </>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
        ></div>
      )}

      <main>
        {route === ROUTES.REGISTER ? (
          <Register />
        ) : route === ROUTES.LOGIN ? (
          <Login />
        ) : route === ROUTES.HOME ? (
          <HomePage />
        ) : route === ROUTES.INGREDIENTS ? (
          <IngredientPage />
        ) : route === ROUTES.PORTIONS ? (
          <PortionPage />
        ) : (
          <SnackPage />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
