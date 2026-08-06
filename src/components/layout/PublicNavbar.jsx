import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#sobre', label: 'Sobre' },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dark/5 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" onClick={goHome} className="flex items-center">
          <img src="/logo-text.svg" alt="Cuide+" className="h-8 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const isActive = link.to === '/' && location.pathname === '/' && !location.hash;
            return (
              <a
                key={link.to}
                href={link.to}
                onClick={link.to === '/' ? goHome : undefined}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? 'text-light' : 'text-dark hover:text-light'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button to="/login" variant="secondary" size="sm">
            Entrar
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-dark hover:bg-dark/5 md:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

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
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col gap-6 bg-white p-6 md:hidden"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-dark hover:bg-dark/5"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {LINKS.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={link.to === '/' ? goHome : () => setOpen(false)}
                    className="text-base font-semibold text-dark hover:text-light"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Button to="/login" variant="primary" size="md" className="w-full" onClick={() => setOpen(false)}>
                Entrar
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
