import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      setSuccess(true);
      // Navega para a home após login bem-sucedido
      setTimeout(() => {
        window.location.hash = ROUTES.SNACKS;
      }, 500);
    } catch (err) {
      setError(
        err.message ||
          'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2 className="login-title">Login</h2>

        {success && (
          <div className="message message-success">
            Login realizado com sucesso! Redirecionando...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            error={
              error && email === ''
                ? 'Email é obrigatório'
                : ''
            }
            placeholder="seu@email.com"
          />

          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            error={
              error && password === ''
                ? 'Senha é obrigatória'
                : ''
            }
            placeholder="********"
          />

          {error && (
            <div className="message message-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="register-link">
          Não tem conta?{' '}
          <a href={ROUTES.REGISTER}>Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}
