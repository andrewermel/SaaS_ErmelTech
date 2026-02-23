import { API_BASE_URL } from '../constants';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    // Se não for FormData, adicionar Content-Type
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(
          error.message || `Erro ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    const body =
      data instanceof FormData
        ? data
        : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, data) {
    const body =
      data instanceof FormData
        ? data
        : JSON.stringify(data);
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
