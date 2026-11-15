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

        {/* Accurate SVG silhouette of Portugal Continental with 5 regions */}
        <div className="relative w-[250px] h-[445px]">
          <svg
            viewBox="0 0 261 482"
            className="w-full h-full drop-shadow-xs"
            aria-label="Mapa de Portugal Continental"
          >
            <path
              d="M 77.5,130.2 L 78.5,121.4 L 78.3,115.8 L 77.3,110.3 L 75.5,102.7 L 73.0,93.1 L 71.2,85.1 L 70.2,78.8 L 69.1,72.3 L 67.8,65.6 L 66.5,58.4 L 64.5,47.1 L 75.2,37.0 L 86.1,31.3 L 100.6,26.7 L 108.9,28.8 L 110.8,37.6 L 113.1,44.4 L 115.7,49.0 L 120.9,50.0 L 128.6,47.5 L 138.2,47.3 L 149.5,49.4 L 160.8,49.2 L 172.1,46.7 L 185.9,43.7 L 202.1,40.4 L 212.9,42.7 L 218.4,50.7 L 225.4,60.5 L 233.8,72.3 L 233.8,82.4 L 225.4,90.8 L 213.6,100.4 L 190.8,116.8 L 169.9,114.3 L 156.0,114.7 L 142.0,117.2 L 127.6,120.2 L 112.8,123.5 L 98.4,126.5 L 77.5,130.2 Z"
              fill="#f7faf8"
              stroke="#c9c2b2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 77.5,130.2 L 98.4,126.5 L 112.8,123.5 L 127.6,120.2 L 142.0,117.2 L 156.0,114.7 L 169.9,114.3 L 190.8,116.8 L 195.6,130.7 L 197.2,140.3 L 197.2,150.4 L 196.6,160.9 L 195.3,171.8 L 192.7,180.8 L 188.8,188.0 L 188.8,194.9 L 192.7,201.6 L 192.7,208.8 L 186.9,220.1 L 162.6,228.9 L 150.3,233.3 L 141.9,236.3 L 130.9,240.7 L 117.3,246.6 L 105.3,253.3 L 95.0,260.9 L 86.5,269.7 L 80.1,279.8 L 74.3,289.8 L 66.5,305.0 L 59.2,296.1 L 54.2,290.9 L 49.0,286.3 L 42.7,282.1 L 31.5,276.4 L 33.5,268.8 L 33.2,264.2 L 31.2,260.0 L 33.0,256.2 L 38.5,252.9 L 43.7,247.8 L 48.5,241.1 L 51.8,234.2 L 53.4,227.1 L 56.1,219.5 L 60.0,211.5 L 62.4,203.5 L 63.4,195.6 L 65.2,185.9 L 67.8,174.6 L 69.9,164.3 L 71.5,155.0 L 73.6,145.4 L 77.5,130.2 Z"
              fill="#ffffff"
              stroke="#c9c2b2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 31.5,276.4 L 28.9,290.7 L 23.8,306.6 L 28.9,314.2 L 41.9,313.4 L 47.7,311.7 L 55.5,303.3 L 60.0,310.8 L 53.5,316.7 L 44.5,315.0 L 41.2,320.1 L 43.8,331.0 L 41.9,337.7 L 51.0,335.2 L 63.2,329.3 L 68.6,319.9 L 69.4,313.8 L 66.5,305.0 L 59.2,296.1 L 54.2,290.9 L 49.0,286.3 L 42.7,282.1 L 31.5,276.4 Z"
              fill="#fcf8f5"
              stroke="#c9c2b2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 66.5,305.0 L 74.3,289.8 L 80.1,279.8 L 86.5,269.7 L 95.0,260.9 L 105.3,253.3 L 117.3,246.6 L 130.9,240.7 L 141.9,236.3 L 150.3,233.3 L 162.6,228.9 L 186.9,220.1 L 175.2,230.2 L 170.4,238.4 L 168.4,248.1 L 170.0,257.9 L 175.2,268.0 L 179.4,276.8 L 182.7,284.4 L 183.8,291.1 L 182.8,297.0 L 179.3,303.7 L 173.1,311.3 L 169.1,320.5 L 167.1,331.4 L 168.7,340.7 L 173.9,348.2 L 177.2,354.3 L 178.5,358.9 L 176.2,366.1 L 170.4,375.7 L 164.2,385.2 L 157.7,394.4 L 154.7,403.5 L 155.2,416.7 L 131.9,421.7 L 118.7,424.2 L 108.1,425.9 L 98.4,426.3 L 89.6,425.5 L 81.2,423.6 L 69.1,419.2 L 69.6,411.6 L 69.7,405.6 L 69.7,398.4 L 68.1,390.2 L 64.9,381.0 L 65.0,371.5 L 68.6,361.9 L 70.0,352.8 L 69.4,344.4 L 67.6,338.1 L 64.7,333.9 L 63.2,331.2 L 63.2,329.3 L 68.6,319.9 L 69.4,313.8 L 66.5,305.0 Z"
              fill="#faf9f6"
              stroke="#c9c2b2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 69.1,419.2 L 66.6,426.8 L 64.9,432.2 L 62.9,438.1 L 60.7,444.4 L 58.1,451.1 L 61.1,453.0 L 69.9,450.1 L 77.3,448.2 L 83.5,447.3 L 91.1,447.6 L 100.1,448.8 L 106.8,449.9 L 111.0,450.7 L 116.3,452.2 L 122.8,454.3 L 129.3,454.3 L 135.7,452.2 L 141.7,449.7 L 147.2,446.7 L 152.2,444.4 L 156.8,442.7 L 158.4,439.8 L 157.1,435.6 L 156.1,429.3 L 155.2,416.7 L 131.9,421.7 L 118.7,424.2 L 108.1,425.9 L 98.4,426.3 L 89.6,425.5 L 81.2,423.6 L 69.1,419.2 Z"
              fill="#fcfaf3"
              stroke="#c9c2b2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Subtle region labels */}
            <text x="156" y="109" fontSize="10" fontWeight="600" fill="#7c776d" textAnchor="middle">Porto &amp; Norte</text>
            <text x="128" y="182" fontSize="10" fontWeight="600" fill="#7c776d" textAnchor="middle">Ribatejo / Golegã</text>
            <text x="48" y="322" fontSize="8" fontWeight="600" fill="#7c776d" textAnchor="middle">Lisboa</text>
            <text x="124" y="344" fontSize="10" fontWeight="600" fill="#7c776d" textAnchor="middle">Alentejo</text>
            <text x="112" y="444" fontSize="9.5" fontWeight="600" fill="#7c776d" textAnchor="middle">Algarve</text>
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
