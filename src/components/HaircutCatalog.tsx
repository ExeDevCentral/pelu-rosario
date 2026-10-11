import React, { memo } from 'react'
import { HAIR_STYLES, fmt } from '../data/mockData'
import { HairStyle } from '../types'
import { AiDiagnosticIcon, ScissorsIcon } from './icons/CustomIcons'

interface HaircutCatalogProps {
  onSelectStyle: (style: HairStyle) => void
  onTryStyleOnAi: (styleId: string) => void
}

const HaircutCatalog: React.FC<HaircutCatalogProps> = memo(({ onSelectStyle, onTryStyleOnAi }) => {
  return (
    <section id="catalog" className="py-24 bg-[#090807] relative cvis">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16120e] border border-[#d4af67]/30 text-xs font-black text-[#d4af67] uppercase tracking-widest mb-3">
            <ScissorsIcon size={16} />
            <span>CATÁLOGO DE ESTILOS & TENDENCIAS</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f5ebd7] mb-4">
            Cortes Exclusivos Rosarinos
          </h2>
          <p className="text-sm sm:text-base text-[#a89b88]">
            Pasa el cursor o interactúa sobre cada tarjeta para revelar las especificaciones técnicas del corte, productos de peinado y diagnóstico con IA.
          </p>
        </div>

        {/* Grid of Hover Reveal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HAIR_STYLES.map((style) => (
            <div
              key={style.id}
              className="reveal-card h-[460px] flex flex-col justify-end group cursor-pointer border border-[#d4af67]/20 hover:border-[#d4af67] transition-all rounded-xl overflow-hidden shadow-xl"
            >
              {/* Background Art / Card Base */}
              <div className="absolute inset-0 bg-[#12100d] overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center reveal-card-img opacity-85 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: style.id === 'pompadour' 
                      ? 'url(https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800&fit=crop&q=80)'
                      : style.id === 'clasico'
                      ? 'url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&fit=crop&q=80)'
                      : style.id === 'undercut'
                      ? 'url(https://images.unsplash.com/photo-1517832606589-715746203e50?w=800&fit=crop&q=80)'
                      : style.id === 'fade_low'
                      ? 'url(https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&fit=crop&q=80)'
                      : style.id === 'slickback'
                      ? 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop&q=80)'
                      : 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop&q=80)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090807] via-[#090807]/60 to-transparent" />
              </div>

              {/* Shimmer Effect */}
              <div className="shimmer-effect" />

              {/* Visible Header Tag (Default state before full reveal) */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 bg-[#16120e]/90 backdrop-blur border border-[#d4af67]/40 text-[#d4af67] text-[10px] font-black uppercase rounded tracking-wider">
                    {style.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f5ebd7] bg-[#070605]/80 px-2 py-0.5 rounded border border-[#d4af67]/20">
                    ⏱ {style.duration}
                  </span>
                </div>

                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#f5ebd7] group-hover:text-[#d4af67] transition-colors mb-1">
                  {style.name}
                </h3>
                <p className="text-xs text-[#a89b88] line-clamp-1">
                  {style.subtitle}
                </p>
                <div className="mt-2 font-['Playfair_Display'] text-xl font-bold text-[#d4af67]">
                  {fmt(style.price)}
                </div>
              </div>

              {/* Slide-Up Overlay Content */}
              <div className="reveal-overlay-slide reveal-content-stagger">
                <h4 className="font-['Playfair_Display'] text-xl font-bold text-[#f5ebd7] mb-2">
                  {style.name}
                </h4>
                <p className="text-xs text-[#f5ebd7]/80 leading-relaxed mb-4">
                  {style.description}
                </p>

                {/* Recommended Cream from Boutique */}
                <div className="bg-[#12100d]/90 p-2.5 rounded-lg border border-[#d4af67]/25 mb-4 text-[11px]">
                  <span className="text-[#d4af67] font-bold">Fórmula Recomendada: </span>
                  <span className="text-[#f5ebd7]/90">{style.recommendedProduct}</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d4af67]/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTryStyleOnAi(style.id)
                    }}
                    className="px-3 py-2.5 bg-[#16120e] hover:bg-[#201b14] text-[#d4af67] border border-[#d4af67]/40 hover:border-[#d4af67] rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AiDiagnosticIcon size={14} />
                    <span>Evaluar con IA</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectStyle(style)
                    }}
                    className="px-3 py-2.5 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] rounded-lg text-[11px] font-black uppercase transition-all shadow-md cursor-pointer"
                  >
                    Reservar Turno
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
})

export default HaircutCatalog
