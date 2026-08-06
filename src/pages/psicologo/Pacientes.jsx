import { useEffect, useMemo, useState } from 'react';
import { Search, Phone, Cake, Tag } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/mockApi';

const STATUS_STYLES = {
  ativo: 'bg-emerald-50 text-emerald-600',
  inativo: 'bg-dark/5 text-medium',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export function Pacientes() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [pts, apts] = await Promise.all([
        api.listPacientes(user.id),
        api.listAppointments({ psicologoId: user.id }),
      ]);
      setPatients(pts);
      setAppointments(apts);
      setSelectedId(pts[0]?.id ?? null);
      setLoading(false);
    }
    load();
  }, [user.id]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((p) => p.user?.name.toLowerCase().includes(term));
  }, [patients, search]);

  const selected = patients.find((p) => p.id === selectedId) ?? null;
  const selectedAppointments = appointments
    .filter((a) => a.patientId === selectedId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <DashboardLayout title="Pacientes" subtitle="Acompanhe os pacientes sob sua responsabilidade.">
      {loading ? (
        <p className="text-sm text-medium">Carregando...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-medium" size={16} />
              <Input
                placeholder="Buscar paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11"
              />
            </div>

            <div className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <Card>
                  <p className="py-4 text-center text-sm text-medium">Nenhum paciente encontrado.</p>
                </Card>
              )}
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex items-center gap-3 rounded-2xl border border-l-4 bg-white px-4 py-3 text-left transition-colors ${
                    selectedId === p.id
                      ? 'border-light border-l-accent'
                      : 'border-dark/5 border-l-transparent hover:border-light/50 hover:bg-accent/5'
                  }`}
                >
                  <img src={p.user?.avatar} alt={p.user?.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-dark">{p.user?.name}</p>
                    <p className="truncate text-xs text-medium">Desde {dateFormatter.format(new Date(p.startDate))}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status]}`}>
                    {p.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <Card>
                <div className="flex items-center gap-4">
                  <img src={selected.user?.avatar} alt={selected.user?.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h2 className="text-lg font-bold text-dark">{selected.user?.name}</h2>
                    <p className="text-sm text-medium">{selected.user?.email}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-medium">
                    <Phone size={15} /> {selected.user?.phone || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-medium">
                    <Cake size={15} /> {selected.user?.birthDate ? dateFormatter.format(new Date(selected.user.birthDate)) : 'Não informado'}
                  </div>
                </div>

                {selected.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-light/10 px-3 py-1 text-xs font-medium text-light">
                        <Tag size={11} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {selected.notes && (
                  <p className="mt-4 rounded-xl bg-background p-4 text-sm leading-relaxed text-medium">{selected.notes}</p>
                )}

                <Card.Header title="Histórico de sessões" className="mt-8" />
                {selectedAppointments.length === 0 ? (
                  <p className="text-sm text-medium">Nenhuma sessão registrada ainda.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-dark/5">
                    {selectedAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between gap-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-dark">{apt.type}</p>
                          {apt.notes && <p className="mt-0.5 text-xs text-medium">{apt.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-dark">{dateFormatter.format(new Date(apt.date))}</p>
                          <span className="text-xs capitalize text-medium">{apt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card>
                <p className="py-6 text-center text-sm text-medium">Selecione um paciente para ver os detalhes.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
