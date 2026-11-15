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

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onExploreMvp }) => {
  const [role, setRole] = useState<LeadRole>('cavaleiro');
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
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#173326] text-[#f8f6f1] border border-[#254d3a] shadow-lg">
        <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#244a38] border border-[#366b52] text-xs font-semibold uppercase tracking-wider text-[#e9dfd0]">
              <Sparkles className="w-3.5 h-3.5 text-[#d99b66]" />
              Acesso Antecipado • Portugal Continental
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12]">
              Profissionais equestres verificados, sem depender de grupos de WhatsApp.
            </h1>

            <p className="text-[#d7e0db] text-base sm:text-lg leading-relaxed max-w-2xl">
              O <strong className="text-white">EquiFlow</strong> liga cavaleiros, proprietários e coudelarias a{' '}
              <strong className="text-white">Grooms, Ferradores, Veterinários Equinos e Transporte DGAV</strong> em todo o país — com verificação documental rigorosa e resposta rápida em provas.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#94522a] hover:bg-[#7d4320] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                Garantir Acesso Antecipado
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreMvp}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#244a38] hover:bg-[#2f5d47] text-[#f8f6f1] font-medium text-sm border border-[#3d745a] transition-colors cursor-pointer"
              >
                Explorar Protótipo Interativo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-[#c5d3cb]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#d99b66]" />
                Validação documental obrigatória
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#d99b66]" />
                Lisboa, Golegã, Vilamoura, Norte e Alentejo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#d99b66]" />
                Registo 100% online em 2 minutos
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#2f5b46] bg-[#12281e] shadow-xl">
              <img
                src="/images/hero.jpg"
                alt="Equipa equestre e cavalos em preparação"
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#d99b66]">
                    Lançamento Nacional
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#244a38] text-[#e9dfd0]">
                    {142 + leads.length} inscritos na lista
                  </span>
                </div>
                <p className="text-sm text-[#e7ece9] leading-snug">
                  Estamos a validar os primeiros cavaleiros e profissionais fundadores para abertura prioritária por região.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Categories */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
              4 Categorias Essenciais desde o Dia 1
            </h2>
            <p className="text-sm text-[#5c645e]">
              Tudo o que um cavaleiro, estábulo ou concurso precisa num único lugar.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Grooms & Tratadores',
              desc: 'Apoio em concursos CSN/CSI, trabalho diário de estábulo, preparação e cuidados.',
              icon: <UserCheck className="w-5 h-5 text-[#173326]" />,
              badge: 'Provas & Estábulo',
            },
            {
              title: 'Ferradores',
              desc: 'Ferração corretiva, manutenção de rotina e substituições urgentes em prova.',
              icon: <Hammer className="w-5 h-5 text-[#94522a]" />,
              badge: 'Rotina & Urgência',
            },
            {
              title: 'Veterinários Equinos',
              desc: 'Cédula verificada, piquete de emergência em concursos e acompanhamento clínico.',
              icon: <Stethoscope className="w-5 h-5 text-[#173326]" />,
              badge: 'Cédula OMV',
            },
            {
              title: 'Transporte DGAV',
              desc: 'Reboques e camiões certificados para deslocações nacionais e internacionais.',
              icon: <Truck className="w-5 h-5 text-[#94522a]" />,
              badge: 'Licença DGAV',
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="rounded-2xl bg-white border border-[#e5dfd3] p-5 shadow-xs hover:border-[#94522a]/50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#f3efe6] flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f8f6f1] text-[#5c645e] border border-[#e5dfd3]">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base text-[#1e2420]">{cat.title}</h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Monetization */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-[#e5dfd3] p-6 sm:p-7 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#173326]">
            <ShieldCheck className="w-4 h-4" />
            Verificação Documental Rigorosa
          </div>
          <h3 className="font-display text-xl font-semibold text-[#1e2420]">
            Auto-registo online, publicação apenas após validação
          </h3>
          <p className="text-sm text-[#5c645e] leading-relaxed">
            Qualquer profissional pode registar-se diretamente através do link de adesão sem burocracia presencial — mas nenhum perfil fica visível ao público antes de validarmos os documentos essenciais.
          </p>
          <ul className="space-y-2.5 text-sm text-[#1e2420]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#173326] shrink-0 mt-0.5" />
              <span>Identificação civil verificada (Cartão de Cidadão / NIF)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#173326] shrink-0 mt-0.5" />
              <span>Cédula profissional da Ordem dos Médicos Veterinários (para Veterinários)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#173326] shrink-0 mt-0.5" />
              <span>Licença de transporte de animais vivos DGAV (para Transportadores)</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#fcfaf5] to-[#f3eadc] border border-[#dfc9aa] p-6 sm:p-7 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94522a]">
            <Crown className="w-4 h-4" />
            Modelo de Adesão & Plano VIP / Premium
          </div>
          <h3 className="font-display text-xl font-semibold text-[#1e2420]">
            Descoberta e reservas gratuitas — destaque VIP opcional
          </h3>
          <p className="text-sm text-[#5c645e] leading-relaxed">
            Pesquisar, comparar e reservar é gratuito. Os profissionais que queiram acelerar a sua agenda podem ativar a subscrição <strong className="text-[#1e2420]">EquiFlow VIP</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl bg-white/90 border border-[#e5dfd3] p-4 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5c645e]">Base</div>
              <div className="font-display text-lg font-bold text-[#1e2420]">Gratuito</div>
              <p className="text-xs text-[#5c645e]">
                Perfil verificado, receção de pedidos e chat direto com cavaleiros.
              </p>
            </div>
            <div className="rounded-xl bg-[#173326] text-white border border-[#2a5440] p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#d99b66]">
                <Award className="w-3.5 h-3.5" />
                VIP / Premium
              </div>
              <div className="font-display text-lg font-bold">Topo das Pesquisas</div>
              <p className="text-xs text-[#d7e0db]">
                Prioridade nas buscas por região/prova, selo VIP e destaque em urgências.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Validation & Waitlist Form */}
      <section
        id="validation-form"
        className="rounded-3xl bg-white border border-[#e5dfd3] shadow-sm p-6 sm:p-10"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#94522a]">
              Formulário de Validação & Lista de Espera
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1e2420]">
              Ajude-nos a moldar o EquiFlow na sua região
            </h2>
            <p className="text-sm text-[#5c645e]">
              Demora menos de 1 minuto. Os inscritos fundadores terão acesso prioritário no lançamento.
            </p>
          </div>

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
                  2. {role === 'cavaleiro' ? 'Que serviços contrata com mais frequência?' : 'Em que áreas atua?'}
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
                  5. Quais são as maiores dificuldades hoje no processo informal?
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
                  <label className="block text-xs font-semibold text-[#1e2420]">
                    Email *
                  </label>
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

              {/* VIP Interest & Notes */}
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
                    <strong className="text-[#1e2420]">Plano VIP / Premium</strong> (destaque prioritário nas pesquisas e selo verificado).
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#173326] hover:bg-[#11261c] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Entrar na Lista de Validação EquiFlow
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
