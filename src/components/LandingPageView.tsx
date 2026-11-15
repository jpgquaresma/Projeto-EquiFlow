import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Award,
  Crown,
  Send,
  Download,
  ChevronDown,
  Lock,
  Zap,
  XCircle,
  Check,
  Sparkles,
} from 'lucide-react';

interface LandingPageViewProps {
  onExploreMvp: () => void;
}

type LeadRole = 'cavaleiro' | 'profissional';
type PreviewCategory = 'Grooms' | 'Ferradores' | 'Veterinários' | 'Transporte';

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

const PREVIEW_DATA: Record<
  PreviewCategory,
  {
    initials: string;
    name: string;
    title: string;
    region: string;
    badge: string;
    rate: string;
    availability: string;
    response: string;
    isVip: boolean;
  }[]
> = {
  Grooms: [
    {
      initials: 'MC',
      name: 'Marta Cardoso',
      title: 'Groom de Concursos CSN / CSI',
      region: 'Ribatejo • Golegã & Lisboa',
      badge: 'Identidade & Referências Verificadas',
      rate: '€95 / dia',
      availability: 'Disponível este fim de semana',
      response: '< 15 min',
      isVip: true,
    },
    {
      initials: 'TP',
      name: 'Tiago Pereira',
      title: 'Tratador de Estábulo & Preparação',
      region: 'Algarve • Vilamoura',
      badge: 'Identidade Verificada',
      rate: '€80 / dia',
      availability: 'Vagas para circuito CSN',
      response: '< 30 min',
      isVip: false,
    },
  ],
  Ferradores: [
    {
      initials: 'DS',
      name: 'Diogo Sousa',
      title: 'Ferrador Ortopédico & Urgências',
      region: 'Lisboa & Tejo • Cascais',
      badge: 'Certificação & Seguro Validados',
      rate: '€90 / serviço',
      availability: 'Piquete de prova ativo',
      response: '< 20 min',
      isVip: true,
    },
    {
      initials: 'RA',
      name: 'Rui Almeida',
      title: 'Ferração Desportiva & Rotina',
      region: 'Porto & Norte',
      badge: 'Identidade Verificada',
      rate: '€75 / serviço',
      availability: 'Agenda aberta esta semana',
      response: '< 45 min',
      isVip: false,
    },
  ],
  Veterinários: [
    {
      initials: 'AF',
      name: 'Dra. Ana Ferreira',
      title: 'Médica Veterinária Equina (Urgência 24h)',
      region: 'Algarve • Vilamoura & Alentejo',
      badge: 'Cédula OMV Verificada',
      rate: '€120 / chamada',
      availability: 'Em prevenção de concurso',
      response: '< 10 min',
      isVip: true,
    },
    {
      initials: 'JM',
      name: 'Dr. João Mendes',
      title: 'Clínica Equina & Reprodução',
      region: 'Ribatejo / Golegã',
      badge: 'Cédula OMV Verificada',
      rate: '€100 / consulta',
      availability: 'Consultas na região',
      response: '< 25 min',
      isVip: false,
    },
  ],
  Transporte: [
    {
      initials: 'LT',
      name: 'LusoTrans Equus',
      title: 'Camião 6 Cavalos & Reboque Climatizado',
      region: 'Portugal Continental & Espanha',
      badge: 'Licença DGAV Verificada',
      rate: '€1,25 / km',
      availability: 'Saída imediata disponível',
      response: '< 20 min',
      isVip: true,
    },
    {
      initials: 'HC',
      name: 'Henrique Costa',
      title: 'Transporte Individual Urgente (2 Cavalos)',
      region: 'Lisboa • Santarém • Porto',
      badge: 'Licença DGAV Verificada',
      rate: '€1,10 / km',
      availability: 'Livre sexta a domingo',
      response: '< 35 min',
      isVip: false,
    },
  ],
};

