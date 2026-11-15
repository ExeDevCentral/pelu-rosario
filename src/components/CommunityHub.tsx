import React, { memo } from 'react'
import TeamSection from './TeamSection'
import TestimonialsSection from './TestimonialsSection'
import FaqSection from './FaqSection'

export type CommunityTab = 'team' | 'testimonials' | 'faq'

interface CommunityHubProps {
  activeTab: CommunityTab
  onTabChange: (tab: CommunityTab) => void
}

const COMMUNITY_TABS: { id: CommunityTab; label: string }[] = [
  { id: 'team', label: 'Maestros Barberos' },
  { id: 'testimonials', label: 'Reseñas Verificadas' },
  { id: 'faq', label: 'Preguntas Frecuentes' },
]

const CommunityHub: React.FC<CommunityHubProps> = memo(({ activeTab, onTabChange }) => {
  return (
    <section id="community" className="py-12 md:py-16 bg-[var(--bg-60)] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[rgba(var(--accent-10-rgb),0.18)]">
          <div>
            <span className="text-[11px] font-extrabold tracking-[0.25em] text-[var(--accent-10)] uppercase block mb-1.5">
              LA CASA Y SU GENTE
            </span>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--paper)]">
              Equipo, Clientes & Dudas
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Información de la barbería"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-b border-white/10"
          >
            {COMMUNITY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3.5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold whitespace-nowrap transition-all cursor-pointer border-b-2 -mb-px ${
                    isActive
                      ? 'border-[var(--accent-10)] text-[var(--paper)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--paper)] hover:border-white/25'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div key={activeTab} className="animate-[fadeIn_0.3s_ease-out]">
          {activeTab === 'team' && <TeamSection embedded />}
          {activeTab === 'testimonials' && <TestimonialsSection embedded />}
          {activeTab === 'faq' && <FaqSection embedded />}
        </div>
      </div>
    </section>
  )
})

export default CommunityHub
