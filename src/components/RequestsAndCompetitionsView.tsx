import React, { useState } from 'react';
import { CalendarDays, MapPin, PlusCircle, Users, Trophy } from 'lucide-react';
import type { Competition, OpenRequest, Region, ServiceCategory } from '../types/equiflow';

interface RequestsAndCompetitionsViewProps {
  requests: OpenRequest[];
  competitions: Competition[];
  onPublishRequest: (req: OpenRequest) => void;
  onFilterByRegion: (region: Region) => void;
}

const CATEGORIES: ServiceCategory[] = [
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

export const RequestsAndCompetitionsView: React.FC<RequestsAndCompetitionsViewProps> = ({
  requests,
  competitions,
  onPublishRequest,
  onFilterByRegion,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Groom / Tratador');
  const [region, setRegion] = useState<Region>('Lisboa & Tejo');
  const [dateNeeded, setDateNeeded] = useState('21 – 24 Nov 2026');
  const [horsesCount, setHorsesCount] = useState(2);
  const [budget, setBudget] = useState('90 € / dia');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onPublishRequest({
      id: `req-${Date.now()}`,
      title: title.trim(),
      category,
      region,
      dateNeeded,
      horsesCount,
      budget,
      author: 'Tu (Cavaleiro / Proprietário)',
      description: description.trim() || 'Pedido publicado através da EquiFlow.',
      createdAt: 'Agora mesmo',
      responsesCount: 0,
    });
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Open Requests */}
      <section className="lg:col-span-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
              Pedidos Abertos
            </h2>
            <p className="text-sm text-[#5c645e]">
              Publica o que precisas e recebe propostas de profissionais disponíveis.
            </p>
          </div>

          <button
            type="button"
            id="btn-new-request"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {showForm ? 'Cancelar' : 'Publicar Pedido'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-[#1c3a2d]/30 p-5 space-y-4 shadow-xs"
          >
            <h3 className="font-display font-semibold text-lg text-[#1e2420]">
              Novo Pedido de Serviço
            </h3>
            <div>
              <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                Título do pedido
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Preciso de groom para CSI Vilamoura (2 cavalos)"
                className="w-full px-3.5 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm bg-white focus:outline-none focus:border-[#1c3a2d]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Região
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm bg-white focus:outline-none focus:border-[#1c3a2d]"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Datas
                </label>
                <input
                  type="text"
                  value={dateNeeded}
                  onChange={(e) => setDateNeeded(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Cavalos
                </label>
                <input
                  type="number"
                  min={1}
                  value={horsesCount}
                  onChange={(e) => setHorsesCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                  Orçamento
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e2420] mb-1">
                Descrição
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreve o tipo de prova, tarefas ou urgência..."
                className="w-full px-3.5 py-2 rounded-lg border border-[#e5dfd3] text-sm focus:outline-none focus:border-[#1c3a2d]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] cursor-pointer"
            >
              Publicar Pedido Agora
            </button>
          </form>
        )}

        <div className="space-y-3">
          {requests.map((req) => (
            <article
              key={req.id}
              className="bg-white rounded-xl border border-[#e5dfd3] p-5 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9a5b32]">
                    {req.category} • {req.createdAt}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-[#1e2420] mt-0.5">
                    {req.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f1ede4] text-xs font-semibold text-[#1c3a2d] whitespace-nowrap">
                  {req.budget}
                </span>
              </div>

              <p className="text-sm text-[#5c645e]">{req.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e5dfd3] text-xs text-[#5c645e]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9a5b32]" />
                    {req.region}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {req.dateNeeded}
                  </span>
                  <span>{req.horsesCount} cavalo(s)</span>
                </div>
                <span className="font-semibold text-[#1c3a2d]">
                  {req.responsesCount} proposta(s) recebida(s)
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Right: Competitions */}
      <aside className="lg:col-span-5 space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
            Concursos & Eventos
          </h2>
          <p className="text-sm text-[#5c645e]">
            Encontra profissionais já disponíveis para os próximos concursos.
          </p>
        </div>

        <div className="space-y-3">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-xl border border-[#e5dfd3] p-4 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#f1ede4] text-[#9a5b32] flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1e2420]">{comp.name}</h3>
                    <p className="text-xs text-[#5c645e]">{comp.discipline}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5c645e]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#9a5b32]" />
                  {comp.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {comp.dates}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5dfd3]">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1c3a2d]">
                  <Users className="w-3.5 h-3.5" />
                  {comp.availableProsCount} profissionais na zona
                </span>
                <button
                  type="button"
                  onClick={() => onFilterByRegion(comp.region)}
                  className="text-xs font-semibold text-[#1c3a2d] hover:underline cursor-pointer"
                >
                  Ver profissionais →
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};
