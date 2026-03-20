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
import MembersPage from './pages/MembersPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import PortionPage from './pages/PortionPage.jsx';
import Register from './pages/Register.jsx';
import SnackPage from './pages/SnackPage.jsx';

function AppContent() {
  const { isAuthenticated, logout, loading, user } =
    useAuth();
  const [route, setRoute] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuCompanySlug, setMenuCompanySlug] =
    useState('');
  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/menu/')) {
      setMenuCompanySlug(hash.replace('#/menu/', ''));
    }
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

      if (hash.startsWith('#/menu/')) {
        const slug = hash.replace('#/menu/', '');
        setMenuCompanySlug(slug);
        setMenuKey(k => k + 1);
      }

      const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
      const isMenuRoute = hash.startsWith('#/menu/');
      if (
        !isAuthenticated &&
        !publicRoutes.includes(hash) &&
        !isMenuRoute
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
        <h1 className="title">
          {isAuthenticated && user?.companyName
            ? user.companyName
            : 'ErmelTech'}
        </h1>
        {isAuthenticated && user && (
          <div className="header-info">
            <span className="company-info">
              {user.role && (
                <span className="role-badge">
                  {user.role}
                </span>
              )}
            </span>
          </div>
        )}
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
              {user?.role === 'OWNER' && (
                <a
                  href={ROUTES.MEMBERS}
                  onClick={closeMenu}
                >
                  👥 Gerenciar Membros
                </a>
              )}
              {(user?.role === 'OWNER' ||
                user?.role === 'ADMIN') && (
                <a
                  href={
                    user?.companySlug
                      ? `/#/menu/${user.companySlug}`
                      : ROUTES.HOME
                  }
                  onClick={closeMenu}
                >
                  🌐 Cardápio
                </a>
              )}
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
        ) : route === ROUTES.MEMBERS ? (
          <MembersPage />
        ) : route.startsWith('#/menu/') ? (
          <MenuPage
            key={menuKey}
            companySlug={
              menuCompanySlug || user?.companySlug
            }
          />
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
