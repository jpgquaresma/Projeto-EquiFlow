import { useMemo, useState } from 'react';
import {
  Search,
  LayoutGrid,
  Map as MapIcon,
  ShieldCheck,
  Clock,
  Sparkles,
  Scale,
  ArrowRight,
} from 'lucide-react';
import {
  COMPETITIONS,
  INITIAL_BOOKINGS,
  INITIAL_REQUESTS,
  PROFESSIONALS,
} from './data/mockData';
import type {
  Booking,
  BookingStatus,
  OpenRequest,
  Professional,
  ProfessionalProfileUpdate,
  Region,
  ServiceCategory,
} from './types/equiflow';
import { Navbar, type ActiveTab } from './components/Navbar';
import { ProfessionalCard } from './components/ProfessionalCard';
import { MapExplorer } from './components/MapExplorer';
import { ProfileAndBookingModal } from './components/ProfileAndBookingModal';
import { CompareView } from './components/CompareView';
import { RequestsAndCompetitionsView } from './components/RequestsAndCompetitionsView';
import { BookingsAndChatView } from './components/BookingsAndChatView';
import { ProfessionalAreaView } from './components/ProfessionalAreaView';
import { LandingPageView } from './components/LandingPageView';

const CATEGORIES: ('Todas' | ServiceCategory)[] = [
  'Todas',
  'Groom / Tratador',
  'Ferrador',
  'Veterinário / Emergência',
  'Transporte',
  'Treinador',
];

const REGIONS: ('Todas' | Region)[] = [
  'Todas',
  'Lisboa & Tejo',
  'Ribatejo / Golegã',
  'Algarve / Vilamoura',
  'Porto & Norte',
  'Alentejo',
];

const SMART_EXAMPLES = [
  'Groom para concurso em Lisboa',
  'Ferrador urgente Golegã',
  'Veterinário 24h Vilamoura',
  'Transporte cavalos Norte',
];

