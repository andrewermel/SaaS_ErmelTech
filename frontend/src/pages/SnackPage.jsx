import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { ImageUpload } from '../components/ImageUpload';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import {
  API_ENDPOINTS,
  IMAGE_CONFIG,
  ROUTES,
} from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useResource } from '../hooks/useApi';
import { apiService } from '../services/apiService';
import {
  formatCurrency,
  formatWeight,
} from '../utils/formatters';
import './SnackPage.css';

export default function SnackPage() {
  const { isAuthenticated } = useAuth();
  const {
    data: snacks,
    loading,
    error,
    fetchAll,
    create,
    remove,
  } = useResource(API_ENDPOINTS.SNACKS);
  const { data: portions, fetchAll: fetchPortions } =
    useResource(API_ENDPOINTS.PORTIONS);

  const [snackName, setSnackName] = useState('');
  const [snackImage, setSnackImage] = useState(null);
  const [snackFinalPrice, setSnackFinalPrice] =
    useState('');
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [selectedPortionId, setSelectedPortionId] =
    useState('');
  const [portionsToAdd, setPortionsToAdd] = useState([]);
  const [portionQuantities, setPortionQuantities] =
    useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingSnackId, setEditingSnackId] =
    useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = ROUTES.LOGIN;
      return;
    }
    fetchAll();
    fetchPortions();
  }, [isAuthenticated]);

  const handleAddPortionToList = e => {
    e.preventDefault();
    if (!selectedPortionId) return;

    const portion = portions.find(
      p => p.id === Number(selectedPortionId)
    );
    if (portion) {
      setPortionsToAdd([...portionsToAdd, portion]);
      setSelectedPortionId('');
    }
  };

  const handleTogglePortion = portionId => {
    setPortionQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[portionId]) {
        delete newQuantities[portionId];
      } else {
        newQuantities[portionId] = 1;
      }
      return newQuantities;
    });
  };

  const handleChangeQuantity = (portionId, quantity) => {
    const q = Math.max(0, parseInt(quantity) || 0);
    setPortionQuantities(prev => {
      const newQuantities = { ...prev };
      if (q === 0) {
        delete newQuantities[portionId];
      } else {
        newQuantities[portionId] = q;
      }
      return newQuantities;
    });
  };

  const getPortionsArrayFromQuantities = () => {
    const result = [];
    Object.entries(portionQuantities).forEach(
      ([portionId, quantity]) => {
        const portion = portions.find(
          p => p.id === Number(portionId)
        );
        if (portion) {
          for (let i = 0; i < quantity; i++) {
            result.push(portion);
          }
        }
      }
    );
    return result;
  };

  const handleCreateSnack = async e => {
    e.preventDefault();
    setActionError('');

    if (!snackName.trim()) {
      setActionError('Nome do lanche é obrigatório');
      return;
    }

    setActionLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', snackName.trim());
      formData.append('finalPrice', snackFinalPrice || '');

      if (snackImage) {
        if (typeof snackImage === 'string') {
          formData.append('imageUrl', snackImage);
        } else {
          formData.append('image', snackImage);
        }
      }

      const newSnack = await apiService.post(
        API_ENDPOINTS.SNACKS,
        formData
      );

      if (
        Object.keys(portionQuantities).length > 0 &&
        newSnack?.id
      ) {
        const portionsArray =
          getPortionsArrayFromQuantities();
        for (const portion of portionsArray) {
          await apiService.post(
            `${API_ENDPOINTS.SNACKS}/${newSnack.id}/portions/${portion.id}`,
            { portionId: portion.id }
          );
        }
      }

      setSnackName('');
      setSnackImage(null);
      setSnackFinalPrice('');
      setPortionsToAdd([]);
      setPortionQuantities({});
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSnack = snack => {
    setIsEditing(true);
    setEditingSnackId(snack.id);
    setSnackName(snack.name);
    setSnackImage(snack.imageUrl);
    setSnackFinalPrice(snack.finalPrice || '');
    if (snack.portions && snack.portions.length > 0) {
      const quantities = {};
      snack.portions.forEach(portion => {
        quantities[portion.id] =
          (quantities[portion.id] || 0) + 1;
      });
      setPortionQuantities(quantities);
    } else {
      setPortionQuantities({});
    }
    setPortionsToAdd([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSnackId(null);
    setSnackName('');
    setSnackImage(null);
    setSnackFinalPrice('');
    setPortionsToAdd([]);
    setPortionQuantities({});
    setActionError('');
  };

  const handleUpdateSnack = async e => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);

    try {
      const currentSnack = await apiService.get(
        `${API_ENDPOINTS.SNACKS}/${editingSnackId}`
      );
      const currentPortions = currentSnack.portions || [];

      for (const currentPortion of currentPortions) {
        await apiService.delete(
          `${API_ENDPOINTS.SNACKS}/${editingSnackId}/portions/${currentPortion.id}`
        );
      }

      const portionsArray =
        getPortionsArrayFromQuantities();
      for (const portion of portionsArray) {
        await apiService.post(
          `${API_ENDPOINTS.SNACKS}/${editingSnackId}/portions/${portion.id}`,
          { portionId: portion.id }
        );
      }

      handleCancelEdit();
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSnack = async id => {
    if (!confirm('Deseja deletar este lanche?')) return;

    try {
      await remove(id);
      if (selectedSnack?.id === id) setSelectedSnack(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleViewDetails = async snackId => {
    try {
      const data = await apiService.get(
        `${API_ENDPOINTS.SNACKS}/${snackId}`
      );
      setSelectedSnack(data);
      setActionError('');
    } catch (err) {
      setActionError('Erro ao buscar detalhes do lanche');
    }
  };

  const handleAddPortion = async e => {
    e.preventDefault();
    if (!selectedSnack || !selectedPortionId) return;

    setActionLoading(true);
    try {
      await apiService.post(
        `${API_ENDPOINTS.SNACKS}/${selectedSnack.id}/portions/${selectedPortionId}`,
        { portionId: Number(selectedPortionId) }
      );

      setSelectedPortionId('');
      handleViewDetails(selectedSnack.id);
      fetchAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemovePortion = async portionId => {
    if (
      !selectedSnack ||
      !confirm('Remover esta porção do lanche?')
    )
      return;

    setActionLoading(true);
    try {
      await apiService.delete(
        `${API_ENDPOINTS.SNACKS}/${selectedSnack.id}/portions/${portionId}`
      );

      handleViewDetails(selectedSnack.id);
      fetchAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('http')
      ? imageUrl
      : `${IMAGE_CONFIG.UPLOAD_PATH}${imageUrl}`;
  };

  return (
    <div className="card snack-container">
      <h2 className="page-title">Lanches</h2>
      <p className="page-description">
        Monte lanches com porções e veja o custo total e
        preço sugerido
      </p>

      {isEditing && (
        <div className="edit-mode-banner">
          ✏️ Editando lanche - Faça as alterações e clique
          em Salvar
        </div>
      )}

      <div className="help-message">
        <strong>💡 Como criar um lanche:</strong>
        <br />
        1️⃣ Preencha o nome do lanche e adicione uma imagem
        (opcional)
        <br />
        2️⃣ Adicione as porções que fazem parte do lanche
        <br />
        3️⃣ Clique em "Criar Lanche" para salvar com as
        porções
      </div>

      <form
        onSubmit={
          isEditing ? handleUpdateSnack : handleCreateSnack
        }
        className="snack-form"
      >
        <div className="form-row">
          <Input
            type="text"
            placeholder="Nome do lanche"
            value={snackName}
            onChange={e => setSnackName(e.target.value)}
            required
          />
        </div>

        <ImageUpload
          value={snackImage}
          onChange={setSnackImage}
          label="Imagem do Lanche (opcional)"
          error={actionError}
        />

        <div className="form-row">
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço final (deixe em branco para usar o preço sugerido)"
            value={snackFinalPrice}
            onChange={e =>
              setSnackFinalPrice(e.target.value)
            }
            label="Preço Final (Opcional)"
          />
        </div>

        {portions && portions.length > 0 ? (
          <>
            <div className="add-portion-to-form">
              <h4>📋 Selecione as Porções:</h4>
              <p className="portions-help">
                Marque as porções e ajuste a quantidade para
                cada uma
              </p>

              <div className="portions-checkbox-grid">
                {portions.map(portion => (
                  <div
                    key={portion.id}
                    className="portion-checkbox-item"
                  >
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={
                          !!portionQuantities[portion.id]
                        }
                        onChange={() =>
                          handleTogglePortion(portion.id)
                        }
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">
                        <strong>{portion.name}</strong>
                        <small>
                          {formatWeight(portion.weightG)} •
                          R$
                          {formatCurrency(portion.cost, 4)}
                        </small>
                      </span>
                    </label>

                    {portionQuantities[portion.id] && (
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeQuantity(
                              portion.id,
                              portionQuantities[
                                portion.id
                              ] - 1
                            )
                          }
                          className="qty-btn"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={
                            portionQuantities[portion.id]
                          }
                          onChange={e =>
                            handleChangeQuantity(
                              portion.id,
                              e.target.value
                            )
                          }
                          className="qty-input"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeQuantity(
                              portion.id,
                              portionQuantities[
                                portion.id
                              ] + 1
                            )
                          }
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {Object.keys(portionQuantities).length >
                0 && (
                <div className="portions-summary">
                  <h5>📊 Resumo das Porções:</h5>
                  <div className="summary-list">
                    {Object.entries(portionQuantities).map(
                      ([portionId, quantity]) => {
                        const portion = portions.find(
                          p => p.id === Number(portionId)
                        );
                        if (!portion) return null;
                        const totalCost =
                          Number(portion.cost) * quantity;
                        const totalWeight =
                          Number(portion.weightG) *
                          quantity;

                        return (
                          <div
                            key={portionId}
                            className="summary-item"
                          >
                            <span>
                              {quantity}x {portion.name}
                            </span>
                            <span className="summary-values">
                              {formatWeight(totalWeight)} •
                              R$
                              {formatCurrency(totalCost, 4)}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="total-summary">
                    <div className="summary-line">
                      <strong>Total de Porções:</strong>
                      <span>
                        {Object.values(
                          portionQuantities
                        ).reduce((a, b) => a + b, 0)}
                      </span>
                    </div>
                    <div className="summary-line">
                      <strong>Peso Total:</strong>
                      <span>
                        {formatWeight(
                          Object.entries(
                            portionQuantities
                          ).reduce(
                            (sum, [portionId, qty]) => {
                              const portion = portions.find(
                                p =>
                                  p.id === Number(portionId)
                              );
                              return (
                                sum +
                                (portion
                                  ? Number(
                                      portion.weightG
                                    ) * qty
                                  : 0)
                              );
                            },
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div className="summary-line">
                      <strong>Custo Total:</strong>
                      <span className="cost">
                        R$
                        {formatCurrency(
                          Object.entries(
                            portionQuantities
                          ).reduce(
                            (sum, [portionId, qty]) => {
                              const portion = portions.find(
                                p =>
                                  p.id === Number(portionId)
                              );
                              return (
                                sum +
                                (portion
                                  ? Number(portion.cost) *
                                    qty
                                  : 0)
                              );
                            },
                            0
                          ),
                          4
                        )}
                      </span>
                    </div>
                    <div className="summary-line highlight">
                      <strong>Preço Sugerido:</strong>
                      <span className="price">
                        R$
                        {formatCurrency(
                          Object.entries(
                            portionQuantities
                          ).reduce(
                            (sum, [portionId, qty]) => {
                              const portion = portions.find(
                                p =>
                                  p.id === Number(portionId)
                              );
                              return (
                                sum +
                                (portion
                                  ? Number(portion.cost) *
                                    qty
                                  : 0)
                              );
                            },
                            0
                          ) * 2,
                          4
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-portions-warning">
            ⚠️ Você precisa cadastrar porções primeiro!
            <br />
            <Button
              type="button"
              onClick={() =>
                (window.location.hash = ROUTES.PORTIONS)
              }
              variant="secondary"
              style={{ marginTop: '8px' }}
            >
              Ir para Porções
            </Button>
          </div>
        )}

        <div className="form-actions">
          {isEditing && (
            <Button
              type="button"
              onClick={handleCancelEdit}
              variant="secondary"
              fullWidth
            >
              ❌ Cancelar
            </Button>
          )}
          <Button
            type="submit"
            fullWidth
            loading={actionLoading}
            disabled={!snackName.trim()}
          >
            {isEditing
              ? '💾 Salvar Alterações'
              : '✨ Criar Lanche'}
          </Button>
        </div>
      </form>

      {(error || actionError) && (
        <div className="error-message">
          {error || actionError}
        </div>
      )}

      <div className="snack-layout">
        {/* Lista de Lanches */}
        <div className="snack-list">
          <h3>Lanches Cadastrados</h3>
          {loading ? (
            <Loading message="Carregando lanches..." />
          ) : snacks.length === 0 ? (
            <div className="empty-state">
              <p>📋 Nenhum lanche cadastrado ainda.</p>
              <p>
                Crie seu primeiro lanche no formulário
                acima!
              </p>
            </div>
          ) : (
            <div className="snack-cards">
              {snacks.map(snack => (
                <div
                  key={snack.id}
                  className={`snack-card ${
                    selectedSnack?.id === snack.id
                      ? 'selected'
                      : ''
                  }`}
                >
                  <div className="snack-card-header">
                    <div className="snack-card-info">
                      <div className="snack-card-title">
                        {snack.name}
                      </div>
                      <div className="snack-card-meta">
                        💰 Custo: R${' '}
                        {formatCurrency(snack.totalCost)}
                      </div>
                      <div className="snack-card-meta">
                        💵 Preço sugerido: R${' '}
                        {formatCurrency(
                          snack.suggestedPrice
                        )}
                      </div>
                      <div className="snack-card-meta">
                        📦 {snack.portions?.length || 0}{' '}
                        porções (
                        {formatWeight(
                          snack.totalWeightG || 0
                        )}
                        )
                      </div>
                    </div>
                    <div className="snack-card-actions">
                      <Button
                        onClick={() =>
                          handleViewDetails(snack.id)
                        }
                        variant="secondary"
                        title="Ver detalhes e adicionar porções"
                      >
                        📋
                      </Button>
                      <Button
                        onClick={() =>
                          handleEditSnack(snack)
                        }
                        variant="primary"
                        title="Editar lanche"
                      >
                        ✏️
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeleteSnack(snack.id)
                        }
                        variant="danger"
                        title="Deletar lanche"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes do Lanche Selecionado */}
        {selectedSnack && (
          <div className="snack-details">
            <h3>{selectedSnack.name}</h3>

            {selectedSnack.imageUrl && (
              <div className="snack-image-container">
                <img
                  src={getImageUrl(selectedSnack.imageUrl)}
                  alt={selectedSnack.name}
                  className="snack-image"
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="snack-summary">
              <div className="snack-summary-item">
                <strong>Custo Total:</strong> R${' '}
                {formatCurrency(selectedSnack.totalCost)}
              </div>
              <div className="snack-summary-item">
                <strong>Peso Total:</strong>{' '}
                {formatWeight(selectedSnack.totalWeightG)}
              </div>
              <div className="snack-summary-item">
                <strong>Preço Sugerido:</strong> R${' '}
                {formatCurrency(
                  selectedSnack.suggestedPrice
                )}
              </div>
            </div>

            <div className="portions-section">
              <h4>Porções no Lanche:</h4>
              {selectedSnack.portions?.length > 0 ? (
                <ul className="portions-list">
                  {selectedSnack.portions.map(portion => (
                    <li
                      key={portion.id}
                      className="portion-item"
                    >
                      <span className="portion-info">
                        {portion.quantity > 1 && (
                          <strong>
                            x{portion.quantity}{' '}
                          </strong>
                        )}
                        {portion.name} (
                        {formatWeight(
                          portion.weightG *
                            (portion.quantity || 1)
                        )}{' '}
                        - R${' '}
                        {formatCurrency(
                          Number(portion.cost) *
                            (portion.quantity || 1),
                          4
                        )}
                        )
                      </span>
                      <Button
                        onClick={() =>
                          handleRemovePortion(portion.id)
                        }
                        variant="danger"
                        loading={actionLoading}
                      >
                        ❌
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-portions">
                  Nenhuma porção adicionada
                </p>
              )}

              {portions && portions.length > 0 ? (
                <form
                  onSubmit={handleAddPortion}
                  className="add-portion-form"
                >
                  <select
                    value={selectedPortionId}
                    onChange={e =>
                      setSelectedPortionId(e.target.value)
                    }
                    required
                    className="input"
                  >
                    <option value="">
                      Selecione uma porção
                    </option>
                    {portions.map(portion => (
                      <option
                        key={portion.id}
                        value={portion.id}
                      >
                        {portion.name} (
                        {formatWeight(portion.weightG)} - R${' '}
                        {formatCurrency(portion.cost, 4)})
                      </option>
                    ))}
                  </select>
                  <Button
                    type="submit"
                    loading={actionLoading}
                  >
                    Adicionar
                  </Button>
                </form>
              ) : (
                <div className="no-portions-warning">
                  ⚠️ Você precisa cadastrar porções
                  primeiro!
                  <br />
                  <Button
                    onClick={() =>
                      (window.location.hash =
                        ROUTES.PORTIONS)
                    }
                    variant="secondary"
                    style={{ marginTop: '8px' }}
                  >
                    Ir para Porções
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
