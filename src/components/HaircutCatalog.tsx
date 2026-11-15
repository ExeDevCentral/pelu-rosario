import React, { memo } from 'react'
import { HAIR_STYLES, fmt } from '../data/mockData'
import { HairStyle } from '../types'
import { AiDiagnosticIcon, ScissorsIcon } from './icons/CustomIcons'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

interface HaircutCatalogProps {
  embedded?: boolean
  onSelectStyle: (style: HairStyle) => void
  onTryStyleOnAi: (styleId: string) => void
}

const STYLE_IMAGES: Record<string, string> = {
  pompadour: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e',
  clasico: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
  undercut: 'https://images.unsplash.com/photo-1517832606589-715746203e50',
  fade_low: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  slickback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  quiff: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
}

const HaircutCatalog: React.FC<HaircutCatalogProps> = memo(({ embedded = false, onSelectStyle, onTryStyleOnAi }) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>(0.08)

  const gridContent = (
    <>
      {!embedded && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--surface-30)] border border-[rgba(var(--accent-10-rgb),0.3)] text-xs font-black text-[var(--accent-10)] uppercase tracking-widest mb-3">
            <ScissorsIcon size={16} />
            <span>CATÁLOGO DE ESTILOS & TENDENCIAS</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--paper)] mb-4">
            Cortes Exclusivos Rosarinos
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            Pasa el cursor o interactúa sobre cada tarjeta para revelar las especificaciones técnicas del corte, productos de peinado y diagnóstico con IA.
          </p>
        </div>
      )}

      {/* Grid of Hover Reveal Cards */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HAIR_STYLES.map((style, idx) => {
          const baseImg = STYLE_IMAGES[style.id] ?? STYLE_IMAGES.quiff
          return (
          <div
            key={style.id}
            style={{ transitionDelay: `${idx * 70}ms` }}
            className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} reveal-card ${embedded ? 'h-[350px]' : 'h-[460px]'} flex flex-col justify-end group cursor-pointer border border-white/10 hover:border-[var(--accent-10)] transition-all rounded-xl overflow-hidden shadow-xl`}
          >
              {/* Background Art / High-DPI Card Image */}
              <div className="absolute inset-0 bg-[var(--surface-30)] overflow-hidden">
                <img
                  src={`${baseImg}?w=900&h=1100&fit=crop&crop=faces&auto=format&q=90`}
                  srcSet={`${baseImg}?w=600&h=750&fit=crop&crop=faces&auto=format&q=85 600w, ${baseImg}?w=1000&h=1250&fit=crop&crop=faces&auto=format&q=90 1000w`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={style.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover reveal-card-img img-hd opacity-90 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-60)] via-[var(--bg-60)]/55 to-transparent" />
              </div>

              {/* Shimmer Effect */}
              <div className="shimmer-effect" />

              {/* Visible Header Tag (Default state — fades out cleanly on hover so it never overlaps) */}
              <div className="reveal-base-info p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-[var(--bg-60)]/85 backdrop-blur border border-white/15 text-[var(--paper)] text-[10px] font-bold uppercase rounded tracking-wider">
                    {style.tag}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--bg-60)]/80 px-2 py-0.5 rounded border border-white/10">
                    ⏱ {style.duration}
                  </span>
                </div>

                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--paper)] mb-0.5">
                  {style.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                  {style.subtitle}
                </p>
                <div className="mt-2 font-['Playfair_Display'] text-xl font-bold text-[var(--accent-10)]">
                  {fmt(style.price)}
                </div>
              </div>

              {/* Slide-Up Overlay Content (z-20, zero overlap) */}
              <div className="reveal-overlay-slide reveal-content-stagger">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-['Playfair_Display'] text-xl font-bold text-[var(--paper)]">
                    {style.name}
                  </h4>
                  <span className="font-['Playfair_Display'] text-base font-bold text-[var(--accent-10)] shrink-0">
                    {fmt(style.price)}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-3">
                  {style.description}
                </p>

                {/* Recommended Cream from Boutique */}
                <div className="bg-[var(--surface-30)] p-2.5 rounded-lg border border-white/10 mb-3 text-[11px]">
                  <span className="text-[var(--accent-10)] font-bold">Fórmula: </span>
                  <span className="text-[var(--paper)]/90">{style.recommendedProduct}</span>
                </div>

                {/* Action Buttons — Refined, crisp 1px borders & subtle metallic primary */}
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTryStyleOnAi(style.id)
                    }}
                    className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-[var(--paper)] border border-white/15 hover:border-[var(--accent-10)]/60 rounded-md text-[10px] font-semibold uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AiDiagnosticIcon size={13} color="var(--accent-10)" />
                    <span>Evaluar IA</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectStyle(style)
                    }}
                    className="px-3 py-2 bg-gradient-to-b from-[#e3c47f] to-[#c79d4b] hover:brightness-105 text-[#0b0b0c] border border-white/20 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] cursor-pointer"
                  >
                    Reservar
                  </button>
                </div>

              </div>

            </div>
            )
          })}
        </div>
    </>
  )

  if (embedded) return gridContent

  return (
    <section id="catalog" className="py-24 bg-[var(--bg-60)] relative cvis">
      <div className="max-w-7xl mx-auto px-6">{gridContent}</div>
    </section>
  )
})

export default HaircutCatalog
