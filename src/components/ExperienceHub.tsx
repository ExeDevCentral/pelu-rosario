import React, { memo } from 'react'
import { HairStyle, Service, HairProduct, Toast, HairId } from '../types'
import HaircutCatalog from './HaircutCatalog'
import ServicesSection from './ServicesSection'
import ProductBoutique from './ProductBoutique'
import AiVisagismoModal from './AiVisagismoModal'
import { ScissorsIcon, AiDiagnosticIcon, PomadePotIcon, StraightRazorIcon } from './icons/CustomIcons'

export type ExperienceTab = 'catalog' | 'services' | 'products' | 'visagismo'

interface ExperienceHubProps {
  activeTab: ExperienceTab
  onTabChange: (tab: ExperienceTab) => void
  onSelectStyle: (style: HairStyle) => void
  onTryStyleOnAi: (styleId: string) => void
  onSelectService: (service: Service) => void
  onAddToCart: (product: HairProduct) => void
  aiInitialStyleId: HairId
  onBookWithStyle: (style: HairStyle) => void
  onAddToast: (msg: string, type?: Toast['type']) => void
}

const TABS: { id: ExperienceTab; label: string; badge?: string; icon: React.ReactNode }[] = [
  { id: 'catalog', label: 'Cortes & Estilos', badge: '6', icon: <ScissorsIcon size={15} /> },
  { id: 'services', label: 'Servicios & Precios', badge: '4', icon: <StraightRazorIcon size={15} /> },
  { id: 'products', label: 'Boutique Capilar', badge: '6', icon: <PomadePotIcon size={15} /> },
  { id: 'visagismo', label: 'Asesor IA', badge: 'NUEVO', icon: <AiDiagnosticIcon size={15} /> },
]

const ExperienceHub: React.FC<ExperienceHubProps> = memo(({
  activeTab,
  onTabChange,
  onSelectStyle,
  onTryStyleOnAi,
  onSelectService,
  onAddToCart,
  aiInitialStyleId,
  onBookWithStyle,
  onAddToast,
}) => {
  return (
    <section id="experience" className="py-12 md:py-16 bg-[var(--bg-60)] border-b border-[rgba(var(--accent-10-rgb),0.18)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Compact Hub Header & Tab Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-[rgba(var(--accent-10-rgb),0.18)]">
          <div>
            <span className="text-[11px] font-extrabold tracking-[0.25em] text-[var(--accent-10)] uppercase block mb-1.5">
              EXPERIENCIA EL BÚHO DORADO
            </span>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--paper)]">
              Catálogo, Servicios & Asesoría
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Secciones de experiencia"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-b border-white/10"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold whitespace-nowrap transition-all cursor-pointer border-b-2 -mb-px ${
                    isActive
                      ? 'border-[var(--accent-10)] text-[var(--paper)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--paper)] hover:border-white/25'
                  }`}
                >
                  <span className={isActive ? 'text-[var(--accent-10)]' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                        isActive
                          ? 'bg-[var(--accent-10)]/15 text-[var(--accent-10)] border border-[var(--accent-10)]/30'
                          : 'bg-white/[0.04] text-[var(--text-muted)] border border-white/10'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Panel */}
        <div key={activeTab} className="animate-[fadeIn_0.3s_ease-out]">
          {activeTab === 'catalog' && (
            <HaircutCatalog
              embedded
              onSelectStyle={onSelectStyle}
              onTryStyleOnAi={onTryStyleOnAi}
            />
          )}
          {activeTab === 'services' && (
            <ServicesSection embedded onSelectService={onSelectService} />
          )}
          {activeTab === 'products' && (
            <ProductBoutique embedded onAddToCart={onAddToCart} />
          )}
          {activeTab === 'visagismo' && (
            <AiVisagismoModal
              embedded
              initialStyleId={aiInitialStyleId}
              onBookWithStyle={onBookWithStyle}
              onAddToCart={onAddToCart}
              onAddToast={onAddToast}
            />
          )}
        </div>
      </div>
    </section>
  )
})

export default ExperienceHub
