import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  CreditCard,
  Calendar,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import type { Booking, BookingStatus } from '../types/equiflow';

interface BookingsAndChatViewProps {
  bookings: Booking[];
  onSendMessage: (bookingId: string, text: string) => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onGoToDiscover: () => void;
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  Pedido: 'bg-[#b98b48]/15 text-[#9a5b32]',
  Confirmado: 'bg-[#1c3a2d]/12 text-[#1c3a2d]',
  'Pago (MB WAY)': 'bg-[#1c3a2d] text-white',
  Concluído: 'bg-[#f1ede4] text-[#5c645e]',
  Recusado: 'bg-red-100 text-red-700',
};

export const BookingsAndChatView: React.FC<BookingsAndChatViewProps> = ({
  bookings,
  onSendMessage,
  onUpdateStatus,
  onGoToDiscover,
}) => {
  const [selectedId, setSelectedId] = useState<string>(bookings[0]?.id ?? '');
  const [draft, setDraft] = useState('');

  const activeBooking = bookings.find((b) => b.id === selectedId) ?? bookings[0];

  if (bookings.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-[#e5dfd3] p-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#f1ede4] text-[#1c3a2d] flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
          Ainda não tens reservas ativas
        </h2>
        <p className="text-sm text-[#5c645e] mt-2">
          Quando enviares um pedido de reserva a um profissional, poderás acompanhar aqui o estado, pagar por MB WAY e conversar por chat.
        </p>
        <button
          type="button"
          onClick={onGoToDiscover}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] cursor-pointer"
        >
          Encontrar Profissional
        </button>
      </section>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeBooking) return;
    onSendMessage(activeBooking.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Bookings List */}
      <div className="lg:col-span-5 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
          As tuas Reservas
        </h2>
        <div className="space-y-2.5">
          {bookings.map((bk) => {
            const isSelected = activeBooking?.id === bk.id;
            return (
              <button
                key={bk.id}
                type="button"
                onClick={() => setSelectedId(bk.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1c3a2d] shadow-xs'
                    : 'bg-white/80 border-[#e5dfd3] hover:border-[#1c3a2d]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={bk.professionalAvatar}
                      alt={bk.professionalName}
                      className="w-11 h-11 rounded-full object-cover border border-[#e5dfd3]"
                    />
                    <div>
                      <div className="font-semibold text-sm text-[#1e2420]">
                        {bk.professionalName}
                      </div>
                      <div className="text-xs text-[#9a5b32] font-medium">
                        {bk.professionalCategory}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      STATUS_BADGE[bk.status]
                    }`}
                  >
                    {bk.status}
                  </span>
                </div>

                <div className="mt-3 text-xs text-[#5c645e] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9a5b32]" />
                    <span className="truncate">{bk.eventOrLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {bk.startDate} • {bk.days} dia(s)
                    </span>
                    <span className="font-bold text-[#1e2420]">{bk.total} €</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Booking Details + Chat */}
      {activeBooking && (
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e5dfd3] flex flex-col overflow-hidden min-h-[500px]">
          {/* Top Bar */}
          <div className="p-5 border-b border-[#e5dfd3] bg-[#f9f7f2] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-lg text-[#1e2420]">
                {activeBooking.professionalName} — {activeBooking.eventOrLocation}
              </h3>
              <p className="text-xs text-[#5c645e]">
                {activeBooking.days} dia(s) • {activeBooking.horsesCount} cavalo(s) • Total{' '}
                <strong className="text-[#1e2420]">{activeBooking.total} €</strong> ({activeBooking.paymentMethod})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeBooking.status === 'Confirmado' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(activeBooking.id, 'Pago (MB WAY)')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] text-xs font-semibold hover:bg-[#142a20] cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pagar com MB WAY ({activeBooking.total} €)
                </button>
              )}
              {activeBooking.status === 'Pago (MB WAY)' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(activeBooking.id, 'Concluído')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1c3a2d] text-[#1c3a2d] text-xs font-semibold hover:bg-[#1c3a2d]/10 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marcar como Concluído
                </button>
              )}
            </div>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 p-5 space-y-3 overflow-y-auto bg-white">
            {activeBooking.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1c3a2d] text-[#f9f7f2] rounded-br-xs'
                      : 'bg-[#f1ede4] text-[#1e2420] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#5c645e] mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-[#e5dfd3] bg-[#f9f7f2] flex items-center gap-2.5"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Escreve uma mensagem para ${activeBooking.professionalName.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] hover:bg-[#142a20] transition-colors inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
