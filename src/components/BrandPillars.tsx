import React, { memo, useEffect, useRef, useCallback } from 'react'
import {
  StraightRazorIcon,
  PomadePotIcon,
  CalendarClockIcon,
} from './icons/CustomIcons'

interface PillarItem {
  number: string
  title: string
  description: string
  icon: (className: string) => React.ReactNode
  footerLeft: string
  footerRight: string
  detailFact: string
  cardClass: string
}

const PILLARS_DATA: PillarItem[] = [
  {
    number: '01',
    title: 'Tradición Rosarina & Estilo de Campo',
    description:
      'La elegancia señorial de los bulevares rosarinos fundida con la autenticidad y el temple del campo santafesino. Cortes a tijera con oficio de época, afeitados a navaja tradicional y toallas calientes al vapor de eucalipto.',
    icon: (cls) => <StraightRazorIcon size={28} className={cls} />,
    footerLeft: 'Navaja Criolla & Tijera',
    footerRight: 'Oficio Genuino',
    detailFact: 'Mar a Sáb: 09:30 — 20:30 hs • Con o sin turno previo',
    cardClass: 'pillar-card-1',
  },
  {
    number: '02',
    title: 'Boutique Capilar del Litoral',
    description:
      'Pomadas botánicas, ceras mate y bálsamos de barba elaborados con extractos nativos para resistir el clima y la humedad del río Paraná. Fijación limpia y textura natural para la faena rural y la vida de ciudad.',
    icon: (cls) => <PomadePotIcon size={28} className={cls} />,
    footerLeft: 'Anti-humedad Litoral',
    footerRight: 'Formulación Propia',
    detailFact: 'Fórmulas botánicas testeables en barra de experiencia',
    cardClass: 'pillar-card-2',
  },
  {
    number: '03',
    title: 'Puntualidad & Turnos Sin Espera',
    description:
      'Reserva online directa en segundos con sincronización inmediata a WhatsApp. El tiempo de un hombre es sagrado: te sentás en el sillón de barbero en el minuto pactado, sin demoras de sala de espera.',
    icon: (cls) => <CalendarClockIcon size={28} className={cls} />,
    footerLeft: 'Confirmación WhatsApp',
    footerRight: 'Turno con hora fija',
    detailFact: 'Canal oficial con confirmación automática en tiempo real',
    cardClass: 'pillar-card-3',
  },
]

interface PillarCardProps {
  item: PillarItem
  index: number
  isMain?: boolean
  isRevealed: boolean
}

const PillarCard: React.FC<PillarCardProps> = ({
  item,
  index,
  isMain = false,
  isRevealed,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)

  // Spotlight mouse tracking with requestAnimationFrame (Zero React re-renders)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const clientX = e.clientX
    const clientY = e.clientY

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
    }

    rafId.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      card.style.setProperty('--mx', `${x}px`)
      card.style.setProperty('--my', `${y}px`)
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', '-999px')
      cardRef.current.style.setProperty('--my', '-999px')
    }
  }, [])

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transitionDelay: `${index * 90}ms` }}
      className={`pillar-card pillar-card-entry h-full flex flex-col justify-between overflow-hidden cursor-default focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:outline-none p-[clamp(24px,2.5vw,40px)] ${
        item.cardClass
      } ${isRevealed ? 'is-revealed' : ''}`}
    >
      {/* 1. Spotlight radial fill layer */}
      <div className="pillar-card-spotlight" aria-hidden="true" />

      {/* 2. Spotlight 1px border glow layer */}
      <div className="pillar-card-border-glow" aria-hidden="true" />

      {/* 3. Numeración editorial apagada de fondo (reducida, top-right exacto, sin desbordes) */}
      <span
        aria-hidden="true"
        className="font-['Fraunces'] text-[clamp(3.5rem,5vw,5rem)] font-bold leading-none select-none absolute top-3 right-5 text-[rgba(var(--gold-rgb),0.05)] pointer-events-none tracking-tight z-0"
      >
        {item.number}
      </span>

      {/* 4. Cuerpo de la tarjeta con padding-right reservado para no invadir el número */}
      <div className="relative z-10 pr-14 sm:pr-16">
        {/* Cabecera: Caja de ícono con micro-interacción individual */}
        <div className="mb-6">
          <div className="pillar-icon-box inline-flex p-3.5 rounded-xl bg-gradient-to-br from-[#2a1f14] via-[#1a130c] to-[#0c0906] border border-[var(--gold)]/40 text-[var(--gold)] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.08)] transition-all duration-300">
            {item.icon(
              index === 0
                ? 'pillar-icon-razor'
                : index === 1
                ? 'pillar-icon-pot'
                : 'pillar-icon-clock'
            )}
          </div>
        </div>

        {/* Título de jerarquía diferenciada */}
        <h3
          className={`font-['Fraunces'] font-bold text-[var(--paper)] leading-tight mb-3 transition-colors ${
            isMain
              ? 'text-[clamp(1.6rem,2.2vw,2.1rem)]'
              : 'text-[clamp(1.28rem,1.6vw,1.48rem)]'
          }`}
        >
          {item.title}
        </h3>

        {/* Párrafo con contraste garantizado (>= 4.5:1) */}
        <p className="text-xs sm:text-[13px] text-[var(--paper)]/85 leading-relaxed font-['Manrope'] font-normal">
          {item.description}
        </p>
      </div>

      {/* 5. Footer alineado exactamente al fondo con margin-top: auto */}
      <div className="relative z-10 mt-auto pt-6 border-t border-[rgba(var(--gold-rgb),0.18)]">
        <div className="flex items-center justify-between text-[11px] font-['Manrope']">
          <span className="text-[var(--paper)]/55 font-medium">
            {item.footerLeft}
          </span>
          <span className="font-semibold text-[var(--gold-soft)]">
            {item.footerRight}
          </span>
        </div>

        {/* Revelado de detalle concreto en hover/focus-within */}
        <div className="pillar-detail-drawer" aria-live="polite">
          <div className="pillar-detail-inner pt-2.5">
            <div className="text-[10px] tracking-wide text-[var(--gold)]/80 font-['Manrope'] flex items-center gap-1.5 border-t border-[rgba(var(--gold-rgb),0.1)] pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
              <span>{item.detailFact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BrandPillars: React.FC = memo(() => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = React.useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--ink)] border-y border-[rgba(var(--gold-rgb),0.2)] py-20 lg:py-24 overflow-hidden"
    >
      {/* Resplandor ambiental de fondo */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-[rgba(var(--gold-rgb),0.05)] blur-3xl pointer-events-none"
      />

      <div className="w-full fluid-pad relative z-10">
        {/* Cabecera editorial de sección */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-3 mb-12 pb-5 border-b border-[rgba(var(--gold-rgb),0.15)]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-extrabold text-[var(--gold)] font-['Manrope']">
              Pilares de la Casa • Rosario, Santa Fe
            </span>
          </div>
          <span className="text-xs font-['Fraunces'] italic text-[var(--paper)]/60">
            Estilo de Ciudad Ribereña & Autenticidad de Campo • Est. 1947
          </span>
        </div>

        {/* Grilla Asimétrica en Desktop con items-stretch estricto */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr] pillars-asymmetric-grid gap-6 lg:gap-8 items-stretch">
          {PILLARS_DATA.map((item, idx) => (
            <div key={item.number} className="h-full">
              <PillarCard
                item={item}
                index={idx}
                isMain={idx === 0}
                isRevealed={isRevealed}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default BrandPillars
