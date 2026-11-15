import React, { useState } from 'react';
import { Check, X, ShieldCheck, Calendar, Euro } from 'lucide-react';
import type { Booking, BookingStatus, Professional } from '../types/equiflow';

interface ProfessionalAreaViewProps {
  professional: Professional;
  bookings: Booking[];
  onToggleAvailability: (proId: string) => void;
  onUpdateRate: (proId: string, rate: number) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

export const ProfessionalAreaView: React.FC<ProfessionalAreaViewProps> = ({
  professional,
  bookings,
  onToggleAvailability,
  onUpdateRate,
  onUpdateBookingStatus,
}) => {
  const [rateInput, setRateInput] = useState(professional.dailyRate);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRate(professional.id, rateInput);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
          Área Profissional — Onboarding & Gestão
        </h2>
        <p className="text-sm text-[#5c645e]">
          Gere a tua disponibilidade, tarifa diária e pedidos de reserva sem burocracia nem reuniões presenciais.
        </p>
      </div>

      {/* Profile Summary & Quick Controls */}
      <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 flex items-center gap-4">
          <img
            src={professional.avatar}
            alt={professional.name}
            className="w-16 h-16 rounded-full object-cover border border-[#e5dfd3]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-semibold text-xl text-[#1e2420]">
                {professional.name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#1c3a2d]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a5b32]">
              {professional.category} • {professional.region}
            </p>
            <p className="text-xs text-[#5c645e] mt-1">
              {professional.completedJobs} serviços concluídos • Avaliação {professional.rating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onToggleAvailability(professional.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              professional.availableNow
                ? 'bg-[#1c3a2d]/10 border-[#1c3a2d] text-[#1c3a2d]'
                : 'bg-[#f1ede4] border-[#e5dfd3] text-[#5c645e]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {professional.availableNow ? 'Disponível agora (Ativo)' : 'Indisponível (Pausado)'}
          </button>

          <form onSubmit={handleSaveRate} className="flex items-center gap-2">
            <div className="relative">
              <Euro className="w-3.5 h-3.5 text-[#5c645e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={20}
                value={rateInput}
                onChange={(e) => setRateInput(Number(e.target.value))}
                className="w-24 pl-8 pr-2 py-2.5 rounded-xl border border-[#e5dfd3] text-sm font-semibold focus:outline-none focus:border-[#1c3a2d]"
                aria-label="Tarifa diária"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] text-xs font-semibold hover:bg-[#142a20] cursor-pointer"
            >
              {savedNotice ? 'Guardado!' : 'Atualizar'}
            </button>
          </form>
        </div>
      </div>

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
                  Início: {bk.startDate} • {bk.days} dia(s) • {bk.horsesCount} cavalo(s) • Valor: <strong>{bk.dailyRate * bk.days} €</strong>
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
