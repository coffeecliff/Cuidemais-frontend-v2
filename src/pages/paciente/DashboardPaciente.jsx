import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CalendarClock, UserRound, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/mockApi';
import { firstName } from '../../utils/format';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-light/15 text-light">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark">{value}</p>
        <p className="text-sm text-medium">{label}</p>
      </div>
    </Card>
  );
}

export function DashboardPaciente() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const p = await api.getPacienteByUserId(user.id);
      if (!active) return;
      if (p) {
        const apts = await api.listAppointments({ patientId: p.id });
        if (active) setAppointments(apts);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user.id]);

  if (loading) {
    return (
      <DashboardLayout title={`Olá, ${firstName(user.name)}`}>
        <p className="text-sm text-medium">Carregando...</p>
      </DashboardLayout>
    );
  }

  const now = new Date();
  const upcoming = appointments.filter((a) => a.status === 'agendado' && new Date(a.date) >= now);
  const done = appointments.filter((a) => a.status === 'concluido');
  const psicologo = upcoming[0]?.psicologo ?? done[0]?.psicologo ?? null;

  return (
    <DashboardLayout
      title={`Olá, ${firstName(user.name)}`}
      subtitle="Aqui está um resumo do seu acompanhamento."
      action={
        <Button to="/paciente/agendamentos">
          <CalendarClock size={16} />
          Agendar sessão
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarClock} label="Próximas sessões" value={upcoming.length} />
        <StatCard icon={CalendarCheck} label="Sessões concluídas" value={done.length} />
        <StatCard icon={UserRound} label="Psicólogo responsável" value={psicologo ? psicologo.name.split(' ').slice(0, 2).join(' ') : '—'} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2"
        >
          <Card>
            <Card.Header
              title="Próximas sessões"
              action={
                <Button to="/paciente/agendamentos" variant="ghost" size="sm">
                  Ver todas <ArrowRight size={14} />
                </Button>
              }
            />
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-sm text-medium">Você não tem sessões agendadas.</p>
            ) : (
              <div className="flex flex-col divide-y divide-dark/5">
                {upcoming.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-dark">{apt.type}</p>
                      <p className="text-xs text-medium">com {apt.psicologo?.name}</p>
                    </div>
                    <span className="rounded-full bg-light/10 px-3 py-1 text-xs font-medium text-light">
                      {dateFormatter.format(new Date(apt.date))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Card>
            <Card.Header title="Meu psicólogo" />
            {psicologo ? (
              <div className="flex items-center gap-3">
                <img src={psicologo.avatar} alt={psicologo.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-dark">{psicologo.name}</p>
                  <p className="text-xs text-medium">{psicologo.specialty}</p>
                  <p className="text-xs text-medium">{psicologo.crp}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-medium">Nenhum psicólogo vinculado ainda.</p>
            )}
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
