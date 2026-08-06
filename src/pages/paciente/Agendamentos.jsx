import { useEffect, useMemo, useState } from 'react';
import { Plus, X, CalendarClock } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormSelect } from '../../components/ui/FormSelect';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/mockApi';

const TABS = [
  { key: 'agendado', label: 'Próximas' },
  { key: 'concluido', label: 'Concluídas' },
  { key: 'cancelado', label: 'Canceladas' },
];

const STATUS_STYLES = {
  agendado: 'bg-light/10 text-light',
  concluido: 'bg-emerald-50 text-emerald-600',
  cancelado: 'bg-red-50 text-red-500',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function Agendamentos() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [tab, setTab] = useState('agendado');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ psicologoId: '', date: '', time: '' });

  useEffect(() => {
    async function load() {
      const p = await api.getPacienteByUserId(user.id);
      setPatient(p);
      const [apts, psi] = await Promise.all([
        p ? api.listAppointments({ patientId: p.id }) : Promise.resolve([]),
        api.listPsicologos(),
      ]);
      setAppointments(apts);
      setPsicologos(psi);
      setForm((f) => ({ ...f, psicologoId: p?.psicologoId || psi[0]?.id || '' }));
    }
    load();
  }, [user.id]);

  const filtered = useMemo(() => appointments.filter((a) => a.status === tab), [appointments, tab]);

  async function refresh() {
    if (!patient) return;
    const apts = await api.listAppointments({ patientId: patient.id });
    setAppointments(apts);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!patient || !form.date || !form.time) return;
    setSaving(true);
    try {
      const isoDate = new Date(`${form.date}T${form.time}:00`).toISOString();
      await api.createAppointment({
        patientId: patient.id,
        psicologoId: form.psicologoId,
        date: isoDate,
        duration: 50,
        type: 'Sessão individual',
      });
      await refresh();
      setShowForm(false);
      setForm((f) => ({ ...f, date: '', time: '' }));
      setTab('agendado');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id) {
    await api.cancelAppointment(id);
    await refresh();
  }

  return (
    <DashboardLayout
      title="Agendamentos"
      subtitle="Gerencie suas sessões psicológicas."
      action={
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Fechar' : 'Nova sessão'}
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <Card.Header title="Agendar nova sessão" />
          <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleCreate}>
            <FormSelect
              label="Psicólogo"
              value={form.psicologoId}
              onChange={(e) => setForm((f) => ({ ...f, psicologoId: e.target.value }))}
            >
              {psicologos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FormSelect>
            <Input
              label="Data"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
            <Input
              label="Horário"
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              required
            />
            <div className="sm:col-span-3">
              <Button type="submit" disabled={saving}>
                <CalendarClock size={16} />
                {saving ? 'Agendando...' : 'Confirmar agendamento'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-light text-white' : 'bg-white text-medium hover:text-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-sm text-medium">Nenhum agendamento nesta categoria.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((apt) => (
            <Card key={apt.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={apt.psicologo?.avatar} alt={apt.psicologo?.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-dark">{apt.type}</p>
                  <p className="text-xs text-medium">com {apt.psicologo?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-dark">{dateFormatter.format(new Date(apt.date))}</p>
                  <p className="text-xs text-medium">{timeFormatter.format(new Date(apt.date))} · {apt.duration}min</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[apt.status]}`}>
                  {apt.status}
                </span>
                {apt.status === 'agendado' && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(apt.id)}>
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
