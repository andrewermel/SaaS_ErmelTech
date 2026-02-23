import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.get(
        API_ENDPOINTS.AUTH.ME
      );
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiService.post(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
      }
    );
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

    // Buscar dados do usuário após login
    try {
      const userData = await apiService.get(
        API_ENDPOINTS.AUTH.ME
      );
      setUser(userData.user);
    } catch (error) {
      // Token salvo, usuário autenticado mesmo sem dados extras
    }

    setIsAuthenticated(true);
    return data;
  };

  const register = async (name, email, password) => {
    await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });

    // Após criar usuário, fazer login
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setIsAuthenticated(false);
    window.location.hash = '#/login';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider'
    );
  }
  return context;
};
