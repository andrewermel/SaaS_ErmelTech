import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { useToast } from '../components/Toast';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import './MembersPage.css';

export default function MembersPage() {
  const { user, isAuthenticated } = useAuth();
  const { success: showSuccess, error: showError } =
    useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const companyId = user?.companyId;
  const userRole = user?.role;

  useEffect(() => {
    if (!companyId || !isAuthenticated) return;

    const fetchMembers = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_BASE_URL}/api/v1/companies/${companyId}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar membros');
        }

        const data = await response.json();
        setMembers(data);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [companyId, isAuthenticated]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Preencha o nome');
      return;
    }

    if (!email.trim()) {
      showError('Preencha o email');
      return;
    }

    if (!password.trim()) {
      showError('Preencha a senha');
      return;
    }

    if (password.length < 6) {
      showError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (userRole !== 'OWNER') {
      showError('Apenas o proprietário pode criar membros');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/v1/companies/${companyId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Erro ao criar membro'
        );
      }

      const newMember = await response.json();
      setMembers([...members, newMember]);
      const adminName = name;
      const adminEmail = email;
      setName('');
      setEmail('');
      setPassword('');
      showSuccess(
        `Admin ${adminName} criado com sucesso! Ele pode fazer login com ${adminEmail}.`
      );
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || !companyId) {
    return (
      <div className="members-container">
        <div className="card">
          <p style={{ color: '#e74c3c' }}>
            Você precisa estar autenticado para acessar esta
            página.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = userRole === 'OWNER';

  return (
    <div className="members-container">
      <div className="card members-card">
        <h2 className="members-title">
          👥 Gerenciar Membros
        </h2>

        {/* Formulário de Criação de Admin (apenas OWNER) */}
        {isOwner && (
          <div className="invite-section">
            <h3 className="invite-title">
              Criar Novo Admin
            </h3>
            <form
              onSubmit={handleSubmit}
              className="invite-form"
            >
              <Input
                type="text"
                label="Nome do Admin"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="João Silva"
              />

              <Input
                type="email"
                label="Email para Login"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@email.com"
              />

              <Input
                type="password"
                label="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
              />

              <Button
                type="submit"
                disabled={submitting}
                full
              >
                {submitting ? 'Criando...' : 'Criar Admin'}
              </Button>
            </form>
          </div>
        )}

        {/* Lista de Membros */}
        <div className="members-list-section">
          <h3 className="list-title">
            Membros ({members.length})
          </h3>

          {loading ? (
            <Loading message="Carregando membros..." />
          ) : members.length === 0 ? (
            <p className="no-members">
              Nenhum membro adicionado ainda.
            </p>
          ) : (
            <div className="members-list">
              {members.map(member => (
                <div
                  key={member.id}
                  className="member-item"
                >
                  <div className="member-info">
                    <div className="member-name">
                      {member.user.name}
                    </div>
                    <div className="member-email">
                      {member.user.email}
                    </div>
                  </div>
                  <div className="member-role-badge">
                    <span
                      className={`role-badge role-${member.role.toLowerCase()}`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações de Permissão */}
        <div className="permissions-info">
          <h4>📋 Matriz de Permissões:</h4>
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Ação</th>
                <th>OWNER</th>
                <th>ADMIN</th>
                <th>EMPLOYEE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ver dados</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Criar</td>
                <td>✅</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>Editar</td>
                <td>✅</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>Deletar</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
              </tr>
              <tr>
                <td>Convidar</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
