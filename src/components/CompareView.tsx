import React from 'react';
import { ShieldCheck, Star, X, Scale } from 'lucide-react';
import type { Professional } from '../types/equiflow';

interface CompareViewProps {
  professionals: Professional[];
  onRemoveCompare: (id: string) => void;
  onOpenProfile: (pro: Professional, initialMode?: 'profile' | 'book') => void;
  onGoToDiscover: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  professionals,
  onRemoveCompare,
  onOpenProfile,
  onGoToDiscover,
}) => {
  if (professionals.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-[#e5dfd3] p-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#f1ede4] text-[#1c3a2d] flex items-center justify-center mx-auto mb-4">
          <Scale className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
          Compara profissionais lado a lado
        </h2>
        <p className="text-sm text-[#5c645e] mt-2 max-w-md mx-auto">
          Seleciona até 3 profissionais na pesquisa usando o botão <strong>Comparar</strong> para avaliar tarifas, experiência, verificação e disponibilidade.
        </p>
        <button
          type="button"
          onClick={onGoToDiscover}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#1c3a2d] text-[#f9f7f2] text-sm font-semibold hover:bg-[#142a20] transition-colors cursor-pointer"
        >
          Explorar Profissionais
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#1e2420]">
            Comparação de Profissionais
          </h2>
          <p className="text-sm text-[#5c645e]">
            Avalia os critérios principais antes de enviar pedido de reserva.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5dfd3] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[#e5dfd3] bg-[#f9f7f2]">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#5c645e] w-44">
                Critério
              </th>
              {professionals.map((pro) => (
                <th key={pro.id} className="p-4 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#e5dfd3]"
                      />
                      <div>
                        <div className="font-display font-semibold text-base text-[#1e2420]">
                          {pro.name}
                        </div>
                        <div className="text-xs font-medium text-[#9a5b32]">{pro.category}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveCompare(pro.id)}
                      className="p-1 text-[#5c645e] hover:text-[#1e2420] cursor-pointer"
                      title="Remover da comparação"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3] text-sm">
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Tarifa</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4 font-bold text-[#1e2420]">
                  {pro.dailyRate} € / {pro.rateUnit}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Avaliação</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1e2420]">
                    <Star className="w-4 h-4 fill-[#b98b48] text-[#b98b48]" />
                    {pro.rating.toFixed(1)} ({pro.reviewCount})
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Verificação</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1c3a2d] bg-[#1c3a2d]/10 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {pro.verifiedExperience ? 'Identidade + Exp.' : 'Identidade'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Experiência</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4 text-[#1e2420]">
                  {pro.experienceYears} anos • {pro.completedJobs} serviços
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Disponibilidade</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      pro.availableNow
                        ? 'bg-[#1c3a2d]/10 text-[#1c3a2d]'
                        : 'bg-[#f1ede4] text-[#5c645e]'
                    }`}
                  >
                    {pro.availableNow ? 'Disponível agora' : 'Próxima semana'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Localização</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4 text-[#5c645e]">
                  {pro.city} ({pro.region})
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#5c645e]">Especialidades</td>
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {pro.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] bg-[#f9f7f2] border border-[#e5dfd3] px-2 py-0.5 rounded-md text-[#5c645e]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4" />
              {professionals.map((pro) => (
                <td key={pro.id} className="p-4">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(pro, 'book')}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] text-xs font-semibold hover:bg-[#142a20] transition-colors cursor-pointer"
                  >
                    Pedir Reserva
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
