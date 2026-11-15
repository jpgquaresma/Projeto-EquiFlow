import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  Scale,
  Check,
  Sparkles,
} from 'lucide-react';
import type { Professional } from '../types/equiflow';

interface ProfessionalCardProps {
  pro: Professional;
  matchScore?: number;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onOpenProfile: (pro: Professional, initialMode?: 'profile' | 'book') => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  pro,
  matchScore,
  isCompared,
  onToggleCompare,
  onOpenProfile,
}) => {
  return (
    <article className="bg-white rounded-xl border border-[#e5dfd3] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#1c3a2d]/40 hover:shadow-md">
      <div>
        {/* Top Row: Avatar + Identity + Match */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-14 h-14 rounded-full object-cover border border-[#e5dfd3] shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-semibold text-lg text-[#1e2420] leading-snug">
                  {pro.name}
                </h3>
                {pro.verifiedIdentity && (
                  <span
                    title="Identidade e experiência verificadas"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1c3a2d] bg-[#1c3a2d]/10 px-2 py-0.5 rounded-full"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9a5b32] mt-0.5">
                {pro.category} • {pro.experienceYears} anos exp.
              </p>
            </div>
          </div>

          {matchScore !== undefined && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1ede4] text-[#1c3a2d] text-xs font-bold shrink-0"
              title="Compatibilidade com a tua pesquisa"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b98b48]" />
              {matchScore}% Match
            </div>
          )}
        </div>

        {/* Headline & Short Bio */}
        <p className="text-sm text-[#1e2420] font-medium mt-3.5 leading-relaxed">
          {pro.headline}
        </p>
        {pro.bio && (
          <p className="text-xs text-[#5c645e] mt-1.5 leading-relaxed line-clamp-2">
            {pro.bio}
          </p>
        )}

        {/* Location & Availability */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-[#5c645e]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#9a5b32]" />
            {pro.city} ({pro.region})
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Resp. {pro.responseTime}
          </span>
        </div>

        {/* Availability status */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {pro.availableNow ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1c3a2d] bg-[#1c3a2d]/8 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-[#1c3a2d]" />
              Disponível agora
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5c645e] bg-[#f1ede4] px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-[#b98b48]" />
              Disponível a partir de Dom
            </span>
          )}
          {pro.emergencyReady && (
            <span className="inline-flex items-center text-xs font-semibold text-[#9a5b32] bg-[#9a5b32]/10 px-2.5 py-1 rounded-md">
              Urgências 24h
            </span>
          )}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {pro.specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="text-[11px] text-[#5c645e] bg-[#f9f7f2] border border-[#e5dfd3] px-2 py-0.5 rounded-md"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Price, Rating & Actions */}
      <div className="mt-5 pt-4 border-t border-[#e5dfd3] flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#1e2420]">{pro.dailyRate} €</span>
            <span className="text-xs text-[#5c645e]">/ {pro.rateUnit}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#5c645e] mt-0.5">
            <Star className="w-3.5 h-3.5 fill-[#b98b48] text-[#b98b48]" />
            <span className="font-semibold text-[#1e2420]">{pro.rating.toFixed(1)}</span>
            <span>({pro.reviewCount} aval.)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleCompare(pro.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-[#1c3a2d]/10 border-[#1c3a2d] text-[#1c3a2d]'
                : 'border-[#e5dfd3] text-[#5c645e] hover:border-[#1e2420] hover:text-[#1e2420]'
            }`}
            title="Adicionar à comparação"
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCompared ? 'Selecionado' : 'Comparar'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenProfile(pro, 'profile')}
            className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#e5dfd3] text-[#1e2420] hover:bg-[#f1ede4] transition-colors cursor-pointer"
          >
            Perfil
          </button>

          <button
            type="button"
            onClick={() => onOpenProfile(pro, 'book')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1c3a2d] text-[#f9f7f2] hover:bg-[#142a20] transition-colors cursor-pointer"
          >
            Reservar
          </button>
        </div>
      </div>
    </article>
  );
};
