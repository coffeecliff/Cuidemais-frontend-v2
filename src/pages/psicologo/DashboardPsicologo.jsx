import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarClock, CalendarCheck, ArrowRight } from 'lucide-react';
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

export function DashboardPsicologo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const [pts, apts] = await Promise.all([
        api.listPacientes(user.id),
        api.listAppointments({ psicologoId: user.id }),
      ]);
      if (!active) return;
      setPatients(pts);
      setAppointments(apts);
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
  const activePatients = patients.filter((p) => p.status === 'ativo');

  return (
    <DashboardLayout
      title={`Olá, ${firstName(user.name)}`}
      subtitle="Aqui está um resumo da sua agenda de atendimentos."
      action={
        <Button to="/psicologo/pacientes">
          <Users size={16} />
          Ver pacientes
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Pacientes ativos" value={activePatients.length} />
        <StatCard icon={CalendarClock} label="Próximas sessões" value={upcoming.length} />
        <StatCard icon={CalendarCheck} label="Sessões concluídas" value={done.length} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-8"
      >
        <Card>
          <Card.Header
            title="Próximos atendimentos"
            action={
              <Button to="/psicologo/relatorios" variant="ghost" size="sm">
                Ver relatórios <ArrowRight size={14} />
              </Button>
            }
          />
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-medium">Nenhuma sessão agendada.</p>
          ) : (
            <div className="flex flex-col divide-y divide-dark/5">
              {upcoming.slice(0, 6).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={apt.patient?.user?.avatar}
                      alt={apt.patient?.user?.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-dark">{apt.patient?.user?.name}</p>
                      <p className="text-xs text-medium">{apt.type}</p>
                    </div>
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
    </DashboardLayout>
  );
}
