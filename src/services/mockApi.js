// Mock backend for Cuide+ — persists everything to localStorage.
// No real network calls; every export resolves a Promise to mimic a real API.

const KEYS = {
  users: 'lunysse_users',
  patients: 'lunysse_patients',
  appointments: 'lunysse_appointments',
  session: 'lunysse_session',
};

const DELAY = 350;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY));
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function stripPassword(user) {
  if (!user) return user;
  const { password: _password, ...rest } = user;
  return rest;
}

// ---------------------------------------------------------------------------
// Seed data — created once, on first load.
// ---------------------------------------------------------------------------

function seed() {
  if (localStorage.getItem('lunysse_seeded')) return;

  const users = [
    {
      id: 'u_psi_1',
      name: 'Dr. João Silva',
      email: 'psicologo@test.com',
      password: '123456',
      role: 'psicologo',
      crp: '06/123456',
      specialty: 'Psicologia Clínica',
      bio: 'Especialista em terapia cognitivo-comportamental, com foco em ansiedade e estresse acadêmico.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2025-02-10T10:00:00.000Z',
    },
    {
      id: 'u_psi_2',
      name: 'Dra. Renata Alves',
      email: 'renata.alves@test.com',
      password: '123456',
      role: 'psicologo',
      crp: '06/654321',
      specialty: 'Psicologia Infantil',
      bio: 'Atua com crianças e adolescentes, abordagem humanista.',
      avatar: 'https://i.pravatar.cc/150?img=32',
      createdAt: '2025-03-01T10:00:00.000Z',
    },
    {
      id: 'u_pac_1',
      name: 'Maria Santos',
      email: 'paciente@test.com',
      password: '123456',
      role: 'paciente',
      phone: '(11) 98888-1234',
      birthDate: '1998-04-12',
      avatar: 'https://i.pravatar.cc/150?img=47',
      createdAt: '2025-02-15T10:00:00.000Z',
    },
    {
      id: 'u_pac_2',
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@test.com',
      password: '123456',
      role: 'paciente',
      phone: '(11) 97777-5678',
      birthDate: '2001-09-23',
      avatar: 'https://i.pravatar.cc/150?img=51',
      createdAt: '2025-03-05T10:00:00.000Z',
    },
    {
      id: 'u_pac_3',
      name: 'Ana Beatriz',
      email: 'ana.beatriz@test.com',
      password: '123456',
      role: 'paciente',
      phone: '(11) 96666-9012',
      birthDate: '1995-01-30',
      avatar: 'https://i.pravatar.cc/150?img=25',
      createdAt: '2025-03-18T10:00:00.000Z',
    },
    {
      id: 'u_pac_4',
      name: 'Pedro Henrique',
      email: 'pedro.henrique@test.com',
      password: '123456',
      role: 'paciente',
      phone: '(11) 95555-3456',
      birthDate: '2000-07-08',
      avatar: 'https://i.pravatar.cc/150?img=60',
      createdAt: '2025-04-02T10:00:00.000Z',
    },
  ];

  const patients = [
    {
      id: 'p_1',
      userId: 'u_pac_1',
      psicologoId: 'u_psi_1',
      status: 'ativo',
      startDate: '2025-02-20',
      tags: ['ansiedade', 'universitário'],
      notes: 'Iniciou acompanhamento por ansiedade relacionada à rotina acadêmica.',
    },
    {
      id: 'p_2',
      userId: 'u_pac_2',
      psicologoId: 'u_psi_1',
      status: 'ativo',
      startDate: '2025-03-10',
      tags: ['estresse', 'sono'],
      notes: 'Relata dificuldade de sono e sobrecarga de estudos.',
    },
    {
      id: 'p_3',
      userId: 'u_pac_3',
      psicologoId: 'u_psi_1',
      status: 'inativo',
      startDate: '2025-03-20',
      tags: ['autoestima'],
      notes: 'Acompanhamento pausado a pedido da paciente.',
    },
    {
      id: 'p_4',
      userId: 'u_pac_4',
      psicologoId: 'u_psi_2',
      status: 'ativo',
      startDate: '2025-04-05',
      tags: ['tdah', 'foco'],
      notes: 'Encaminhado pela coordenação pedagógica.',
    },
  ];

  const today = new Date();
  function dateOffset(days, hour) {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  }

  const appointments = [
    { id: uid('apt'), patientId: 'p_1', psicologoId: 'u_psi_1', date: dateOffset(-21, 14), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Paciente relatou melhora na rotina de sono.' },
    { id: uid('apt'), patientId: 'p_1', psicologoId: 'u_psi_1', date: dateOffset(-14, 14), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Trabalhadas técnicas de respiração para crises de ansiedade.' },
    { id: uid('apt'), patientId: 'p_1', psicologoId: 'u_psi_1', date: dateOffset(-7, 14), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Boa evolução, redução de sintomas relatada.' },
    { id: uid('apt'), patientId: 'p_1', psicologoId: 'u_psi_1', date: dateOffset(2, 14), duration: 50, type: 'Sessão individual', status: 'agendado', notes: '' },
    { id: uid('apt'), patientId: 'p_2', psicologoId: 'u_psi_1', date: dateOffset(-10, 10), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Discutida organização de estudos.' },
    { id: uid('apt'), patientId: 'p_2', psicologoId: 'u_psi_1', date: dateOffset(-3, 10), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Melhora parcial no padrão de sono.' },
    { id: uid('apt'), patientId: 'p_2', psicologoId: 'u_psi_1', date: dateOffset(4, 10), duration: 50, type: 'Sessão individual', status: 'agendado', notes: '' },
    { id: uid('apt'), patientId: 'p_3', psicologoId: 'u_psi_1', date: dateOffset(-30, 16), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Primeira sessão de acolhimento.' },
    { id: uid('apt'), patientId: 'p_3', psicologoId: 'u_psi_1', date: dateOffset(-16, 16), duration: 50, type: 'Sessão individual', status: 'cancelado', notes: 'Paciente cancelou por motivo pessoal.' },
    { id: uid('apt'), patientId: 'p_4', psicologoId: 'u_psi_2', date: dateOffset(-5, 9), duration: 50, type: 'Sessão individual', status: 'concluido', notes: 'Avaliação inicial de foco e atenção.' },
    { id: uid('apt'), patientId: 'p_4', psicologoId: 'u_psi_2', date: dateOffset(5, 9), duration: 50, type: 'Sessão individual', status: 'agendado', notes: '' },
  ];

  write(KEYS.users, users);
  write(KEYS.patients, patients);
  write(KEYS.appointments, appointments);
  localStorage.setItem('lunysse_seeded', '1');
}

seed();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(email, password) {
  const users = read(KEYS.users);
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password,
  );
  if (!user) {
    await delay(null);
    throw new Error('E-mail ou senha inválidos.');
  }
  const safeUser = stripPassword(user);
  localStorage.setItem(KEYS.session, JSON.stringify(safeUser));
  return delay(safeUser);
}

export async function register({ name, email, password, role = 'paciente', phone, birthDate, specialty, crp }) {
  const users = read(KEYS.users);
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('Já existe uma conta com este e-mail.');
  }

  const newUser = {
    id: uid('u'),
    name,
    email,
    password,
    role,
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    createdAt: new Date().toISOString(),
    ...(role === 'paciente' ? { phone: phone || '', birthDate: birthDate || '' } : { specialty: specialty || '', crp: crp || '', bio: '' }),
  };

  users.push(newUser);
  write(KEYS.users, users);

  if (role === 'paciente') {
    const patients = read(KEYS.patients);
    const psicologos = users.filter((u) => u.role === 'psicologo');
    patients.push({
      id: uid('p'),
      userId: newUser.id,
      psicologoId: psicologos[0]?.id ?? null,
      status: 'ativo',
      startDate: new Date().toISOString().slice(0, 10),
      tags: [],
      notes: '',
    });
    write(KEYS.patients, patients);
  }

  const safeUser = stripPassword(newUser);
  localStorage.setItem(KEYS.session, JSON.stringify(safeUser));
  return delay(safeUser);
}

export function logout() {
  localStorage.removeItem(KEYS.session);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Psicólogos / Pacientes
// ---------------------------------------------------------------------------

export async function listPsicologos() {
  const users = read(KEYS.users);
  return delay(users.filter((u) => u.role === 'psicologo').map(stripPassword));
}

export async function listPacientes(psicologoId) {
  const users = read(KEYS.users);
  const patients = read(KEYS.patients);
  const filtered = psicologoId ? patients.filter((p) => p.psicologoId === psicologoId) : patients;
  const merged = filtered.map((p) => ({
    ...p,
    user: stripPassword(users.find((u) => u.id === p.userId)),
  }));
  return delay(merged);
}

export async function getPacienteByUserId(userId) {
  const users = read(KEYS.users);
  const patients = read(KEYS.patients);
  const patient = patients.find((p) => p.userId === userId);
  if (!patient) return delay(null);
  return delay({ ...patient, user: stripPassword(users.find((u) => u.id === patient.userId)) });
}

export async function getPaciente(patientId) {
  const users = read(KEYS.users);
  const patients = read(KEYS.patients);
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return delay(null);
  return delay({ ...patient, user: stripPassword(users.find((u) => u.id === patient.userId)) });
}

export async function updatePaciente(patientId, data) {
  const patients = read(KEYS.patients);
  const idx = patients.findIndex((p) => p.id === patientId);
  if (idx === -1) throw new Error('Paciente não encontrado.');
  patients[idx] = { ...patients[idx], ...data };
  write(KEYS.patients, patients);
  return delay(patients[idx]);
}

// ---------------------------------------------------------------------------
// Agendamentos
// ---------------------------------------------------------------------------

export async function listAppointments(filter = {}) {
  const appointments = read(KEYS.appointments);
  const patients = read(KEYS.patients);
  const users = read(KEYS.users);

  let result = appointments;
  if (filter.patientId) result = result.filter((a) => a.patientId === filter.patientId);
  if (filter.psicologoId) result = result.filter((a) => a.psicologoId === filter.psicologoId);
  if (filter.status) result = result.filter((a) => a.status === filter.status);

  const merged = result
    .map((a) => {
      const patient = patients.find((p) => p.id === a.patientId);
      return {
        ...a,
        patient: patient ? { ...patient, user: stripPassword(users.find((u) => u.id === patient.userId)) } : null,
        psicologo: stripPassword(users.find((u) => u.id === a.psicologoId)),
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return delay(merged);
}

export async function createAppointment(data) {
  const appointments = read(KEYS.appointments);
  const newAppointment = {
    id: uid('apt'),
    status: 'agendado',
    duration: 50,
    notes: '',
    ...data,
  };
  appointments.push(newAppointment);
  write(KEYS.appointments, appointments);
  return delay(newAppointment);
}

export async function updateAppointment(id, data) {
  const appointments = read(KEYS.appointments);
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Agendamento não encontrado.');
  appointments[idx] = { ...appointments[idx], ...data };
  write(KEYS.appointments, appointments);
  return delay(appointments[idx]);
}

export async function cancelAppointment(id) {
  return updateAppointment(id, { status: 'cancelado' });
}

export async function completeAppointment(id, notes = '') {
  return updateAppointment(id, { status: 'concluido', notes });
}

export async function deleteAppointment(id) {
  const appointments = read(KEYS.appointments);
  write(KEYS.appointments, appointments.filter((a) => a.id !== id));
  return delay(true);
}
