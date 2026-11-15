import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
} from 'lucide-react';
import type { Booking, Professional } from '../types/equiflow';

interface ProfileAndBookingModalProps {
  pro: Professional;
  initialMode: 'profile' | 'book';
  onClose: () => void;
  onCreateBooking: (booking: Booking) => void;
}

export const ProfileAndBookingModal: React.FC<ProfileAndBookingModalProps> = ({
  pro,
  initialMode,
  onClose,
  onCreateBooking,
}) => {
  const [mode, setMode] = useState<'profile' | 'book'>(initialMode);
  const [eventOrLocation, setEventOrLocation] = useState('CSN Sociedade Hípica Portuguesa (Lisboa)');
  const [startDate, setStartDate] = useState('2026-11-21');
  const [days, setDays] = useState(pro.rateUnit === 'km' ? 100 : 2);
  const [horsesCount, setHorsesCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'MB WAY' | 'Transferência'>('MB WAY');
  const [notes, setNotes] = useState('');

  const quantityForRate = pro.rateUnit === 'cavalo' ? horsesCount : days;
  const unitLabel =
    pro.rateUnit === 'km'
      ? 'Distância estimada (km)'
      : pro.rateUnit === 'hora'
        ? 'Nº de horas'
        : pro.rateUnit === 'serviço'
          ? 'Nº de serviços'
          : 'Nº de dias';

  const platformFee = 2;
  const subtotal = Number((pro.dailyRate * quantityForRate).toFixed(2));
  const total = Number((subtotal + platformFee).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      professionalId: pro.id,
      professionalName: pro.name,
      professionalAvatar: pro.avatar,
      professionalCategory: pro.category,
      eventOrLocation,
      startDate,
      days: quantityForRate,
      horsesCount,
      dailyRate: pro.dailyRate,
      rateUnit: pro.rateUnit,
      platformFee,
      total,
      status: 'Pedido',
      paymentMethod,
      notes: notes || `${horsesCount} cavalo(s) • ${quantityForRate} ${pro.rateUnit}(s)`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: `Olá ${pro.name.split(' ')[0]}, enviei um pedido de reserva para ${eventOrLocation} (${quantityForRate} ${pro.rateUnit}(s), ${horsesCount} cavalo(s)).`,
          time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    onCreateBooking(newBooking);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1e2420]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pro-name"
    >
      <div className="bg-white rounded-2xl border border-[#e5dfd3] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-[#e5dfd3] px-6 py-4 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-12 h-12 rounded-full object-cover border border-[#e5dfd3]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 id="modal-pro-name" className="font-display font-semibold text-xl text-[#1e2420]">
                  {pro.name}
                </h2>
                {pro.verifiedIdentity && (
                  <ShieldCheck className="w-4 h-4 text-[#1c3a2d]" />
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9a5b32]">
                {pro.category} • {pro.dailyRate} €/{pro.rateUnit}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#5c645e] hover:bg-[#f1ede4] hover:text-[#1e2420] cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-4 flex gap-2 border-b border-[#e5dfd3]">
          <button
            type="button"
            onClick={() => setMode('profile')}
            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              mode === 'profile'
                ? 'border-[#1c3a2d] text-[#1c3a2d]'
                : 'border-transparent text-[#5c645e] hover:text-[#1e2420]'
            }`}
          >
            Perfil & Disponibilidade
          </button>
          <button
            type="button"
            onClick={() => setMode('book')}
            className={`pb-3 px-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              mode === 'book'
                ? 'border-[#1c3a2d] text-[#1c3a2d]'
                : 'border-transparent text-[#5c645e] hover:text-[#1e2420]'
            }`}
          >
            Pedir Reserva & Contactar
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === 'profile' ? (
            <div className="space-y-6">
              {/* Trust & Quick Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f9f7f2] p-4 rounded-xl border border-[#e5dfd3]">
                <div>
                  <span className="text-xs text-[#5c645e] block">Avaliação</span>
                  <span className="inline-flex items-center gap-1 font-bold text-sm text-[#1e2420]">
                    <Star className="w-4 h-4 fill-[#b98b48] text-[#b98b48]" />
                    {pro.rating.toFixed(1)} ({pro.reviewCount})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5c645e] block">Experiência</span>
                  <span className="font-bold text-sm text-[#1e2420]">{pro.experienceYears} anos</span>
                </div>
                <div>
                  <span className="text-xs text-[#5c645e] block">Serviços</span>
                  <span className="font-bold text-sm text-[#1e2420]">{pro.completedJobs} concluídos</span>
                </div>
                <div>
                  <span className="text-xs text-[#5c645e] block">Resposta</span>
                  <span className="inline-flex items-center gap-1 font-bold text-sm text-[#1e2420]">
                    <Clock className="w-3.5 h-3.5 text-[#1c3a2d]" />
                    {pro.responseTime}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold text-sm text-[#1e2420] mb-1.5">Sobre o profissional</h3>
                <p className="text-sm text-[#5c645e] leading-relaxed">{pro.bio}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#5c645e]">
                  <MapPin className="w-4 h-4 text-[#9a5b32]" />
                  <span>Zona de atuação: <strong className="text-[#1e2420]">{pro.city} ({pro.region})</strong></span>
                </div>
              </div>

              {/* Verification badges */}
              <div>
                <h3 className="font-semibold text-sm text-[#1e2420] mb-2">Verificação & Confiança</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#1c3a2d]/10 text-[#1c3a2d] px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Identidade Verificada
                  </span>
                  {pro.verifiedExperience && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#1c3a2d]/10 text-[#1c3a2d] px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      Experiência & Referências Confirmadas
                    </span>
                  )}
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <h3 className="font-semibold text-sm text-[#1e2420] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#9a5b32]" />
                  Disponibilidade (Próximos 7 dias)
                </h3>
                <div className="grid grid-cols-7 gap-1.5">
                  {pro.availabilityDays.map((d) => (
                    <div
                      key={d.label}
                      className={`p-2 rounded-lg text-center border text-xs ${
                        d.available
                          ? 'bg-[#1c3a2d]/8 border-[#1c3a2d]/30 text-[#1c3a2d]'
                          : 'bg-[#f1ede4] border-[#e5dfd3] text-[#5c645e] opacity-60'
                      }`}
                    >
                      <span className="block font-bold">{d.day}</span>
                      <span className="block text-[10px]">{d.label}</span>
                      <span className="block text-[10px] font-semibold mt-1">
                        {d.available ? 'Livre' : 'Ocup.'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-semibold text-sm text-[#1e2420] mb-2">
                  Avaliações recentes ({pro.reviews.length})
                </h3>
                {pro.reviews.length > 0 ? (
                  <div className="space-y-2.5">
                    {pro.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-xl bg-[#f9f7f2] border border-[#e5dfd3]"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#1e2420]">
                            {rev.author} <span className="font-normal text-[#5c645e]">• {rev.role}</span>
                          </span>
                          <span className="text-[#5c645e]">{rev.date}</span>
                        </div>
                        <p className="text-sm text-[#1e2420] mt-1.5">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#5c645e]">Ainda sem comentários escritos.</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('book')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] font-semibold text-sm hover:bg-[#142a20] transition-colors cursor-pointer"
                >
                  Avançar para Pedido de Reserva
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Concurso ou Local do Serviço
                </label>
                <input
                  type="text"
                  required
                  value={eventOrLocation}
                  onChange={(e) => setEventOrLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                  placeholder="Ex: CSN Lisboa, Quinta em Sintra..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                    Data de início
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                  />
                </div>
                {pro.rateUnit !== 'cavalo' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                      {unitLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={pro.rateUnit === 'km' ? 3000 : 120}
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                    Nº de cavalos
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={horsesCount}
                    onChange={(e) => setHorsesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Método de Pagamento Preferido
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['MB WAY', 'Transferência'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'border-[#1c3a2d] bg-[#1c3a2d]/10 text-[#1c3a2d]'
                          : 'border-[#e5dfd3] text-[#5c645e]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Notas para o profissional
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                  placeholder="Ex: Horário de chegada, detalhes dos cavalos, necessidades específicas..."
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#f9f7f2] p-4 rounded-xl border border-[#e5dfd3] space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5c645e]">
                  <span>
                    {pro.dailyRate} € × {quantityForRate} {pro.rateUnit === 'km' ? 'km' : `${pro.rateUnit}(s)`}
                  </span>
                  <span>{subtotal} €</span>
                </div>
                <div className="flex justify-between text-[#5c645e]">
                  <span>Taxa de proteção EquiFlow</span>
                  <span>{platformFee} €</span>
                </div>
                <div className="flex justify-between font-bold text-[#1e2420] pt-2 border-t border-[#e5dfd3]">
                  <span>Total estimado</span>
                  <span>{total} €</span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-confirm-booking"
                className="w-full py-3 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] font-semibold text-sm hover:bg-[#142a20] transition-colors cursor-pointer"
              >
                Enviar Pedido de Reserva & Abrir Chat
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
