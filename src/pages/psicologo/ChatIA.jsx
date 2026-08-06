import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { useAuth } from '../../context/AuthContext';
import { firstName } from '../../utils/format';

const SUGGESTIONS = [
  'Resuma os principais sinais de ansiedade a observar em uma primeira sessão',
  'Sugira uma estrutura para um plano terapêutico de 6 sessões',
  'Como conduzir uma sessão de encerramento de acompanhamento?',
];

function buildReply(prompt) {
  const term = prompt.toLowerCase();

  if (term.includes('ansiedade')) {
    return `## Sinais de ansiedade a observar

Em uma primeira sessão, vale atenção a:

- **Sintomas físicos**: tensão muscular, taquicardia, falta de ar
- **Padrões de pensamento**: catastrofização, preocupação excessiva
- **Comportamento**: evitação de situações, inquietação motora
- **Sono e apetite**: alterações recentes na rotina

*Sugestão*: use uma escala simples (0 a 10) para o paciente autoavaliar a intensidade percebida — isso cria uma métrica de acompanhamento para as próximas sessões.`;
  }

  if (term.includes('plano terapêutico') || term.includes('6 sessões')) {
    return `## Estrutura sugerida — 6 sessões

1. **Sessão 1** — Acolhimento e levantamento de queixa principal
2. **Sessão 2** — Histórico e mapeamento de gatilhos
3. **Sessão 3** — Introdução de técnicas de regulação (respiração, \`grounding\`)
4. **Sessão 4** — Reestruturação de pensamentos disfuncionais
5. **Sessão 5** — Consolidação de estratégias e prevenção de recaída
6. **Sessão 6** — Avaliação de progresso e encerramento ou continuidade

Ajuste o ritmo conforme a resposta do paciente — nem toda pessoa avança no mesmo tempo.`;
  }

  if (term.includes('encerramento')) {
    return `## Conduzindo uma sessão de encerramento

- Revise os objetivos definidos no início do acompanhamento
- Destaque conquistas e mudanças observadas ao longo do processo
- Converse abertamente sobre receios em relação ao término
- Reforce estratégias que o paciente pode usar de forma autônoma
- Deixe a porta aberta para retorno futuro, se fizer sentido

Encerramentos bem conduzidos reduzem a chance de recaída e fortalecem a autoconfiança do paciente.`;
  }

  return `Entendi sua pergunta sobre *"${prompt}"*.

Posso ajudar com sugestões de condução clínica, mas lembre-se: sou um assistente de apoio e **não substituo** seu julgamento clínico. Algumas ideias:

- Documente observações objetivas logo após cada sessão
- Revise o histórico do paciente antes de cada atendimento
- Use os relatórios da plataforma para identificar padrões de frequência

Quer que eu detalhe algum desses pontos?`;
}

export function ChatIA() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Olá, **${firstName(user.name)}**! Sou o assistente de apoio clínico do Cuide+. Posso ajudar com sugestões de condução de sessões, estruturação de planos terapêuticos e boas práticas. Como posso ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  function send(text) {
    const prompt = text.trim();
    if (!prompt || typing) return;

    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: buildReply(prompt) }]);
      setTyping(false);
    }, 900);
  }

  return (
    <DashboardLayout title="Assistente IA" subtitle="Apoio de condução clínica — respostas simuladas, sem envio de dados reais.">
      <Card padding="p-0" className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === 'user' ? 'bg-dark text-white' : 'bg-light/15 text-light'
                  }`}
                >
                  {msg.role === 'user' ? user.name.charAt(0).toUpperCase() : <Bot size={16} />}
                </div>
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 ${
                    msg.role === 'user' ? 'bg-dark text-white' : 'bg-background text-dark'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-light/15 text-light">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-background px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-medium [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-medium [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-medium" />
                </div>
              </div>
            )}
          </div>
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-dark/5 px-6 py-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="flex items-center gap-1.5 rounded-full border border-dark/10 px-3 py-1.5 text-xs text-medium hover:border-light hover:text-dark"
              >
                <Sparkles size={12} /> {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="flex items-center gap-3 border-t border-dark/5 px-6 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="h-11 flex-1 rounded-xl border border-dark/10 bg-white px-4 text-sm text-dark placeholder:text-medium/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-light text-white transition-colors hover:bg-medium disabled:opacity-50"
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
