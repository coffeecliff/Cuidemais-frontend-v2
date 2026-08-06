import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { Home } from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';

import { DashboardPaciente } from '../pages/paciente/DashboardPaciente';
import { Agendamentos } from '../pages/paciente/Agendamentos';

import { DashboardPsicologo } from '../pages/psicologo/DashboardPsicologo';
import { Pacientes } from '../pages/psicologo/Pacientes';
import { Relatorios } from '../pages/psicologo/Relatorios';
import { ChatIA } from '../pages/psicologo/ChatIA';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute role="paciente" />}>
        <Route path="/paciente" element={<DashboardPaciente />} />
        <Route path="/paciente/agendamentos" element={<Agendamentos />} />
      </Route>

      <Route element={<ProtectedRoute role="psicologo" />}>
        <Route path="/psicologo" element={<DashboardPsicologo />} />
        <Route path="/psicologo/pacientes" element={<Pacientes />} />
        <Route path="/psicologo/relatorios" element={<Relatorios />} />
        <Route path="/psicologo/chat-ia" element={<ChatIA />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
