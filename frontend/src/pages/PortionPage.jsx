import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { apiService } from '../services/apiService';
import {
  formatCurrency,
  formatWeight,
} from '../utils/formatters';
import './PortionPage.css';

const INITIAL_FORM = {
  ingredientId: '',
  name: '',
  weightG: '',
};

export default function PortionPage() {
  const [portions, setPortions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchPortions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.get(
        API_ENDPOINTS.PORTIONS
      );
      setPortions(data);
    } catch (err) {
      setError('Erro ao buscar porções');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIngredients = useCallback(async () => {
    try {
      const data = await apiService.get(
        API_ENDPOINTS.INGREDIENTS
      );
      setIngredients(data);
    } catch (err) {
      setError('Erro ao buscar ingredientes');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      window.location.hash = '#/login';
      return;
    }
    fetchPortions();
    fetchIngredients();
  }, [fetchPortions, fetchIngredients]);

  function validateForm() {
    if (!form.ingredientId) {
      setError('Selecione um ingrediente');
      return false;
    }
    if (!form.name.trim()) {
      setError('Nome da porção é obrigatório');
      return false;
    }
    if (!form.weightG || Number(form.weightG) <= 0) {
      setError('Peso deve ser maior que zero');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const payload = {
      ingredientId: Number(form.ingredientId),
      name: form.name.trim(),
      weightG: Number(form.weightG),
    };

    try {
      if (editingId) {
        await apiService.put(
          `${API_ENDPOINTS.PORTIONS}/${editingId}`,
          payload
        );
      } else {
        await apiService.post(
          API_ENDPOINTS.PORTIONS,
          payload
        );
      }

      setForm(INITIAL_FORM);
      setEditingId(null);
      fetchPortions();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja deletar esta porção?')) return;

    try {
      await apiService.delete(
        `${API_ENDPOINTS.PORTIONS}/${id}`
      );
      fetchPortions();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(portion) {
    setEditingId(portion.id);
    setForm({
      ingredientId: portion.ingredientId,
      name: portion.name,
      weightG: portion.weightG,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="card portion-container">
      <h2 className="page-title">Porções</h2>
      <p className="page-description">
        Porções são frações de ingredientes com peso e custo
        calculado automaticamente
      </p>

      <form
        onSubmit={handleSubmit}
        className="portion-form"
      >
        <select
          name="ingredientId"
          value={form.ingredientId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o ingrediente</option>
          {ingredients.map(ing => (
            <option key={ing.id} value={ing.id}>
              {ing.name} ({formatWeight(ing.weightG)} - R${' '}
              {formatCurrency(ing.cost)})
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Nome da porção (ex: Hambúrguer 150g)"
          value={form.name}
          onChange={handleChange}
          required
        />

        <div className="input-with-hint">
          <input
            name="weightG"
            placeholder="Peso em gramas (ex: 150)"
            type="number"
            value={form.weightG}
            onChange={handleChange}
            required
            min="1"
          />
          <small className="input-hint">
            💡 Peso da porção em gramas
          </small>
        </div>

        <button type="submit">
          {editingId ? 'Atualizar' : 'Adicionar'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
          >
            Cancelar
          </button>
        )}
      </form>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : portions.length > 0 ? (
        <table className="portion-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ingrediente</th>
              <th className="text-right">Peso</th>
              <th className="text-right">Custo</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {portions.map(portion => (
              <tr key={portion.id}>
                <td>{portion.name}</td>
                <td>{portion.ingredient?.name || 'N/A'}</td>
                <td className="text-right">
                  {formatWeight(portion.weightG)}
                </td>
                <td className="text-right">
                  R$ {formatCurrency(portion.cost, 4)}
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(portion)}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(portion.id)
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          Nenhuma porção cadastrada
        </div>
      )}

      <div className="back-section">
        <a href="#/home">
          <button>← Voltar ao Menu</button>
        </a>
      </div>
    </div>
  );
}
