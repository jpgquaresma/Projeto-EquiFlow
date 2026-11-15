import React, { useRef, useState } from 'react';
import {
  Check,
  X,
  ShieldCheck,
  Calendar,
  Euro,
  Camera,
  MapPin,
  Briefcase,
  Truck,
  Save,
} from 'lucide-react';
import type {
  Booking,
  BookingStatus,
  Professional,
  ProfessionalProfileUpdate,
  RateUnit,
  Region,
  ServiceCategory,
} from '../types/equiflow';

interface ProfessionalAreaViewProps {
  professional: Professional;
  bookings: Booking[];
  onToggleAvailability: (proId: string) => void;
  onUpdateProfile: (proId: string, updates: ProfessionalProfileUpdate) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Groom / Tratador',
  'Ferrador',
  'Veterinário / Emergência',
  'Transporte',
  'Treinador',
];

const REGIONS: Region[] = [
  'Lisboa & Tejo',
  'Ribatejo / Golegã',
  'Algarve / Vilamoura',
  'Porto & Norte',
  'Alentejo',
];

const RATE_UNITS: { value: RateUnit; label: string; hint?: string }[] = [
  { value: 'hora', label: 'Por hora' },
  { value: 'dia', label: 'Por dia' },
  { value: 'cavalo', label: 'Por cavalo' },
  { value: 'serviço', label: 'Por serviço' },
  { value: 'km', label: 'Por km', hint: 'Transporte de cavalos' },
];

const AVATAR_PRESETS = [
  '/images/groom1.jpg',
  '/images/groom2.jpg',
  '/images/groom3.jpg',
  '/images/groom4.jpg',
];

const BIO_MAX_LENGTH = 200;

