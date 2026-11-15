import React from 'react';
import {
  Search,
  CalendarDays,
  Scale,
  MessageSquare,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

export type ActiveTab = 'discover' | 'requests' | 'compare' | 'bookings' | 'pro-area';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  compareCount: number;
  bookingsCount: number;
  onEmergencyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  compareCount,
  bookingsCount,
  onEmergencyClick,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'discover', label: 'Encontrar', icon: <Search className="w-4 h-4" /> },
    { id: 'requests', label: 'Pedidos & Concursos', icon: <CalendarDays className="w-4 h-4" /> },
    {
      id: 'compare',
      label: 'Comparar',
      icon: <Scale className="w-4 h-4" />,
      badge: compareCount > 0 ? compareCount : undefined,
    },
    {
      id: 'bookings',
      label: 'Reservas & Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: bookingsCount > 0 ? bookingsCount : undefined,
    },
    { id: 'pro-area', label: 'Área Profissional', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f9f7f2]/95 backdrop-blur-md border-b border-[#e5dfd3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1c3a2d] text-[#f9f7f2] flex items-center justify-center font-display font-bold text-lg tracking-tight shadow-xs group-hover:bg-[#142a20] transition-colors">
              EF
            </div>
            <div>
              <span className="font-display font-semibold text-xl tracking-tight text-[#1e2420] block leading-none">
                EquiFlow
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#5c645e] font-medium">
                Portugal
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1c3a2d] text-[#f9f7f2]'
                      : 'text-[#5c645e] hover:text-[#1e2420] hover:bg-[#f1ede4]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        isActive
                          ? 'bg-[#f9f7f2] text-[#1c3a2d]'
                          : 'bg-[#9a5b32] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Emergency Vet Quick Action */}
          <button
            type="button"
            id="btn-emergency-vet"
            onClick={onEmergencyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#9a5b32]/40 bg-[#9a5b32]/10 text-[#9a5b32] hover:bg-[#9a5b32] hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
            title="Acesso rápido a veterinários de urgência"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Urgência Vet</span>
            <span className="sm:hidden">Vet</span>
          </button>
        </div>

        {/* Mobile Nav */}
        <nav
          className="flex lg:hidden items-center gap-1 overflow-x-auto pb-2.5 -mx-1 px-1"
          aria-label="Navegação móvel"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1c3a2d] text-[#f9f7f2]'
                    : 'text-[#5c645e] bg-[#f1ede4]/70 hover:text-[#1e2420]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-semibold rounded-full ${
                      isActive ? 'bg-[#f9f7f2] text-[#1c3a2d]' : 'bg-[#9a5b32] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
