import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Award,
  Truck,
  Stethoscope,
  Hammer,
  UserCheck,
  Crown,
  Send,
  Download,
  Star,
  ChevronDown,
  FileCheck2,
  Zap,
  Lock,
} from 'lucide-react';

interface LandingPageViewProps {
  onExploreMvp: () => void;
}

type LeadRole = 'cavaleiro' | 'profissional';

interface ValidationLead {
  id: string;
  createdAt: string;
  role: LeadRole;
  name: string;
  email: string;
  whatsapp: string;
  region: string;
  categories: string[];
  frequency: string;
  difficulties: string[];
  interestedInVip: boolean;
  notes: string;
}

const REGIONS = [
  'Lisboa & Tejo',
  'Ribatejo / Golegã',
  'Algarve / Vilamoura',
  'Porto & Norte',
  'Alentejo',
  'Todo o Portugal Continental',
];

const CATEGORIES = [
  'Groom / Tratador',
  'Ferrador',
  'Veterinário Equino',
  'Transporte DGAV',
];

const FREQUENCIES_RIDER = [
  'Concursos CSN / CSI pontuais',
  'Semanal / Trabalho de estábulo',
  'Urgências de última hora',
  'Época completa / Recorrente',
];

const FREQUENCIES_PRO = [
  'Disponível a tempo inteiro',
  'Fins de semana e concursos',
  'Apenas serviços pontuais / urgências',
  'Equipa / Centro com vários serviços',
];

const DIFFICULTIES_RIDER = [
  'Falta de disponibilidade de última hora',
  'Sem referências ou verificação documental',
  'Preços pouco transparentes',
  'Comunicação dispersa no WhatsApp',
  'Dificuldade em urgências veterinárias/transporte',
];

const DIFFICULTIES_PRO = [
  'Clientes informais sem compromisso',
  'Falta de visibilidade fora do círculo habitual',
  'Pagamentos atrasados ou sem sinal',
  'Agenda desorganizada entre provas',
  'Dificuldade em comprovar qualificações',
];

