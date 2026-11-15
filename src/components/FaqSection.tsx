import React, { useState, memo } from 'react'
import { FAQ_ITEMS } from '../data/mockData'

const FaqSection: React.FC<{ embedded?: boolean }> = memo(({ embedded = false }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const content = (
    <>
      {!embedded && (
        <div className="text-center mb-16">
          <div className="text-xs font-extrabold tracking-[0.25em] text-[#c4943a] uppercase mb-3">
            RESPUESTAS RÁPIDAS
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f2e6cc] mb-4">
            Preguntas Frecuentes
          </h2>
        </div>
      )}

      {/* Accordion List */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx

          return (
            <div
              key={idx}
              className="bg-[#0d0b08] rounded-xl border border-[#c4943a]/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1a1410]/50 transition-colors"
              >
                <span className="font-['Playfair_Display'] font-bold text-[#f2e6cc] text-sm sm:text-base">
                  {item.q}
                </span>
                <span className={`text-[#c4943a] text-xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#f2e6cc]/70 leading-relaxed border-t border-[#c4943a]/10 pt-4 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )

  if (embedded) return content

  return (
    <section className="py-24 bg-[#161210] border-t border-[#c4943a]/20 relative cvis">
      <div className="max-w-4xl mx-auto px-6">{content}</div>
    </section>
  )
})

export default FaqSection
