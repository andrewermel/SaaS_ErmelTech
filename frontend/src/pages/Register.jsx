import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validação de email
  const isValidEmail = email => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const hasEmailError =
    email.length > 0 && !isValidEmail(email);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Validações locais
    if (!name.trim()) {
      setError('Preencha seu nome');
      return;
    }

    if (!companyName.trim()) {
      setError('Preencha o nome da lanchonete');
      return;
    }

    if (!email.trim()) {
      setError('Preencha seu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido. Use um email válido.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, companyName);
      setSuccess(true);
      setTimeout(() => {
        window.location.hash = ROUTES.SNACKS;
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.message ||
        'Erro ao cadastrar. Tente novamente.';

      // Mensagem mais clara para email duplicado
      if (
        errorMsg.includes('already exists') ||
        errorMsg.includes('User already exists')
      ) {
        setError(
          'Este email já foi cadastrado. Use outro email ou faça login.'
        );
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card register-card">
        <h2 className="register-title">Cadastro</h2>

        {success && (
          <div className="message message-success">
            Cadastro realizado com sucesso!
            Redirecionando...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <Input
            type="text"
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Seu nome completo"
          />

          <Input
            type="text"
            label="Nome da sua lanchonete"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
            placeholder="Ex: Lanches do João"
          />

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            error={
              hasEmailError
                ? 'Email inválido. Use um email válido.'
                : ''
            }
          />

          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="********"
          />

          <Input
            type="password"
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={e =>
              setConfirmPassword(e.target.value)
            }
            required
            placeholder="********"
            error={
              confirmPassword &&
              password !== confirmPassword
                ? 'As senhas não coincidem'
                : ''
            }
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
            disabled={
              loading ||
              hasEmailError ||
              !name.trim() ||
              !companyName.trim() ||
              !email.trim() ||
              password !== confirmPassword ||
              password.length < 6
            }
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="login-link">
          Já tem conta?{' '}
          <a href={ROUTES.LOGIN}>Faça login</a>
        </div>
      </div>
    </div>
  );
}