const SPECIALTIES = [
  {
    num: '01',
    tag: 'Provas & Estábulo',
    title: 'Grooms & Tratadores',
    desc: 'Apoio especializado em concursos CSN/CSI, preparação em pista, cuidado diário e gestão de equipamento.',
  },
  {
    num: '02',
    tag: 'Rotina & Urgência',
    title: 'Ferradores',
    desc: 'Ferração desportiva, corretiva e resposta rápida para ferraduras perdidas durante competições.',
  },
  {
    num: '03',
    tag: 'Cédula OMV',
    title: 'Veterinários Equinos',
    desc: 'Profissionais com cédula OMV validada para acompanhamento clínico e piquete de emergência.',
  },
  {
    num: '04',
    tag: 'Licença DGAV',
    title: 'Transporte Certificado',
    desc: 'Motoristas e viaturas com licença DGAV para deslocações nacionais, urgências e circuitos.',
  },
];

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
    a: 'Pesquisar, comparar perfis, contactar e reservar profissionais é totalmente gratuito para cavaleiros, proprietários e centros hípicos.',
  },
  {
    q: 'Como garantem que os profissionais são reais e qualificados?',
    a: 'O registo é online em 2 minutos, mas nenhum perfil fica visível ao público antes da validação documental: confirmamos Cartão de Cidadão/NIF, cédula OMV (Veterinários) e licença DGAV (Transportadores).',
  },
  {
    q: 'Como funciona em situações urgentes durante um concurso?',
    a: 'A plataforma dispõe de um filtro de Urgência em Prova que destaca profissionais disponíveis na região do evento com tempo de resposta rápido.',
  },
  {
    q: 'Qual é a vantagem de entrar já na lista de espera?',
    a: 'Cavaleiros recebem acesso prioritário no arranque da sua região; profissionais fundadores garantem período experimental gratuito no plano EquiFlow VIP (topo das pesquisas).',
  },
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onExploreMvp }) => {
  const [previewCategory, setPreviewCategory] = useState<PreviewCategory>('Grooms');
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

  const previewItems = PREVIEW_DATA[previewCategory];

  return (
    <div className="font-sans space-y-20 pb-16 text-[#161d19]">
      {/* Architectural Split Hero (No images, interactive platform preview) */}
      <section className="pt-4 lg:pt-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94522a]">
              Portugal Continental • Acesso Antecipado
            </p>

            <h1 className="!font-sans text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-[-0.035em] leading-[1.06] text-[#142019]">
              Contratação equestre com verificação, rapidez e zero improviso.
            </h1>

            <p className="text-base sm:text-lg text-[#4c5650] leading-relaxed max-w-xl">
              Deixe para trás os grupos de WhatsApp na véspera de cada concurso. O{' '}
              <strong className="font-semibold text-[#161d19]">EquiFlow</strong> liga cavaleiros e
              coudelarias a <strong className="font-semibold text-[#161d19]">Grooms, Ferradores, Veterinários OMV e Transporte DGAV</strong> em todo o país.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#142e22] hover:bg-[#0d2017] text-white font-semibold text-sm shadow-lg shadow-[#142e22]/15 transition-all cursor-pointer"
              >
                Garantir Acesso Prioritário
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreMvp}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-[#f2eee6] text-[#161d19] font-semibold text-sm border border-[#dcd5c8] transition-all cursor-pointer"
              >
                Explorar Protótipo
              </button>
            </div>

            {/* Clean Typographic Proof Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#e5dfd3] max-w-lg">
              <div>
                <div className="text-2xl font-bold tracking-tight text-[#142e22]">100%</div>
                <div className="text-xs text-[#5c6660] mt-0.5">Validação documental</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-[#94522a]">2 min</div>
                <div className="text-xs text-[#5c6660] mt-0.5">Registo online direto</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-[#142e22]">
                  {142 + leads.length}+
                </div>
                <div className="text-xs text-[#5c6660] mt-0.5">Inscritos na lista</div>
              </div>
            </div>
          </div>

          {/* Right Interactive UI Showcase (Zero photos) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white border border-[#e2dcd0] shadow-[0_24px_60px_-15px_rgba(20,46,34,0.12)] overflow-hidden">
              {/* Top Window Bar */}
              <div className="px-5 py-3.5 bg-[#f7f5f0] border-b border-[#e7e2d8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#161d19]">
                  <ShieldCheck className="w-4 h-4 text-[#142e22]" />
                  <span>Pré-visualização da Rede Verificada</span>
                </div>
                <span className="text-[11px] font-medium text-[#5c6660]">
                  Lisboa • Golegã • Vilamoura • Norte
                </span>
              </div>

              {/* Category Switcher Tabs */}
              <div className="px-5 pt-4 pb-3 border-b border-[#f0ece3] flex flex-wrap gap-1.5">
                {(['Grooms', 'Ferradores', 'Veterinários', 'Transporte'] as PreviewCategory[]).map(
                  (cat) => {
                    const active = previewCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPreviewCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#142e22] text-white'
                            : 'bg-[#f5f2eb] text-[#525c56] hover:text-[#161d19]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Dynamic Preview Cards */}
              <div className="p-5 space-y-3 bg-[#fcfbf8]">
                {previewItems.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl bg-white border border-[#e6e0d5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#c8bfae]"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          item.isVip
                            ? 'bg-[#142e22] text-[#e8d5b5]'
                            : 'bg-[#efeae0] text-[#161d19]'
                        }`}
                      >
                        {item.initials}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#161d19]">{item.name}</span>
                          {item.isVip && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fbf5e9] border border-[#e6d3ad] text-[10px] font-bold uppercase tracking-wider text-[#94522a]">
                              <Crown className="w-2.5 h-2.5" />
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-[#4c5650]">{item.title}</div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6d7670]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.region}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#142e22] font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f0ece3]">
                      <div className="font-bold text-sm text-[#161d19] tabular-nums">{item.rate}</div>
                      <div className="text-[11px] text-[#142e22] font-medium">
                        Resposta {item.response}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom Action Strip */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#5c6660]">
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#94522a]" />
                    Filtro de Urgência em Prova CSN/CSI incluído
                  </span>
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="font-semibold text-[#142e22] hover:underline cursor-pointer"
                  >
                    Reservar vaga →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs EquiFlow Contrast */}
      <section className="rounded-3xl bg-white border border-[#e6e0d5] p-6 sm:p-10 shadow-xs">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a837d]">
              O problema atual
            </span>
            <h2 className="!font-sans text-2xl font-bold tracking-tight text-[#161d19]">
              Como funciona hoje no setor
            </h2>
            <ul className="space-y-3 pt-1">
              {[
                'Mensagens dispersas em dezenas de grupos de WhatsApp sem resposta.',
                'Impossibilidade de saber quem está livre para a data do próximo concurso.',
                'Falta de verificação prévia de identificação, cédula OMV ou licença DGAV.',
                'Dificuldade dos bons profissionais em ganhar visibilidade fora da sua zona.',
              ].map((txt) => (
                <li key={txt} className="flex items-start gap-3 text-sm text-[#525c56]">
                  <XCircle className="w-4 h-4 text-[#b3543a] shrink-0 mt-0.5" />
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:border-l md:border-[#ebe5da] md:pl-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#142e22]">
              A solução EquiFlow
            </span>
            <h2 className="!font-sans text-2xl font-bold tracking-tight text-[#161d19]">
              Um ecossistema organizado e fiável
            </h2>
            <ul className="space-y-3 pt-1">
              {[
                'Pesquisa direta por especialidade, concurso e região de Portugal Continental.',
                'Comparação transparente de experiência, disponibilidade e tarifas indicativas.',
                'Documentação obrigatória validada antes de qualquer perfil ser publicado.',
                'Modo de Urgência em Prova para resolver imprevistos em minutos.',
              ].map((txt) => (
                <li key={txt} className="flex items-start gap-3 text-sm text-[#161d19] font-medium">
                  <Check className="w-4 h-4 text-[#142e22] shrink-0 mt-0.5" />
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 Core Specialties */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94522a]">
              Cobertura Completa
            </span>
            <h2 className="!font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#161d19]">
              4 áreas essenciais desde o lançamento
            </h2>
          </div>
          <p className="text-sm text-[#525c56] max-w-md">
            Todo o suporte humano, técnico e logístico que uma equipa ou cocheira precisa num único lugar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPECIALTIES.map((sp) => (
            <div
              key={sp.num}
              className="rounded-2xl bg-white border border-[#e6e0d5] p-6 space-y-4 hover:border-[#bfb5a3] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-[#94522a]">{sp.num}</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#f5f2eb] text-[#4c5650]">
                  {sp.tag}
                </span>
              </div>
              <h3 className="!font-sans font-bold text-lg tracking-tight text-[#161d19]">
                {sp.title}
              </h3>
              <p className="text-sm text-[#525c56] leading-relaxed">{sp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works & Verification */}
      <section className="rounded-3xl bg-[#f1ede4] border border-[#e3dccf] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94522a]">
              Operação Simples
            </span>
            <h2 className="!font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#161d19]">
              Como funciona na prática
            </h2>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-white border border-[#e2dcd0] self-start">
            <button
              type="button"
              onClick={() => setHowItWorksTab('cavaleiro')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                howItWorksTab === 'cavaleiro'
                  ? 'bg-[#142e22] text-white'
                  : 'text-[#525c56] hover:text-[#161d19]'
              }`}
            >
              Cavaleiros &amp; Centros
            </button>
            <button
              type="button"
              onClick={() => setHowItWorksTab('profissional')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                howItWorksTab === 'profissional'
                  ? 'bg-[#94522a] text-white'
                  : 'text-[#525c56] hover:text-[#161d19]'
              }`}
            >
              Profissionais
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(howItWorksTab === 'cavaleiro'
            ? [
                {
                  step: '01',
                  title: 'Filtre por Região ou Prova',
                  desc: 'Escolha especialidade, datas, número de cavalos e localização exata em segundos.',
                  icon: <MapPin className="w-4 h-4 text-[#142e22]" />,
                },
                {
                  step: '02',
                  title: 'Compare com Segurança',
                  desc: 'Avalie experiência, documentos validados, avaliações e tarifas antes de avançar.',
                  icon: <ShieldCheck className="w-4 h-4 text-[#142e22]" />,
                },
                {
                  step: '03',
                  title: 'Reserve ou Ative Urgência',
                  desc: 'Fale diretamente com o profissional ou acione o modo de urgência durante o concurso.',
                  icon: <Zap className="w-4 h-4 text-[#94522a]" />,
                },
              ]
            : [
                {
                  step: '01',
                  title: 'Auto-Registo Online Direto',
                  desc: 'Crie o seu perfil através do link de adesão em 2 minutos, sem entrevistas presenciais.',
                  icon: <Clock className="w-4 h-4 text-[#94522a]" />,
                },
                {
                  step: '02',
                  title: 'Validação Documental Prévia',
                  desc: 'Verificamos CC/NIF, cédula OMV ou licença DGAV antes de tornar o perfil visível.',
                  icon: <Lock className="w-4 h-4 text-[#142e22]" />,
                },
                {
                  step: '03',
                  title: 'Agenda Cheia & Destaque VIP',
                  desc: 'Receba pedidos gratuitamente ou ative a subscrição VIP para surgir no topo das pesquisas.',
                  icon: <Crown className="w-4 h-4 text-[#94522a]" />,
                },
              ]
          ).map((item) => (
            <div key={item.step} className="rounded-2xl bg-white border border-[#e6e0d5] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-[#94522a]">{item.step}</span>
                <div className="w-8 h-8 rounded-lg bg-[#f5f2eb] flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="!font-sans font-bold text-base text-[#161d19]">{item.title}</h3>
              <p className="text-sm text-[#525c56] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94522a]">
            Modelo de Subscrição
          </span>
          <h2 className="!font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#161d19]">
            Entrada gratuita. Crescimento VIP opcional.
          </h2>
          <p className="text-sm text-[#525c56]">
            Sem comissões escondidas para cavaleiros. Os profissionais escolhem quando querem acelerar a sua visibilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white border border-[#e6e0d5] p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5c6660]">
                  Acesso Base
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f5f2eb] text-[#161d19]">
                  Gratuito
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-[#161d19]">€0</span>
                <span className="text-sm text-[#5c6660]">/ mês</span>
              </div>
              <p className="text-sm text-[#525c56]">
                Acesso completo para pesquisar, comparar e publicar disponibilidade verificada.
              </p>
              <ul className="space-y-2.5 text-sm text-[#161d19] pt-2">
                {[
                  'Pesquisa e contacto ilimitado para cavaleiros',
                  'Perfil profissional após validação documental',
                  'Gestão organizada de pedidos e reservas',
                  'Acesso ao calendário nacional de concursos',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#142e22] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-3.5 rounded-xl border border-[#142e22] text-[#142e22] hover:bg-[#142e22]/5 font-semibold text-sm transition-colors cursor-pointer"
            >
              Garantir Acesso Base
            </button>
          </div>

          <div className="rounded-3xl bg-[#142e22] text-white border border-[#244c3a] p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e3b778]">
                  <Crown className="w-4 h-4" />
                  EquiFlow VIP
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#94522a] text-white">
                  Fundadores
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  Topo das Pesquisas
                </span>
              </div>
              <p className="text-sm text-[#cbd8d1]">
                Para profissionais que querem preencher a agenda primeiro durante os principais circuitos nacionais.
              </p>
              <ul className="space-y-2.5 text-sm text-[#f7f5f0] pt-2">
                {[
                  'Posicionamento prioritário nos resultados por região',
                  'Selo VIP Dourado de destaque imediato',
                  'Prioridade em alertas de Urgência em Prova',
                  'Condição experimental gratuita para primeiros inscritos',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#e3b778] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-3.5 rounded-xl bg-[#94522a] hover:bg-[#7d4320] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Pedir Acesso VIP de Fundador
            </button>
          </div>
        </div>
      </section>

      {/* Conversion Form Section */}
      <section
        id="validation-form"
        className="rounded-3xl bg-white border border-[#e2dcd0] shadow-lg overflow-hidden"
      >
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-4 bg-[#142e22] text-[#f7f5f0] p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#e3b778]">
                <Sparkles className="w-3.5 h-3.5" />
                Lista de Espera &amp; Validação
              </span>
              <h2 className="!font-sans text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white">
                Entre no grupo fundador na sua região.
              </h2>
              <p className="text-sm text-[#c7d4cd] leading-relaxed">
                Demora menos de 60 segundos. Os dados recolhidos definem a ordem de abertura por zona em Portugal Continental.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e3b778] shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white">Convite antecipado</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Acesso direto antes da abertura pública geral.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e3b778] shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white">Benefício VIP de Fundador</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Período experimental gratuito no plano de destaque.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e3b778] shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white">Contacto sem spam</div>
                  <div className="text-xs text-[#b7c7bf]">
                    Usado apenas para validação e convite oficial.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 text-xs text-[#c7d4cd]">
              <strong className="text-white">{142 + leads.length} inscritos</strong> já validaram o
              interesse nesta fase.
            </div>
          </div>

          <div className="lg:col-span-8 p-7 sm:p-10">
            {submittedLead ? (
              <div className="rounded-2xl bg-[#f4f8f5] border border-[#b8d4c1] p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#142e22] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="!font-sans text-xl font-bold text-[#142e22]">
                      Lugar garantido ({submittedLead.id})
                    </h3>
                    <p className="text-sm text-[#354b3e]">
                      Obrigado, <strong>{submittedLead.name}</strong>. Registámos o teu perfil de{' '}
                      <strong>
                        {submittedLead.role === 'cavaleiro'
                          ? 'Cavaleiro / Proprietário'
                          : 'Profissional Equestre'}
                      </strong>{' '}
                      em <strong>{submittedLead.region}</strong>.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-[#dce8e0] p-4 text-xs text-[#3b4740] space-y-1.5">
                  <div>
                    <strong>Especialidades:</strong> {submittedLead.categories.join(', ')}
                  </div>
                  <div>
                    <strong>Frequência:</strong> {submittedLead.frequency}
                  </div>
                  <div>
                    <strong>Contacto:</strong> {submittedLead.whatsapp} • {submittedLead.email}
                  </div>
                  {submittedLead.interestedInVip && (
                    <div className="text-[#94522a] font-semibold">
                      ★ Acesso VIP / Fundador assinalado
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
                    className="px-4 py-2.5 rounded-xl bg-[#142e22] text-white text-sm font-semibold hover:bg-[#0d2017] cursor-pointer"
                  >
                    Submeter outra resposta
                  </button>
                  <button
                    type="button"
                    onClick={onExploreMvp}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#d6cfc2] text-[#161d19] text-sm font-semibold hover:bg-[#f7f5f0] cursor-pointer"
                  >
                    Testar Protótipo MVP
                  </button>
                  {leads.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportLeads}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#d6cfc2] text-[#525c56] text-sm font-semibold hover:text-[#161d19] cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Exportar Leads ({leads.length})
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#161d19]">
                    1. Qual é o seu perfil principal?
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('cavaleiro')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'cavaleiro'
                          ? 'border-[#142e22] bg-[#142e22]/5 ring-2 ring-[#142e22]/15'
                          : 'border-[#e2dcd0] bg-white hover:border-[#bfb5a3]'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#161d19]">
                        Cavaleiro / Proprietário / Centro
                      </div>
                      <div className="text-xs text-[#525c56] mt-1">
                        Procuro grooms, ferradores, vets ou transporte.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange('profissional')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'profissional'
                          ? 'border-[#94522a] bg-[#94522a]/5 ring-2 ring-[#94522a]/15'
                          : 'border-[#e2dcd0] bg-white hover:border-[#bfb5a3]'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#161d19]">
                        Profissional / Prestador de Serviços
                      </div>
                      <div className="text-xs text-[#525c56] mt-1">
                        Presto serviços de groom, ferração, vet ou transporte.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#161d19]">
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
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#142e22] text-white border-[#142e22]'
                              : 'bg-[#f7f5f0] text-[#161d19] border-[#e2dcd0] hover:border-[#142e22]/40'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#161d19]">
                      3. Região principal
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#161d19]">
                      4. {role === 'cavaleiro' ? 'Frequência de contratação' : 'Disponibilidade habitual'}
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                    >
                      {(role === 'cavaleiro' ? FREQUENCIES_RIDER : FREQUENCIES_PRO).map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#161d19]">
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#94522a] text-white border-[#94522a]'
                              : 'bg-white text-[#4c5650] border-[#e2dcd0] hover:border-[#94522a]/50'
                          }`}
                        >
                          {diff}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#161d19]">Nome completo *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Quaresma"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#161d19]">
                      WhatsApp / Telemóvel *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: 912 345 678"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#161d19]">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@exemplo.pt"
                      className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={interestedInVip}
                      onChange={(e) => setInterestedInVip(e.target.checked)}
                      className="mt-0.5 rounded border-[#d8d0c3] text-[#142e22] focus:ring-[#142e22]"
                    />
                    <span className="text-xs text-[#4c5650] leading-relaxed">
                      Quero acesso às condições de fundador do{' '}
                      <strong className="text-[#161d19]">Plano VIP / Premium</strong> (destaque
                      prioritário nas pesquisas e selo verificado).
                    </span>
                  </label>

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sugestões, concursos habituais ou funcionalidades que gostava de ver? (opcional)"
                    className="w-full rounded-xl border border-[#d8d0c3] bg-white text-[#161d19] placeholder:text-[#8c948e] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#142e22]/25"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#94522a] hover:bg-[#7d4320] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
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
      <section className="max-w-3xl mx-auto space-y-5">
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94522a]">
            Perguntas Frequentes
          </span>
          <h2 className="!font-sans text-2xl font-bold tracking-tight text-[#161d19]">
            Dúvidas sobre o lançamento
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white border border-[#e6e0d5] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm text-[#161d19]">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5c6660] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-sm text-[#525c56] leading-relaxed border-t border-[#f3efe6] pt-3">
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
