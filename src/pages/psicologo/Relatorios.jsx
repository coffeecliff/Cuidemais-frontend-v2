import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/mockApi';

const STATUS_COLORS = { concluido: '#8582e4', agendado: '#a18ef2', cancelado: '#d8d3f2' };
const STATUS_LABELS = { concluido: 'Concluídas', agendado: 'Agendadas', cancelado: 'Canceladas' };

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

export function Relatorios() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [apts, pts] = await Promise.all([
        api.listAppointments({ psicologoId: user.id }),
        api.listPacientes(user.id),
      ]);
      setAppointments(apts);
      setPatients(pts);
      setLoading(false);
    }
    load();
  }, [user.id]);

  const statusData = useMemo(() => {
    const counts = { concluido: 0, agendado: 0, cancelado: 0 };
    appointments.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({
      status,
      name: STATUS_LABELS[status],
      value,
    }));
  }, [appointments]);

  const monthlyData = useMemo(() => {
    const buckets = {};
    appointments.forEach((a) => {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!buckets[key]) buckets[key] = { key, date: d, sessoes: 0 };
      buckets[key].sessoes += 1;
    });
    return Object.values(buckets)
      .sort((a, b) => a.date - b.date)
      .map((b) => ({ mes: monthFormatter.format(b.date), sessoes: b.sessoes }));
  }, [appointments]);

  const patientData = useMemo(() => {
    return patients
      .map((p) => ({
        nome: p.user?.name?.split(' ')[0] ?? '—',
        sessoes: appointments.filter((a) => a.patientId === p.id).length,
      }))
      .sort((a, b) => b.sessoes - a.sessoes)
      .slice(0, 6);
  }, [patients, appointments]);

  const totalSessions = appointments.length;
  const completionRate = totalSessions
    ? Math.round(((statusData.find((s) => s.status === 'concluido')?.value ?? 0) / totalSessions) * 100)
    : 0;

  return (
    <DashboardLayout title="Relatórios" subtitle="Métricas dos seus atendimentos.">
      {loading ? (
        <p className="text-sm text-medium">Carregando...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-2xl font-bold text-dark">{totalSessions}</p>
              <p className="text-sm text-medium">Sessões totais</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-dark">{completionRate}%</p>
              <p className="text-sm text-medium">Taxa de conclusão</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-dark">{patients.length}</p>
              <p className="text-sm text-medium">Pacientes acompanhados</p>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <Card.Header title="Sessões por mês" subtitle="Evolução do volume de atendimentos" />
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3e2e5d10" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#685293' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#685293' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #3e2e5d1a', fontSize: 13 }} />
                  <Bar dataKey="sessoes" name="Sessões" fill="#8582e4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <Card.Header title="Status dos atendimentos" />
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, color: '#685293' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #3e2e5d1a', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="mt-6">
            <Card.Header title="Sessões por paciente" subtitle="Pacientes com mais atendimentos" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={patientData} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e2e5d10" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#685293' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="nome" type="category" width={90} tick={{ fontSize: 12, fill: '#685293' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #3e2e5d1a', fontSize: 13 }} />
                <Bar dataKey="sessoes" name="Sessões" fill="#3e2e5d" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
