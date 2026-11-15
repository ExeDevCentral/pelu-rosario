import React, { memo } from 'react'
import { BARBERS } from '../data/mockData'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

const TeamSection: React.FC<{ embedded?: boolean }> = memo(({ embedded = false }) => {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>(0.1)

  const content = (
    <>
      {!embedded && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-extrabold tracking-[0.25em] text-[var(--accent-10)] uppercase mb-3">
            EQUIPO PROFESIONAL
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--paper)] mb-4">
            Maestros Barberos
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">
            Años de experiencia combinada en barbería clásica, degradés modernos y escultura artesanal de barba.
          </p>
        </div>
      )}

      {/* Team Grid */}
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BARBERS.filter(b => b.id !== 'any').map((barber, idx) => (
            <div
              key={barber.id}
              style={{ transitionDelay: `${idx * 90}ms` }}
              className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} bg-[var(--bg-60)] rounded-xl border border-[rgba(var(--accent-10-rgb),0.22)] hover:border-[var(--accent-10)] hover:-translate-y-1.5 transition-all duration-300 p-6 text-center group shadow-xl`}
            >
              <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-6 border-2 border-[rgba(var(--accent-10-rgb),0.4)] group-hover:border-[var(--accent-10)] group-hover:shadow-[0_0_24px_rgba(212,175,103,0.25)] transition-all duration-300">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover img-hd group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="text-xs font-bold text-[var(--accent-10)] uppercase tracking-wider mb-1">
                {barber.specialty}
              </div>

              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--paper)] mb-2">
                {barber.name}
              </h3>

              <div className="inline-flex items-center gap-1 text-xs font-bold bg-[var(--surface-30)] px-3 py-1 rounded-full border border-[rgba(var(--accent-10-rgb),0.3)] text-[var(--accent-10)]">
                <span>{barber.rating}</span>
                <span>★★★★★</span>
              </div>
            </div>
          ))}
        </div>
    </>
  )

  if (embedded) return content

  return (
    <section id="team" className="py-24 bg-[var(--surface-30)] border-t border-[rgba(var(--accent-10-rgb),0.2)] relative cvis">
      <div className="max-w-7xl mx-auto px-6">{content}</div>
    </section>
  )
})

export default TeamSection
