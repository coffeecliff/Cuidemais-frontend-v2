import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { FormSelect } from '../../components/ui/FormSelect';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'paciente',
  phone: '',
  birthDate: '',
  specialty: '',
  crp: '',
};

export function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
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
      const user = await signUp(form);
      navigate(user.role === 'psicologo' ? '/psicologo' : '/paciente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <img src="/logo.svg" alt="Cuide+" className="mb-4 h-12 w-42" />
            <h1 className="text-2xl font-bold text-dark">Crie sua conta</h1>
            <p className="mt-1 text-sm text-medium">Junte-se à comunidade de cuidado do Cuide+</p>
          </div>

          <Card>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FormSelect label="Eu sou" value={form.role} onChange={handleChange('role')}>
                <option value="paciente">Paciente</option>
                <option value="psicologo">Psicólogo(a) voluntário(a)</option>
              </FormSelect>

              <Input label="Nome completo" placeholder="Seu nome" value={form.name} onChange={handleChange('name')} required />
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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                value={form.password}
                onChange={handleChange('password')}
                required
              />

              {form.role === 'paciente' ? (
                <>
                  <Input label="Telefone" placeholder="(11) 90000-0000" value={form.phone} onChange={handleChange('phone')} />
                  <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={handleChange('birthDate')} />
                </>
              ) : (
                <>
                  <Input label="Especialidade" placeholder="Ex: Psicologia Clínica" value={form.specialty} onChange={handleChange('specialty')} />
                  <Input label="CRP" placeholder="Ex: 06/123456" value={form.crp} onChange={handleChange('crp')} />
                </>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" size="md" disabled={loading} className="mt-2 w-full">
                <UserPlus size={16} />
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-medium">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-light hover:text-medium">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
