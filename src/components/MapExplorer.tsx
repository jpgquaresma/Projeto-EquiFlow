import React, { useState } from 'react';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import type { Professional } from '../types/equiflow';

interface MapExplorerProps {
  professionals: Professional[];
  onOpenProfile: (pro: Professional, initialMode?: 'profile' | 'book') => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  professionals,
  onOpenProfile,
}) => {
  const [selectedId, setSelectedId] = useState<string>(professionals[0]?.id ?? '');
  const selectedPro = professionals.find((p) => p.id === selectedId) ?? professionals[0];

  return (
    <div className="bg-white rounded-xl border border-[#e5dfd3] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Stylized Portugal Map Canvas */}
      <div className="lg:col-span-7 relative bg-[#f1ede4] min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-[#e5dfd3]">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#e5dfd3] text-xs font-medium text-[#1e2420]">
          Mapa de Profissionais • Portugal Continental
        </div>

        {/* Clean SVG silhouette of Portugal */}
        <div className="relative w-full max-w-[300px] h-[360px]">
          <svg
            viewBox="0 0 200 380"
            className="w-full h-full drop-shadow-xs"
            aria-label="Mapa de Portugal"
          >
            <path
              d="M68,14 L126,18 L146,56 L138,110 L145,160 L125,210 L132,265 L118,318 L128,354 L65,360 L48,332 L68,285 L44,235 L32,195 L48,140 L42,80 Z"
              fill="#ffffff"
              stroke="#d5cdbd"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Subtle region labels */}
            <text x="90" y="68" fontSize="8" fill="#8b8579" textAnchor="middle">Norte</text>
            <text x="95" y="180" fontSize="8" fill="#8b8579" textAnchor="middle">Ribatejo & Tejo</text>
            <text x="102" y="250" fontSize="8" fill="#8b8579" textAnchor="middle">Alentejo</text>
            <text x="92" y="342" fontSize="8" fill="#8b8579" textAnchor="middle">Algarve</text>
          </svg>

          {/* Pins */}
          {professionals.map((pro) => {
            const isSelected = selectedPro?.id === pro.id;
            return (
              <button
                key={pro.id}
                type="button"
                onClick={() => setSelectedId(pro.id)}
                style={{ left: `${pro.coordinates.x}%`, top: `${pro.coordinates.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c3a2d] text-[#f9f7f2] scale-110 z-20 ring-4 ring-[#1c3a2d]/20'
                    : 'bg-white text-[#1e2420] border border-[#d5cdbd] hover:border-[#1c3a2d] z-10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{pro.dailyRate} €</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pin Detail */}
      <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-white">
        {selectedPro ? (
          <div>
            <div className="flex items-center gap-3.5">
              <img
                src={selectedPro.avatar}
                alt={selectedPro.name}
                className="w-16 h-16 rounded-full object-cover border border-[#e5dfd3]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-semibold text-xl text-[#1e2420]">
                    {selectedPro.name}
                  </h3>
                  {selectedPro.verifiedIdentity && (
                    <ShieldCheck className="w-4 h-4 text-[#1c3a2d]" />
                  )}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9a5b32]">
                  {selectedPro.category}
                </p>
                <p className="text-xs text-[#5c645e] mt-0.5">
                  {selectedPro.city} • {selectedPro.region}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#1e2420] mt-4 leading-relaxed">
              {selectedPro.bio}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-5 p-3.5 rounded-lg bg-[#f9f7f2] border border-[#e5dfd3] text-center">
              <div>
                <span className="block text-xs text-[#5c645e]">Tarifa</span>
                <span className="font-bold text-sm text-[#1e2420]">
                  {selectedPro.dailyRate} €/{selectedPro.rateUnit}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#5c645e]">Avaliação</span>
                <span className="inline-flex items-center gap-1 font-bold text-sm text-[#1e2420]">
                  <Star className="w-3.5 h-3.5 fill-[#b98b48] text-[#b98b48]" />
                  {selectedPro.rating.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#5c645e]">Experiência</span>
                <span className="font-bold text-sm text-[#1e2420]">
                  {selectedPro.experienceYears} anos
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => onOpenProfile(selectedPro, 'profile')}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#e5dfd3] text-[#1e2420] hover:bg-[#f1ede4] transition-colors cursor-pointer"
              >
                Ver Perfil Completo
              </button>
              <button
                type="button"
                onClick={() => onOpenProfile(selectedPro, 'book')}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1c3a2d] text-[#f9f7f2] hover:bg-[#142a20] transition-colors cursor-pointer"
              >
                Pedir Reserva
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#5c645e]">
            Sem profissionais para mostrar com os filtros atuais.
          </p>
        )}

        <p className="text-[11px] text-[#5c645e] mt-6 pt-3 border-t border-[#e5dfd3]">
          Clica em qualquer marcador no mapa para consultar disponibilidade e tarifa imediata.
        </p>
      </div>
    </div>
  );
};