function computeMatchScore(pro: Professional, query: string): number | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  let score = 62;
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  const haystack = [
    pro.name,
    pro.category,
    pro.headline,
    pro.region,
    pro.city,
    pro.bio,
    ...pro.specialties,
    ...pro.disciplines,
  ]
    .join(' ')
    .toLowerCase();

  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      hits += 1;
    }
  }

  if (tokens.length > 0) {
    score += Math.round((hits / tokens.length) * 26);
  }
  if (pro.availableNow) score += 5;
  if (pro.verifiedExperience) score += 4;
  if (pro.rating >= 4.9) score += 2;

  return Math.min(99, score);
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
  const [requests, setRequests] = useState<OpenRequest[]>(INITIAL_REQUESTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Discover filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ServiceCategory>('Todas');
  const [selectedRegion, setSelectedRegion] = useState<'Todas' | Region>('Todas');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Compare & Modal
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    pro: Professional;
    mode: 'profile' | 'book';
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered + Matched Professionals
  const filteredProfessionals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = professionals
      .filter((pro) => {
        if (onlyEmergency && !(pro.category === 'Veterinário / Emergência' || pro.emergencyReady)) return false;
        if (selectedCategory !== 'Todas' && pro.category !== selectedCategory) return false;
        if (selectedRegion !== 'Todas' && pro.region !== selectedRegion) return false;
        if (onlyAvailableNow && !pro.availableNow) return false;
        if (onlyVerified && !(pro.verifiedIdentity && pro.verifiedExperience)) return false;

        if (q) {
          const tokens = q.split(/\s+/).filter((t) => t.length > 2);
          const haystack = [
            pro.name,
            pro.category,
            pro.headline,
            pro.region,
            pro.city,
            pro.bio,
            ...pro.specialties,
            ...pro.disciplines,
          ]
            .join(' ')
            .toLowerCase();
          // Match if at least one meaningful token matches
          if (tokens.length > 0 && !tokens.some((t) => haystack.includes(t))) {
            return false;
          }
        }
        return true;
      })
      .map((pro) => ({
        pro,
        matchScore: computeMatchScore(pro, searchQuery),
      }));

    if (searchQuery.trim()) {
      list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }
    return list;
  }, [professionals, searchQuery, selectedCategory, selectedRegion, onlyAvailableNow, onlyVerified, onlyEmergency]);

  const comparedProfessionals = useMemo(
    () => professionals.filter((p) => compareIds.includes(p.id)),
    [professionals, compareIds]
  );

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        showToast('Podes comparar até 3 profissionais em simultâneo.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCreateBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setModalState(null);
    setActiveTab('bookings');
    showToast(`Pedido de reserva enviado para ${newBooking.professionalName}!`);
  };

  const handleSendMessage = (bookingId: string, text: string) => {
    const time = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    setBookings((prev) =>
      prev.map((bk) =>
        bk.id === bookingId
          ? {
              ...bk,
              messages: [
                ...bk.messages,
                { id: `msg-${Date.now()}`, sender: 'user', text, time },
              ],
            }
          : bk
      )
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === bookingId ? { ...bk, status } : bk))
    );
    showToast(`Estado da reserva atualizado para: ${status}`);
  };

  const handlePublishRequest = (req: OpenRequest) => {
    setRequests((prev) => [req, ...prev]);
    showToast('Pedido publicado! Os profissionais na zona serão notificados.');
  };

  const handleEmergencyClick = () => {
    setActiveTab('discover');
    setSelectedCategory('Veterinário / Emergência');
    setSelectedRegion('Todas');
    setSearchQuery('');
    setOnlyEmergency(true);
    showToast('🚨 Apoio de Urgência 24h ativado: veterinários disponíveis a qualquer momento.');
  };

  const handleToggleProAvailability = (proId: string) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === proId ? { ...p, availableNow: !p.availableNow } : p))
    );
    showToast('Disponibilidade atualizada na plataforma.');
  };

  const handleUpdateProProfile = (proId: string, updates: ProfessionalProfileUpdate) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === proId ? { ...p, ...updates } : p))
    );
    setBookings((prev) =>
      prev.map((bk) =>
        bk.professionalId === proId
          ? {
              ...bk,
              professionalName: updates.name,
              professionalAvatar: updates.avatar,
              professionalCategory: updates.category,
            }
          : bk
      )
    );
    showToast('Perfil profissional atualizado com sucesso.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f2] text-[#1e2420]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        compareCount={compareIds.length}
        bookingsCount={bookings.length}
        onEmergencyClick={handleEmergencyClick}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discover' && (
          <div className="space-y-8">
            {/* Editorial Hero + Smart Search */}
            <section className="bg-white rounded-2xl border border-[#e5dfd3] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1e2420] leading-[1.15] tracking-tight">
                  Encontra o profissional equestre certo, sem depender de contactos informais.
                </h1>
                <p className="text-sm sm:text-base text-[#5c645e] mt-3.5 max-w-xl leading-relaxed">
                  Pesquisa grooms, tratadores, ferradores, transporte e apoio veterinário em Portugal. Compara perfis verificados, confirma disponibilidade e reserva diretamente.
                </p>

                {/* Smart Search Bar */}
                <div className="mt-6">
                  <label htmlFor="smart-search-input" className="sr-only">
                    Pesquisa inteligente
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-5 h-5 text-[#5c645e] absolute left-4 pointer-events-none" />
                    <input
                      id="smart-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Escreve o que precisas: ex. groom para concurso em Lisboa..."
                      className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-[#f9f7f2] border border-[#e5dfd3] text-sm text-[#1e2420] placeholder:text-[#5c645e]/80 focus:outline-none focus:border-[#1c3a2d] focus:bg-white transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 px-2.5 py-1 rounded-md text-xs font-medium text-[#5c645e] hover:text-[#1e2420] bg-[#f1ede4] cursor-pointer"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  {/* Quick Smart Examples */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5c645e] mr-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#b98b48]" />
                      Sugestões:
                    </span>
                    {SMART_EXAMPLES.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setSearchQuery(example)}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#f9f7f2] border border-[#e5dfd3] text-[#5c645e] hover:border-[#1c3a2d] hover:text-[#1c3a2d] transition-colors cursor-pointer"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full">
                <img
                  src="/images/hero.jpg"
                  alt="Groom profissional a preparar cavalo antes de concurso"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Filters & View Toggle */}
            <section
              aria-label="Filtros de pesquisa"
              className="bg-white rounded-xl border border-[#e5dfd3] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label="Filtrar por categoria"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'Todas' | ServiceCategory)}
                  className="px-3 py-2 rounded-lg border border-[#e5dfd3] bg-[#f9f7f2] text-sm font-medium text-[#1e2420] focus:outline-none focus:border-[#1c3a2d] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'Todas' ? 'Todas as categorias' : cat}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filtrar por região"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as 'Todas' | Region)}
                  className="px-3 py-2 rounded-lg border border-[#e5dfd3] bg-[#f9f7f2] text-sm font-medium text-[#1e2420] focus:outline-none focus:border-[#1c3a2d] cursor-pointer"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg === 'Todas' ? 'Todas as regiões' : reg}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setOnlyAvailableNow((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    onlyAvailableNow
                      ? 'bg-[#1c3a2d] text-[#f9f7f2] border-[#1c3a2d]'
                      : 'bg-[#f9f7f2] text-[#5c645e] border-[#e5dfd3] hover:text-[#1e2420]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Disponível agora
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyVerified((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    onlyVerified
                      ? 'bg-[#1c3a2d] text-[#f9f7f2] border-[#1c3a2d]'
                      : 'bg-[#f9f7f2] text-[#5c645e] border-[#e5dfd3] hover:text-[#1e2420]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificação completa
                </button>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-3">
                <span className="text-xs font-medium text-[#5c645e]">
                  {filteredProfessionals.length} profissional(is)
                </span>

                <div className="inline-flex rounded-lg border border-[#e5dfd3] bg-[#f9f7f2] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#1e2420] shadow-xs'
                        : 'text-[#5c645e] hover:text-[#1e2420]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-white text-[#1e2420] shadow-xs'
                        : 'text-[#5c645e] hover:text-[#1e2420]'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    Mapa
                  </button>
                </div>
              </div>
            </section>

            {/* Emergency Active Callout Banner */}
            {onlyEmergency && (
              <div className="bg-[#f9efe8] border-2 border-[#94522a] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#94522a] text-white flex items-center justify-center shrink-0 shadow-xs text-xl">
                    🚨
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-base text-[#94522a]">
                        Apoio de Urgência Veterinária 24h Ativo
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#94522a] text-white uppercase tracking-wider">
                        A qualquer momento
                      </span>
                    </div>
                    <p className="text-xs text-[#5c645e] mt-0.5">
                      A filtrar médicos veterinários com piquete ativo e unidade móvel (cólicas, suturas, imprevistos a qualquer hora).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyEmergency(false);
                    setSelectedCategory('Todas');
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#94522a]/40 text-[#94522a] hover:bg-[#94522a] hover:text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  ✕ Desativar Urgência / Ver Todos
                </button>
              </div>
            )}

            {/* Results: List or Map */}
            {viewMode === 'list' ? (
              filteredProfessionals.length > 0 ? (
                <section
                  aria-label="Lista de profissionais"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {filteredProfessionals.map(({ pro, matchScore }) => (
                    <ProfessionalCard
                      key={pro.id}
                      pro={pro}
                      matchScore={matchScore}
                      isCompared={compareIds.includes(pro.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenProfile={(p, mode = 'profile') => setModalState({ pro: p, mode })}
                    />
                  ))}
                </section>
              ) : (
                <div className="bg-white rounded-xl border border-[#e5dfd3] p-10 text-center">
                  <p className="font-display text-xl font-semibold text-[#1e2420]">
                    Nenhum profissional encontrado com estes filtros
                  </p>
                  <p className="text-sm text-[#5c645e] mt-1">
                    Experimenta alargar a região ou publicar um pedido aberto para receberes propostas.
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('Todas');
                        setSelectedRegion('Todas');
                        setOnlyAvailableNow(false);
                        setOnlyVerified(false);
                      }}
                      className="px-4 py-2 rounded-lg border border-[#e5dfd3] text-sm font-medium hover:bg-[#f1ede4] cursor-pointer"
                    >
                      Limpar filtros
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('requests')}
                      className="px-4 py-2 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] cursor-pointer"
                    >
                      Publicar Pedido
                    </button>
                  </div>
                </div>
              )
            ) : (
              <MapExplorer
                professionals={filteredProfessionals.map((item) => item.pro)}
                onOpenProfile={(p, mode = 'profile') => setModalState({ pro: p, mode })}
              />
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <RequestsAndCompetitionsView
            requests={requests}
            competitions={COMPETITIONS}
            onPublishRequest={handlePublishRequest}
            onFilterByRegion={(region) => {
              setSelectedRegion(region);
              setSelectedCategory('Todas');
              setActiveTab('discover');
            }}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            professionals={comparedProfessionals}
            onRemoveCompare={handleToggleCompare}
            onOpenProfile={(p, mode = 'book') => setModalState({ pro: p, mode })}
            onGoToDiscover={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsAndChatView
            bookings={bookings}
            onSendMessage={handleSendMessage}
            onUpdateStatus={handleUpdateBookingStatus}
            onGoToDiscover={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'pro-area' && (
          <ProfessionalAreaView
            professional={professionals[0]}
            bookings={bookings.filter((b) => b.professionalId === professionals[0].id)}
            onToggleAvailability={handleToggleProAvailability}
            onUpdateProfile={handleUpdateProProfile}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {activeTab === 'landing' && (
          <LandingPageView onExploreMvp={() => setActiveTab('discover')} />
        )}
      </main>

      {/* Floating Compare Bar */}
      {compareIds.length > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#1c3a2d] text-[#f9f7f2] px-5 py-3 rounded-full shadow-lg flex items-center gap-4">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Scale className="w-4 h-4 text-[#b98b48]" />
            {compareIds.length} profissional(is) para comparar
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f9f7f2] text-[#1c3a2d] text-xs font-bold hover:bg-[#f1ede4] cursor-pointer"
          >
            Comparar agora
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-[#1e2420] text-[#f9f7f2] px-4 py-3 rounded-xl shadow-lg text-sm font-medium border border-white/10"
        >
          {toastMessage}
        </div>
      )}

      {/* Profile & Booking Modal */}
      {modalState && (
        <ProfileAndBookingModal
          pro={modalState.pro}
          initialMode={modalState.mode}
          onClose={() => setModalState(null)}
          onCreateBooking={handleCreateBooking}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#e5dfd3] bg-white/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5c645e]">
          <span>
            <strong className="text-[#1e2420]">EquiFlow</strong> — Encontrar → Filtrar → Confiar → Comparar → Contactar → Reservar → Resolver
          </span>
          <span>MVP • Setor Equestre Portugal</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
