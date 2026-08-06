import { motion } from 'framer-motion';
import {
  Plus,
  CalendarCheck,
  UserPlus,
  HeartHandshake,
  GraduationCap,
  Building2,
  HandHeart,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Cadastre-se',
    description: 'Crie sua conta como paciente em poucos minutos e conte um pouco sobre você.',
  },
  {
    icon: CalendarCheck,
    title: 'Agende sua sessão',
    description: 'Escolha um psicólogo voluntário e o horário que melhor encaixa na sua rotina.',
  },
  {
    icon: HeartHandshake,
    title: 'Receba cuidado',
    description: 'Participe das sessões e acompanhe sua evolução junto ao profissional responsável.',
  },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'Universidades',
    description: 'Apoio psicológico para estudantes dentro de programas de extensão e bem-estar.',
  },
  {
    icon: Building2,
    title: 'ONGs',
    description: 'Gestão simplificada de atendimentos voluntários para organizações sociais.',
  },
  {
    icon: HandHeart,
    title: 'Iniciativas sociais',
    description: 'Ferramentas para coordenar equipes de voluntários e cuidar de comunidades.',
  },
];

const STATS = [
  { value: '500+', label: 'Atendimentos realizados' },
  { value: '40+', label: 'Psicólogos voluntários' },
  { value: '12', label: 'Instituições parceiras' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-light/25">
        <div className="mx-auto max-w-4xl px-6 pb-28 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-light text-white"
          >
            <Plus size={34} strokeWidth={3} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-dark sm:text-6xl"
          >
            Cuide<span className="text-light">+</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-medium"
          >
            Plataforma digital voltada para facilitar o agendamento e a gestão de atendimentos
            psicológicos voluntários. Criada especialmente para universidades, ONGs e iniciativas
            sociais dedicadas à promoção da saúde mental.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button to="/register" size="lg">
              Começar Agora
            </Button>
            <Button href="#sobre" variant="secondary" size="lg">
              Sobre nós
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div {...fadeUp} className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-light">Como funciona</span>
          <h2 className="mt-2 text-3xl font-bold text-dark">Cuidado em três passos simples</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div key={step.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
              <Card className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-light/15 text-light">
                  <step.icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-dark">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-medium">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Para quem é */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-light">Para quem é</span>
            <h2 className="mt-2 text-3xl font-bold text-dark">Feito para quem cuida de pessoas</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {AUDIENCES.map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
                <Card className="h-full border-dark/5 bg-background/60">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-medium">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-medium">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <span className="text-sm font-semibold uppercase tracking-wide text-light">Sobre nós</span>
            <h2 className="mt-2 text-3xl font-bold text-dark">
              Conectando quem precisa de cuidado a quem quer cuidar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-medium">
              O Cuide+ nasceu para reduzir a distância entre pessoas que precisam de apoio
              psicológico e profissionais dispostos a oferecer atendimento voluntário. Facilitamos
              o agendamento, a organização de prontuários simples e o acompanhamento de cada
              jornada terapêutica — para que instituições foquem no que importa: cuidar.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-dark">{stat.value}</p>
                  <p className="mt-1 text-xs leading-snug text-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <Card className="overflow-hidden" padding="p-0">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                alt="Psicóloga voluntária atendendo uma paciente"
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-light/15 text-light">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-sm leading-relaxed text-medium">
                  "O Cuide+ organizou completamente a agenda do nosso projeto de extensão. Hoje
                  conseguimos atender o dobro de estudantes com a mesma equipe voluntária."
                </p>
                <p className="mt-3 text-sm font-semibold text-dark">Dra. Renata Alves</p>
                <p className="text-xs text-medium">Coordenadora de projeto social</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-accent">
            <Sparkles size={22} />
          </div>
          <h2 className="text-3xl font-bold text-white">Pronto para começar a cuidar?</h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Crie sua conta gratuitamente e comece a agendar ou oferecer atendimentos psicológicos
            hoje mesmo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button to="/register" size="lg">
              Criar conta gratuita
            </Button>
            <Button to="/login" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-light text-white">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-dark">
              Cuide<span className="text-light">+</span>
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-medium">
            <Clock size={13} />
            Plataforma de agendamento psicológico voluntário
          </p>
        </div>
      </footer>
    </div>
  );
}
