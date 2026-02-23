import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async apiCall => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

export const useResource = endpoint => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.get(endpoint);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const create = useCallback(
    async newData => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.post(
          endpoint,
          newData
        );
        setData(prev => [...prev, result]);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const update = useCallback(
    async (id, updatedData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.put(
          `${endpoint}/${id}`,
          updatedData
        );
        setData(prev =>
          prev.map(item => (item.id === id ? result : item))
        );
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const remove = useCallback(
    async id => {
      setLoading(true);
      setError(null);
      try {
        await apiService.delete(`${endpoint}/${id}`);
        setData(prev =>
          prev.filter(item => item.id !== id)
        );
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
};
