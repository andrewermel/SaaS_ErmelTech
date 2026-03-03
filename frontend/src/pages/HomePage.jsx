import { ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="card home-container">
      <h2>{user?.companyName || 'ErmelTech'}</h2>

      {user && (
        <div className="welcome-section">
          <p className="welcome-text">
            <strong>Bem-vindo:</strong> {user.email}
          </p>
        </div>
      )}

      <div className="menu-grid">
        <div className="menu-card">
          <h3>🥬 Ingredientes</h3>
          <p>Gerencie os ingredientes disponíveis</p>
          <a href={ROUTES.INGREDIENTS}>
            <button>Acessar</button>
          </a>
        </div>

        <div className="menu-card">
          <h3>🍽️ Porções</h3>
          <p>Crie porções a partir dos ingredientes</p>
          <a href={ROUTES.PORTIONS}>
            <button>Acessar</button>
          </a>
        </div>

        <div className="menu-card">
          <h3>🍔 Lanches</h3>
          <p>Monte lanches com porções e calcule custos</p>
          <a href={ROUTES.SNACKS}>
            <button>Acessar</button>
          </a>
        </div>

        {user?.companySlug && (
          <div className="menu-card">
            <h3>🌐 Cardápio Público</h3>
            <p>
              Visualize seu cardápio como os clientes veem
            </p>
            <a href={`/#/menu/${user.companySlug}`}>
              <button>Visualizar</button>
            </a>
          </div>
        )}

        <button className="logout-btn" onClick={logout}>
          Sair
        </button>
      </div>
    </div>
  );
}
