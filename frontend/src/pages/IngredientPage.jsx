import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { apiService } from '../services/apiService';
import {
  formatCostPerGram,
  formatCurrency,
  formatWeight,
} from '../utils/formatters';
import './IngredientPage.css';

const INITIAL_FORM = { name: '', weightG: '', cost: '' };

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.get(
        API_ENDPOINTS.INGREDIENTS
      );
      setIngredients(data);
    } catch (err) {
      setError('Erro ao buscar ingredientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      window.location.hash = '#/login';
      return;
    }
    fetchIngredients();
  }, [fetchIngredients]);

  function validateForm() {
    if (!form.name.trim()) {
      setError('Nome do ingrediente é obrigatório');
      return false;
    }
    if (!form.weightG || Number(form.weightG) <= 0) {
      setError('Peso deve ser maior que zero');
      return false;
    }
    if (!form.cost || Number(form.cost) <= 0) {
      setError('Custo deve ser maior que zero');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const payload = {
      name: form.name.trim(),
      weightG: Number(form.weightG),
      cost: Number(form.cost),
    };

    try {
      if (editingId) {
        await apiService.put(
          `${API_ENDPOINTS.INGREDIENTS}/${editingId}`,
          payload
        );
      } else {
        await apiService.post(
          API_ENDPOINTS.INGREDIENTS,
          payload
        );
      }

      setForm(INITIAL_FORM);
      setEditingId(null);
      fetchIngredients();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja deletar este ingrediente?'))
      return;

    try {
      await apiService.delete(
        `${API_ENDPOINTS.INGREDIENTS}/${id}`
      );
      fetchIngredients();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(ing) {
    setEditingId(ing.id);
    setForm({
      name: ing.name,
      weightG: ing.weightG,
      cost: ing.cost,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="card ingredient-container">
      <h2 className="page-title">Ingredientes</h2>
      <p className="page-description">
        Gerencie os ingredientes com peso e custo
      </p>

      <form
        onSubmit={handleSubmit}
        className="ingredient-form"
      >
        <input
          name="name"
          placeholder="Nome do ingrediente"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="input-with-hint">
          <input
            name="weightG"
            placeholder="Peso em gramas (ex: 1000g = 1kg)"
            type="number"
            value={form.weightG}
            onChange={handleChange}
            required
            min="1"
          />
          <small className="input-hint">
            💡 Digite o peso em gramas. Exemplo: 1kg =
            1000g, 500g = 500g
          </small>
        </div>
        <input
          name="cost"
          placeholder="Custo total (R$)"
          type="number"
          step="0.01"
          value={form.cost}
          onChange={handleChange}
          required
        />
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
      ) : ingredients.length > 0 ? (
        <table className="ingredient-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th className="text-right">Peso (g)</th>
              <th className="text-right">Custo (R$)</th>
              <th className="text-right">Custo/g</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ing => (
              <tr
                key={ing.id}
                className={
                  editingId === ing.id ? 'editing' : ''
                }
              >
                <td>{ing.name}</td>
                <td className="text-right">
                  {formatWeight(ing.weightG)}
                </td>
                <td className="text-right">
                  R$ {formatCurrency(ing.cost)}
                </td>
                <td className="text-right">
                  R${' '}
                  {formatCostPerGram(
                    Number(ing.cost),
                    ing.weightG
                  )}
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(ing)}>
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id)}
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
          Nenhum ingrediente cadastrado
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