export const ProfessionalAreaView: React.FC<ProfessionalAreaViewProps> = ({
  professional,
  bookings,
  onToggleAvailability,
  onUpdateProfile,
  onUpdateBookingStatus,
}) => {
  const [nameInput, setNameInput] = useState(professional.name);
  const [categoryInput, setCategoryInput] = useState<ServiceCategory>(professional.category);
  const [avatarInput, setAvatarInput] = useState(professional.avatar);
  const [rateInput, setRateInput] = useState<number>(professional.dailyRate);
  const [rateUnitInput, setRateUnitInput] = useState<RateUnit>(professional.rateUnit);
  const [regionInput, setRegionInput] = useState<Region>(professional.region);
  const [cityInput, setCityInput] = useState(professional.city);
  const [experienceInput, setExperienceInput] = useState<number>(professional.experienceYears);
  const [bioInput, setBioInput] = useState(professional.bio.slice(0, BIO_MAX_LENGTH));
  const [savedNotice, setSavedNotice] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Seleciona um ficheiro de imagem válido (JPG, PNG, WebP).');
      return;
    }

    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (nextCategory: ServiceCategory) => {
    setCategoryInput(nextCategory);
    if (nextCategory === 'Transporte' && rateUnitInput !== 'km') {
      setRateUnitInput('km');
      if (rateInput >= 20) {
        setRateInput(1.5);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedRate = Number.isFinite(rateInput) && rateInput > 0 ? rateInput : 1;
    const sanitizedExp = Number.isFinite(experienceInput) && experienceInput >= 0 ? Math.floor(experienceInput) : 0;

    onUpdateProfile(professional.id, {
      name: nameInput.trim() || professional.name,
      category: categoryInput,
      avatar: avatarInput || professional.avatar,
      dailyRate: sanitizedRate,
      rateUnit: rateUnitInput,
      region: regionInput,
      city: cityInput.trim() || regionInput,
      experienceYears: sanitizedExp,
      bio: bioInput.trim().slice(0, BIO_MAX_LENGTH),
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const remainingChars = BIO_MAX_LENGTH - bioInput.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
          Sou Profissional — Perfil & Gestão
        </h2>
        <p className="text-sm text-[#5c645e]">
          Edita a tua fotografia, tipo de tarifa (hora, dia, cavalo, serviço ou km), região, experiência e apresentação.
        </p>
      </div>

      {/* Profile Summary & Availability */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={avatarInput}
            alt={nameInput}
            className="w-16 h-16 rounded-full object-cover border border-[#e5dfd3] shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-display font-semibold text-xl text-[#1e2420]">
                {professional.name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#1c3a2d]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a5b32]">
              {professional.category} • {professional.region} • {professional.experienceYears} anos exp.
            </p>
            <p className="text-xs text-[#5c645e] mt-1">
              Tarifa atual: <strong className="text-[#1e2420]">{professional.dailyRate} € / {professional.rateUnit}</strong> • {professional.completedJobs} serviços concluídos • Avaliação {professional.rating.toFixed(1)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleAvailability(professional.id)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
            professional.availableNow
              ? 'bg-[#1c3a2d]/10 border-[#1c3a2d] text-[#1c3a2d]'
              : 'bg-[#f1ede4] border-[#e5dfd3] text-[#5c645e]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {professional.availableNow ? 'Disponível agora (Ativo)' : 'Indisponível (Pausado)'}
        </button>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-6"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#e5dfd3] pb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-[#1e2420]">
              Editar Perfil Profissional
            </h3>
            <p className="text-xs text-[#5c645e]">
              As alterações ficam visíveis de imediato na pesquisa, mapa e comparação de profissionais.
            </p>
          </div>
          {savedNotice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1c3a2d]/10 text-[#1c3a2d]">
              <Check className="w-3.5 h-3.5" />
              Perfil guardado
            </span>
          )}
        </div>

        {/* Photo Upload & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-[#f9f7f2] border border-[#e5dfd3]">
          <div className="relative shrink-0 self-start sm:self-center">
            <img
              src={avatarInput}
              alt="Fotografia de perfil"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1c3a2d] text-[#f9f7f2] flex items-center justify-center shadow-sm hover:bg-[#142a20] cursor-pointer"
              title="Alterar fotografia"
              aria-label="Alterar fotografia"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            <div>
              <span className="block text-xs font-semibold text-[#1e2420]">
                Fotografia de Perfil
              </span>
              <p className="text-xs text-[#5c645e]">
                Carrega uma fotografia tua do dispositivo ou escolhe uma pré-visualização.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Selecionar fotografia de perfil"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#e5dfd3] text-xs font-semibold text-[#1e2420] hover:border-[#1c3a2d] cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#1c3a2d]" />
                Carregar fotografia
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#5c645e]">Modelos:</span>
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAvatarInput(preset);
                      setPhotoError(null);
                    }}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarInput === preset ? 'border-[#1c3a2d] scale-110' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    title={`Usar fotografia ${idx + 1}`}
                  >
                    <img src={preset} alt={`Modelo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {photoError && (
              <p className="text-xs text-red-700 font-medium">{photoError}</p>
            )}
          </div>
        </div>

        {/* Basic Info: Name, Category, Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="pro-name" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
              Nome profissional
            </label>
            <input
              id="pro-name"
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] text-sm text-[#1e2420] focus:outline-none focus:border-[#1c3a2d]"
              placeholder="O teu nome"
            />
          </div>

          <div>
            <label htmlFor="pro-category" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
              Área de serviço
            </label>
            <select
              id="pro-category"
              value={categoryInput}
              onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] bg-white text-sm text-[#1e2420] focus:outline-none focus:border-[#1c3a2d] cursor-pointer"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pro-experience" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
              Anos de experiência
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-[#5c645e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="pro-experience"
                type="number"
                min={0}
                max={60}
                required
                value={experienceInput}
                onChange={(e) => setExperienceInput(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-[#e5dfd3] text-sm font-semibold text-[#1e2420] focus:outline-none focus:border-[#1c3a2d]"
              />
              <span className="text-xs text-[#5c645e] absolute right-3.5 top-1/2 -translate-y-1/2">
                anos
              </span>
            </div>
          </div>
        </div>

        {/* Region & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pro-region" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
              Região em que trabalhas
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#9a5b32] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="pro-region"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value as Region)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e5dfd3] bg-white text-sm text-[#1e2420] focus:outline-none focus:border-[#1c3a2d] cursor-pointer"
              >
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="pro-city" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
              Concelhos / Zona específica
            </label>
            <input
              id="pro-city"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] text-sm text-[#1e2420] focus:outline-none focus:border-[#1c3a2d]"
              placeholder="Ex: Cascais / Campo Grande, ou Todo o País"
            />
          </div>
        </div>

        {/* Pricing Model & Rate */}
        <div className="p-4 rounded-xl bg-[#f9f7f2] border border-[#e5dfd3] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="block text-xs font-semibold text-[#1e2420]">
                Modelo de cobrança e tarifa
              </span>
              <p className="text-xs text-[#5c645e]">
                Escolhe se trabalhas por hora, por dia, por cavalo, por serviço ou por km (ideal para transportadores de cavalos).
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#e5dfd3] text-[#1c3a2d]">
              {rateInput} € / {rateUnitInput}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {RATE_UNITS.map((unit) => {
              const active = rateUnitInput === unit.value;
              return (
                <button
                  key={unit.value}
                  type="button"
                  onClick={() => setRateUnitInput(unit.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1c3a2d] text-[#f9f7f2] border-[#1c3a2d]'
                      : 'bg-white text-[#5c645e] border-[#e5dfd3] hover:border-[#1c3a2d] hover:text-[#1e2420]'
                  }`}
                >
                  {unit.value === 'km' && <Truck className="w-3.5 h-3.5" />}
                  <span>{unit.label}</span>
                  {unit.hint && (
                    <span className={`text-[10px] ${active ? 'text-[#f9f7f2]/80' : 'text-[#9a5b32]'}`}>
                      ({unit.hint})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label htmlFor="pro-rate" className="block text-xs font-semibold text-[#1e2420] mb-1.5">
                Valor da tarifa (€ / {rateUnitInput})
              </label>
              <div className="relative">
                <Euro className="w-4 h-4 text-[#5c645e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="pro-rate"
                  type="number"
                  min={0.5}
                  step="0.5"
                  required
                  value={rateInput}
                  onChange={(e) => setRateInput(Number(e.target.value))}
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white border border-[#e5dfd3] text-sm font-semibold text-[#1e2420] focus:outline-none focus:border-[#1c3a2d]"
                />
                <span className="text-xs font-medium text-[#5c645e] absolute right-3.5 top-1/2 -translate-y-1/2">
                  € / {rateUnitInput}
                </span>
              </div>
            </div>

            {categoryInput === 'Transporte' && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#e5dfd3] text-xs text-[#5c645e]">
                <Truck className="w-4 h-4 text-[#9a5b32] shrink-0" />
                <span>
                  <strong className="text-[#1e2420]">Modo Transportador:</strong> Podes definir o preço por <strong>km</strong> (ex: 1,50 €/km) ou por <strong>serviço/dia</strong>.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Short Bio (max 200 chars) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="pro-bio" className="block text-xs font-semibold text-[#1e2420]">
              Pequena descrição profissional
            </label>
            <span
              className={`text-xs font-semibold ${
                remainingChars <= 20 ? 'text-[#9a5b32]' : 'text-[#5c645e]'
              }`}
            >
              {bioInput.length} / {BIO_MAX_LENGTH} caracteres
            </span>
          </div>
          <textarea
            id="pro-bio"
            rows={3}
            maxLength={BIO_MAX_LENGTH}
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value.slice(0, BIO_MAX_LENGTH))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] text-sm text-[#1e2420] focus:outline-none focus:border-[#1c3a2d]"
            placeholder="Descreve brevemente a tua experiência, especialidades e disponibilidade (máx. 200 caracteres)..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {savedNotice ? 'Alterações Guardadas!' : 'Guardar Perfil'}
          </button>
        </div>
      </form>

      {/* Incoming Booking Requests */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-[#1e2420]">
          Pedidos Recebidos ({bookings.length})
        </h3>

        <div className="space-y-3">
          {bookings.map((bk) => (
            <div
              key={bk.id}
              className="p-4 rounded-xl bg-[#f9f7f2] border border-[#e5dfd3] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1e2420]">
                    {bk.eventOrLocation}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#e5dfd3] text-[#1c3a2d]">
                    {bk.status}
                  </span>
                </div>
                <p className="text-xs text-[#5c645e] mt-1">
                  Início: {bk.startDate} • {bk.days} {bk.rateUnit ?? 'dia'}(s) • {bk.horsesCount} cavalo(s) • Valor: <strong>{Number((bk.dailyRate * bk.days).toFixed(2))} €</strong>
                </p>
                {bk.notes && (
                  <p className="text-xs text-[#1e2420] mt-1 italic">“{bk.notes}”</p>
                )}
              </div>

              {bk.status === 'Pedido' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateBookingStatus(bk.id, 'Recusado')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#e5dfd3] bg-white text-xs font-semibold text-[#5c645e] hover:text-red-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Recusar
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBookingStatus(bk.id, 'Confirmado')}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] text-xs font-semibold hover:bg-[#142a20] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aceitar Pedido
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
