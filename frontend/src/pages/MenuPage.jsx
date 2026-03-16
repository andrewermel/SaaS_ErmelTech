import { useEffect, useState } from 'react';
import { Loading } from '../components/Loading';
import { API_ENDPOINTS, API_BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { formatCurrency } from '../utils/formatters';
import './MenuPage.css';

export default function MenuPage({
  companySlug: slugProp,
}) {
  const { user } = useAuth();
  const companySlug = slugProp || user?.companySlug;
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      if (!companySlug) {
        setError('Slug da empresa não fornecido');
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.PUBLIC.MENU}/${companySlug}`
        );
        setMenu(response);
        setError('');
      } catch (err) {
        setError(
          err.message ||
            'Erro ao carregar cardápio. Verifique a URL.'
        );
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [companySlug]);

  const getImageUrl = imageUrl => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const cleanPath = imageUrl.startsWith('/')
      ? imageUrl.slice(1)
      : imageUrl;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        message="Carregando cardápio..."
      />
    );
  }

  if (error) {
    return (
      <div className="cardapio-error-container">
        <div className="cardapio-error-content">
          <h1>❌ Ops!</h1>
          <p>{error}</p>
          <p className="cardapio-error-hint">
            Verifique se a URL está correta ou entre em
            contato com o proprietário do estabelecimento.
          </p>
        </div>
      </div>
    );
  }

  if (!menu || menu.snacks.length === 0) {
    return (
      <div className="cardapio-empty-container">
        <div className="cardapio-empty-content">
          <h1>📭 Cardápio Vazio</h1>
          <p>
            {menu?.company?.name || 'Este estabelecimento'}{' '}
            ainda não adicionou nenhum lanche ao cardápio.
          </p>
        </div>
      </div>
    );
  }

  const getDisplayPrice = snack => {
    if (snack.finalPrice) {
      return parseFloat(snack.finalPrice);
    }
    return parseFloat(snack.suggestedPrice);
  };

  return (
    <div className="cardapio-container">
      <div className="cardapio-content">
        <div className="cardapio-titulo">
          <h2>Cardápio — {menu.company.name}</h2>
        </div>
        <div className="cardapio-grid">
          {menu.snacks.map(snack => {
            const displayPrice = getDisplayPrice(snack);
            const imageUrl = getImageUrl(snack.imageUrl);

            return (
              <div key={snack.id} className="cardapio-card">
                <div className="cardapio-card-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={snack.name}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML +=
                          '<div class="cardapio-card-placeholder">🍽️</div>';
                      }}
                    />
                  ) : (
                    <div className="cardapio-card-placeholder">
                      🍽️
                    </div>
                  )}
                </div>

                <div className="cardapio-card-content">
                  <h3 className="cardapio-card-name">
                    {snack.name}
                  </h3>
                  <div className="cardapio-card-footer">
                    <span className="cardapio-card-price">
                      R$ {formatCurrency(displayPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