const FAQS = [
  {
    q: 'Quanto custa usar o EquiFlow para cavaleiros e proprietários?',
    a: 'Pesquisar, comparar perfis, contactar e reservar profissionais é 100% gratuito para cavaleiros, proprietários e centros hípicos.',
  },
  {
    q: 'Como é feita a verificação documental dos profissionais?',
    a: 'O registo é feito online em 2 minutos, mas nenhum perfil fica visível ao público sem validação prévia: confirmamos Cartão de Cidadão/NIF, cédula da Ordem dos Médicos Veterinários (Veterinários) e licença DGAV (Transportadores).',
  },
  {
    q: 'Funciona para urgências durante concursos CSN ou CSI?',
    a: 'Sim. A plataforma inclui um modo de Urgência em Prova que filtra profissionais disponíveis na região do concurso com resposta rápida.',
  },
  {
    q: 'O que inclui a subscrição EquiFlow VIP / Premium?',
    a: 'É opcional para profissionais que queiram crescer mais depressa: coloca o perfil no topo das pesquisas por região e concurso, atribui o selo VIP dourado e dá prioridade em alertas de urgência.',
  },
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onExploreMvp }) => {
  const [role, setRole] = useState<LeadRole>('cavaleiro');
  const [howItWorksTab, setHowItWorksTab] = useState<LeadRole>('cavaleiro');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Groom / Tratador']);
  const [frequency, setFrequency] = useState(FREQUENCIES_RIDER[0]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [interestedInVip, setInterestedInVip] = useState(true);
  const [notes, setNotes] = useState('');
  const [submittedLead, setSubmittedLead] = useState<ValidationLead | null>(null);
  const [leads, setLeads] = useState<ValidationLead[]>(() => {
    try {
      const saved = localStorage.getItem('equiflow_validation_leads');
      return saved ? (JSON.parse(saved) as ValidationLead[]) : [];
    } catch {
      return [];
    }
  });

  const handleRoleChange = (nextRole: LeadRole) => {
    setRole(nextRole);
    setFrequency(nextRole === 'cavaleiro' ? FREQUENCIES_RIDER[0] : FREQUENCIES_PRO[0]);
    setDifficulties([]);
  };

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !email.trim()) return;

    const newLead: ValidationLead = {
      id: `EF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      role,
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      region,
      categories: selectedCategories.length > 0 ? selectedCategories : ['Groom / Tratador'],
      frequency,
      difficulties,
      interestedInVip,
      notes: notes.trim(),
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem('equiflow_validation_leads', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    setSubmittedLead(newLead);
  };

  const handleExportLeads = () => {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equiflow_leads_validacao.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToForm = () => {
    document.getElementById('validation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#142c21] text-[#f8f6f1] border border-[#264b3a] shadow-2xl">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, #b98b48 0%, transparent 45%), radial-gradient(circle at 10% 90%, #2a5a44 0%, transparent 50%)',
          }}
        />
        <div className="relative grid lg:grid-cols-12 gap-10 items-center p-7 sm:p-12 lg:p-14">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1f4232] border border-[#35664f] text-xs font-semibold uppercase tracking-[0.14em] text-[#e8dcc8]">
              <span className="w-2 h-2 rounded-full bg-[#d4a359] animate-pulse" />
              Acesso Antecipado • Portugal Continental
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.08] text-white">
              A infraestrutura de confiança para contratar{' '}
              <span className="text-[#d9a86c]">profissionais equestres</span> em Portugal.
            </h1>

            <p className="text-[#d2ddd7] text-base sm:text-lg leading-relaxed max-w-2xl">
              Acabe com as buscas de última hora em grupos de WhatsApp. Encontre{' '}
              <strong className="text-white font-semibold">
                Grooms, Ferradores, Veterinários Equinos e Transporte DGAV
              </strong>{' '}
              com verificação documental rigorosa, tarifas transparentes e disponibilidade em tempo real.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#94522a] hover:bg-[#7d4320] text-white font-semibold text-sm shadow-lg shadow-black/25 transition-all cursor-pointer"
              >
                Garantir Acesso de Fundador
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreMvp}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-[#f8f6f1] font-medium text-sm border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              >
                Explorar Protótipo MVP
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-xl">
              <div>
                <div className="font-display text-2xl font-bold text-white">4</div>
                <div className="text-xs text-[#b7c7bf]">Especialidades-chave</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-[#d9a86c]">100%</div>
                <div className="text-xs text-[#b7c7bf]">Verificação documental</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">{142 + leads.length}+</div>
                <div className="text-xs text-[#b7c7bf]">Inscritos na lista</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0f2219] shadow-2xl">
              <div className="relative">
                <img
                  src="/images/hero.jpg"
                  alt="Equipa equestre e cavalos em preparação"
                  className="w-full h-60 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2219] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173326]/90 backdrop-blur-xs border border-white/15 text-[11px] font-semibold text-[#e8dcc8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d9a86c]" />
                    Identidade, OMV &amp; DGAV Verificados
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2.5">
                    {['/images/groom1.jpg', '/images/groom2.jpg', '/images/groom3.jpg', '/images/groom4.jpg'].map(
                      (src, idx) => (
                        <img
                          key={src}
                          src={src}
                          alt={`Profissional verificado ${idx + 1}`}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#0f2219]"
                        />
                      )
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[#d9a86c] text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" /> 4.9 / 5.0
                    </div>
                    <div className="text-[11px] text-[#9fb2a8]">Rede de Fundadores</div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Cobertura Nacional</div>
                    <div className="text-[11px] text-[#b7c7bf]">
                      Lisboa • Golegã • Vilamoura • Norte • Alentejo
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-[#d9a86c] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Categories */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94522a]">
              Ecossistema Completo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1e2420]">
              4 Especialidades Essenciais desde o Dia 1
            </h2>
          </div>
          <p className="text-sm text-[#5c645e] max-w-md">
            Selecionadas para cobrir todas as necessidades críticas de estábulo, concurso e deslocação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Grooms & Tratadores',
              desc: 'Apoio especializado em concursos CSN/CSI, preparação de cavalos e trabalho diário de estábulo.',
              icon: <UserCheck className="w-5 h-5 text-[#173326]" />,
              badge: 'Provas & Estábulo',
              accent: 'border-t-[#173326]',
            },
            {
              title: 'Ferradores',
              desc: 'Ferração corretiva e ortopédica, manutenção regular de cocheira e substituições urgentes em prova.',
              icon: <Hammer className="w-5 h-5 text-[#94522a]" />,
              badge: 'Rotina & Urgência',
              accent: 'border-t-[#94522a]',
            },
            {
              title: 'Veterinários Equinos',
              desc: 'Profissionais com cédula OMV verificada para piquete 24h em concursos e acompanhamento clínico.',
              icon: <Stethoscope className="w-5 h-5 text-[#173326]" />,
              badge: 'Cédula OMV',
              accent: 'border-t-[#173326]',
            },
            {
              title: 'Transporte DGAV',
              desc: 'Transportadores certificados pela DGAV para viagens nacionais e circuitos internacionais.',
              icon: <Truck className="w-5 h-5 text-[#94522a]" />,
              badge: 'Licença DGAV',
              accent: 'border-t-[#94522a]',
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className={`rounded-2xl bg-white border border-[#e5dfd3] border-t-4 ${cat.accent} p-6 shadow-xs hover:shadow-md transition-all space-y-3.5`}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#f5f1e8] flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f8f6f1] text-[#5c645e] border border-[#e5dfd3]">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#1e2420]">{cat.title}</h3>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Dual Toggle) */}
      <section className="rounded-3xl bg-white border border-[#e5dfd3] p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94522a]">
              Fluxo Simples e Rápido
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1e2420] mt-1">
              Como funciona na prática
            </h2>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-[#f3efe6] border border-[#e5dfd3] self-start">
            <button
              type="button"
              onClick={() => setHowItWorksTab('cavaleiro')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                howItWorksTab === 'cavaleiro'
                  ? 'bg-[#173326] text-white shadow-xs'
                  : 'text-[#5c645e] hover:text-[#1e2420]'
              }`}
            >
              Para Cavaleiros &amp; Centros
            </button>
            <button
              type="button"
              onClick={() => setHowItWorksTab('profissional')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                howItWorksTab === 'profissional'
                  ? 'bg-[#94522a] text-white shadow-xs'
                  : 'text-[#5c645e] hover:text-[#1e2420]'
              }`}
            >
              Para Profissionais
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(howItWorksTab === 'cavaleiro'
            ? [
                {
                  step: '01',
                  title: 'Pesquise por Região ou Concurso',
                  desc: 'Filtre por especialidade, datas, nº de cavalos e localização (Golegã, Vilamoura, Lisboa, Norte ou Alentejo).',
                  icon: <MapPin className="w-5 h-5 text-[#173326]" />,
                },
                {
                  step: '02',
                  title: 'Compare Perfis Verificados',
                  desc: 'Analise experiência, tarifas diárias, avaliações reais e documentação validada antes de decidir.',
                  icon: <FileCheck2 className="w-5 h-5 text-[#173326]" />,
                },
                {
                  step: '03',
                  title: 'Reserve e Fale Diretamente',
                  desc: 'Confirme a marcação em segundos ou ative o modo de Urgência em Prova para resposta prioritária.',
                  icon: <Zap className="w-5 h-5 text-[#94522a]" />,
                },
              ]
            : [
                {
                  step: '01',
                  title: 'Auto-registo Online em 2 Minutos',
                  desc: 'Crie o seu perfil através do link direto de adesão, sem deslocações nem entrevistas presenciais.',
                  icon: <Clock className="w-5 h-5 text-[#94522a]" />,
                },
                {
                  step: '02',
                  title: 'Validação Documental Segura',
                  desc: 'Submeta CC/NIF e licenças aplicáveis (Cédula OMV ou DGAV). Só após aprovação o perfil fica público.',
                  icon: <Lock className="w-5 h-5 text-[#173326]" />,
                },
                {
                  step: '03',
                  title: 'Receba Pedidos & Destaque VIP',
                  desc: 'Preencha a sua agenda gratuitamente ou ative o plano VIP para surgir no topo das pesquisas.',
                  icon: <Crown className="w-5 h-5 text-[#94522a]" />,
                },
              ]
          ).map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-[#f8f6f1] border border-[#e5dfd3] p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold text-[#94522a]/40">{item.step}</span>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e5dfd3] flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#1e2420]">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94522a]">
            Modelo Transparente
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1e2420]">
            Gratuito para começar. VIP para liderar.
          </h2>
          <p className="text-sm text-[#5c645e]">
            Cavaleiros usam gratuitamente. Profissionais escolhem entre visibilidade base gratuita ou destaque VIP no topo das pesquisas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white border border-[#e5dfd3] p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5c645e]">
                  Plano Base
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f3efe6] text-xs font-semibold text-[#1e2420]">
                  Para todos
                </span>
              </div>
              <div>
                <span className="font-display text-4xl font-bold text-[#1e2420]">€0</span>
                <span className="text-sm text-[#5c645e]"> / mês</span>
              </div>
              <p className="text-sm text-[#5c645e]">
                Tudo o que precisa para encontrar profissionais ou começar a receber pedidos verificados.
              </p>
              <ul className="space-y-2.5 text-sm text-[#1e2420] pt-2">
                {[
                  'Pesquisa e comparação ilimitada (Cavaleiros)',
                  'Perfil profissional verificado após validação',
                  'Chat direto e gestão de reservas',
                  'Acesso a pedidos abertos e concursos',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#173326] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-3 rounded-xl border border-[#173326] text-[#173326] hover:bg-[#173326]/5 font-semibold text-sm transition-colors cursor-pointer"
            >
              Registar Gratuitamente
            </button>
          </div>

          <div className="rounded-3xl bg-[#173326] text-white border border-[#2b5743] p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d9a86c]">
                  <Crown className="w-4 h-4" />
                  EquiFlow VIP / Premium
                </span>
                <span className="px-3 py-1 rounded-full bg-[#94522a] text-xs font-semibold text-white">
                  Mais Popular
                </span>
              </div>
              <div>
                <span className="font-display text-4xl font-bold text-white">Fundadores</span>
                <span className="text-sm text-[#b7c7bf]"> • Condição Especial</span>
              </div>
              <p className="text-sm text-[#d2ddd7]">
                Pensado para profissionais e empresas que querem máxima visibilidade nas épocas de concursos.
              </p>
              <ul className="space-y-2.5 text-sm text-[#f8f6f1] pt-2">
                {[
                  'Posicionamento prioritário no topo das pesquisas',
                  'Selo VIP Dourado de destaque no perfil',
                  'Notificações antecipadas de urgências em prova',
                  'Destaque em circuitos CSN / CSI e Golegã',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#d9a86c] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-3 rounded-xl bg-[#94522a] hover:bg-[#7d4320] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Pedir Acesso VIP de Fundador
            </button>
          </div>
        </div>
      </section>

      {/* Validation & Waitlist Form (Split Layout) */}
      <section
        id="validation-form"
        className="rounded-[2rem] bg-white border border-[#e5dfd3] shadow-lg overflow-hidden"
      >
        <div className="grid lg:grid-cols-12">
          {/* Left Column: Context & Founder Perks */}
          <div className="lg:col-span-4 bg-[#173326] text-[#f8f6f1] p-7 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#d9a86c]">
                <Sparkles className="w-3.5 h-3.5" />
                Lista de Validação
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                Ajude-nos a lançar na sua região.
              </h2>
              <p className="text-sm text-[#c8d5ce] leading-relaxed">
                Estamos a mapear a procura real entre cavaleiros e profissionais em Portugal Continental para abrir as primeiras vagas com prioridade.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d9a86c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Acesso Prioritário</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Convite direto antes da abertura pública geral.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d9a86c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Benefício VIP de Fundador</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Período experimental gratuito no plano de destaque.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d9a86c] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Sem Spam</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Contacto apenas para validação e convite de lançamento.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-[#b7c7bf]">
              <strong className="text-white">{142 + leads.length} pessoas</strong> já responderam ao inquérito de validação.
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8 p-7 sm:p-10">
            {submittedLead ? (
              <div className="rounded-2xl bg-[#f4f8f5] border border-[#b8d4c1] p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#173326] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-semibold text-[#173326]">
                      Inscrição registada com sucesso ({submittedLead.id})
                    </h3>
                    <p className="text-sm text-[#354b3e]">
                      Obrigado, <strong>{submittedLead.name}</strong>! Registámos o teu perfil de{' '}
                      <strong>
                        {submittedLead.role === 'cavaleiro'
                          ? 'Cavaleiro / Proprietário'
                          : 'Profissional Equestre'}
                      </strong>{' '}
                      na região <strong>{submittedLead.region}</strong>.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-[#dce8e0] p-4 text-xs text-[#3b4740] space-y-1.5">
                  <div>
                    <strong>Categorias:</strong> {submittedLead.categories.join(', ')}
                  </div>
                  <div>
                    <strong>Frequência:</strong> {submittedLead.frequency}
                  </div>
                  <div>
                    <strong>Contacto:</strong> {submittedLead.whatsapp} • {submittedLead.email}
                  </div>
                  {submittedLead.interestedInVip && (
                    <div className="text-[#94522a] font-semibold">
                      ★ Interesse assinalado em acesso antecipado VIP / Premium
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedLead(null);
                      setName('');
                      setEmail('');
                      setWhatsapp('');
                      setNotes('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#173326] text-white text-sm font-medium hover:bg-[#11261c] cursor-pointer"
                  >
                    Submeter outra resposta
                  </button>
                  <button
                    type="button"
                    onClick={onExploreMvp}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#d6cfc2] text-[#1e2420] text-sm font-medium hover:bg-[#f8f6f1] cursor-pointer"
                  >
                    Testar o MVP da Plataforma
                  </button>
                  {leads.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportLeads}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#d6cfc2] text-[#5c645e] text-sm font-medium hover:text-[#1e2420] cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Exportar Leads ({leads.length})
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1e2420]">
                    1. Qual é o seu perfil principal?
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('cavaleiro')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'cavaleiro'
                          ? 'border-[#173326] bg-[#173326]/5 ring-2 ring-[#173326]/20'
                          : 'border-[#e5dfd3] bg-white hover:border-[#c9c0b0]'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#1e2420]">
                        Cavaleiro / Proprietário / Centro Hípico
                      </div>
                      <div className="text-xs text-[#5c645e] mt-1">
                        Procuro grooms, ferradores, veterinários ou transporte.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange('profissional')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'profissional'
                          ? 'border-[#94522a] bg-[#94522a]/5 ring-2 ring-[#94522a]/20'
                          : 'border-[#e5dfd3] bg-white hover:border-[#c9c0b0]'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#1e2420]">
                        Profissional / Prestador de Serviços
                      </div>
                      <div className="text-xs text-[#5c645e] mt-1">
                        Presto serviços de groom, ferração, veterinária ou transporte.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1e2420]">
                    2.{' '}
                    {role === 'cavaleiro'
                      ? 'Que serviços contrata com mais frequência?'
                      : 'Em que áreas atua?'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const active = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleItem(selectedCategories, setSelectedCategories, cat)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#173326] text-white border-[#173326]'
                              : 'bg-[#f8f6f1] text-[#1e2420] border-[#e5dfd3] hover:border-[#173326]/40'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Region & Frequency */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#1e2420]">
                      3. Região principal
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#1e2420]">
                      4. {role === 'cavaleiro' ? 'Frequência de contratação' : 'Disponibilidade habitual'}
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                    >
                      {(role === 'cavaleiro' ? FREQUENCIES_RIDER : FREQUENCIES_PRO).map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Difficulties */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1e2420]">
                    5. Maiores dificuldades hoje no processo informal?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(role === 'cavaleiro' ? DIFFICULTIES_RIDER : DIFFICULTIES_PRO).map((diff) => {
                      const active = difficulties.includes(diff);
                      return (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => toggleItem(difficulties, setDifficulties, diff)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#94522a] text-white border-[#94522a]'
                              : 'bg-white text-[#49524c] border-[#e5dfd3] hover:border-[#94522a]/50'
                          }`}
                        >
                          {diff}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1e2420]">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Quaresma"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1e2420]">
                      WhatsApp / Telemóvel *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: 912 345 678"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1e2420]">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@exemplo.pt"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                    />
                  </div>
                </div>

                {/* VIP & Notes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={interestedInVip}
                      onChange={(e) => setInterestedInVip(e.target.checked)}
                      className="mt-0.5 rounded border-[#d8d0c3] text-[#173326] focus:ring-[#173326]"
                    />
                    <span className="text-xs text-[#49524c] leading-relaxed">
                      Tenho interesse em condições de fundador para o{' '}
                      <strong className="text-[#1e2420]">Plano VIP / Premium</strong> (destaque
                      prioritário nas pesquisas e selo verificado).
                    </span>
                  </label>

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguma sugestão, concurso onde costuma estar ou funcionalidade que gostava de ver? (opcional)"
                    className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#19201c] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173326]/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#173326] hover:bg-[#11261c] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Garantir Lugar na Lista EquiFlow
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94522a]">
            Perguntas Frequentes
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
            Dúvidas sobre o lançamento
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm text-[#1e2420]">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5c645e] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-[#5c645e] leading-relaxed border-t border-[#f3efe6] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
