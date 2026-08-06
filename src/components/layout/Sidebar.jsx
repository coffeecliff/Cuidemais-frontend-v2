import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_BY_ROLE = {
  psicologo: [
    { to: '/psicologo', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/psicologo/pacientes', label: 'Pacientes', icon: Users },
    { to: '/psicologo/relatorios', label: 'Relatórios', icon: BarChart3 },
    { to: '/psicologo/chat-ia', label: 'Assistente IA', icon: MessageCircle },
  ],
  paciente: [
    { to: '/paciente', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/paciente/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  ],
};

function NavItems({ items, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-light text-white' : 'text-medium hover:bg-dark/5 hover:text-dark'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light text-white">
        <Plus size={18} strokeWidth={3} />
      </div>
      <span className="text-lg font-bold text-dark">
        Cuide<span className="text-light">+</span>
      </span>
    </div>
  );
}

function UserCard({ user, onSignOut }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dark/5 p-3">
      <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-dark">{user.name}</p>
        <p className="truncate text-xs text-medium capitalize">{user.role}</p>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        aria-label="Sair"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-medium hover:bg-dark/5 hover:text-dark"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const items = NAV_BY_ROLE[user.role] ?? [];

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-dark/5 bg-white px-4 py-3 md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-dark hover:bg-dark/5"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark/30 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 bg-white p-5 md:hidden"
            >
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-dark hover:bg-dark/5"
                >
                  <X size={20} />
                </button>
              </div>
              <NavItems items={items} onNavigate={() => setOpen(false)} />
              <div className="mt-auto">
                <UserCard user={user} onSignOut={signOut} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-dark/5 bg-white p-5 md:flex">
        <Brand />
        <NavItems items={items} />
        <div className="mt-auto">
          <UserCard user={user} onSignOut={signOut} />
        </div>
      </aside>
    </>
  );
}
