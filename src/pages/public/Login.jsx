import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Psicólogo', email: 'psicologo@test.com', password: '123456' },
  { label: 'Paciente', email: 'paciente@test.com', password: '123456' },
];

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signIn(form.email, form.password);
      navigate(user.role === 'psicologo' ? '/psicologo' : '/paciente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account) {
    setForm({ email: account.email, password: account.password });
    setError('');
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <img src="/logo.svg" alt="Cuide+" className="mb-4 h-12 w-12" />
            <h1 className="text-2xl font-bold text-dark">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-medium">Entre para acessar sua conta no Cuide+</p>
          </div>

          <Card>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={handleChange('email')}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange('password')}
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" size="md" disabled={loading} className="mt-2 w-full">
                <LogIn size={16} />
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-medium">
            Ainda não tem conta?{' '}
            <Link to="/register" className="font-semibold text-light hover:text-medium">
              Cadastre-se
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dark/5 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-medium">
              Contas de demonstração
            </p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="flex items-center justify-between rounded-lg border border-dark/5 px-3 py-2 text-left text-xs text-medium hover:border-light hover:text-dark"
                >
                  <span className="font-medium">{account.label}</span>
                  <span className="font-mono">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
