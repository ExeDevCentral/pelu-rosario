import React, { memo } from 'react'
import { CalendarClockIcon, AiDiagnosticIcon } from './icons/CustomIcons'

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
}

const HeroSection: React.FC<HeroSectionProps> = memo(({ onNavigate }) => {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
      style={{
        minHeight: '100svh',
        display: 'grid',
        gridTemplateRows: '1fr auto',
      }}
    >
      {/* ── 1. BACKGROUND PHOTOGRAPHY (Authentic, illuminated, high-DPI crisp) ── */}
      <img
        src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&h=1080&fit=crop&auto=format&q=90"
        srcSet="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1280&h=720&fit=crop&auto=format&q=85 1280w, https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&h=1080&fit=crop&auto=format&q=90 1920w, https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=2560&h=1440&fit=crop&auto=format&q=90 2560w"
        sizes="100vw"
        alt="Pelu Rosario — El Búho Dorado Barbería"
        fetchPriority="high"
        decoding="async"
        className="ken-burns img-hd absolute inset-0 w-full h-full pointer-events-none"
        style={{
          objectFit: 'cover',
          objectPosition: '70% center',
          filter: 'brightness(1.12) contrast(1.06) saturate(0.95)',
        }}
      />

      {/* ── 2. DIRECTIONAL LUXURY GRADIENTS (Dark where text sits, clear where photo lives) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.55) 38%, rgba(10,8,6,0.12) 70%, transparent 100%),
            linear-gradient(0deg, rgba(10,8,6,0.85) 0%, transparent 35%)
          `,
        }}
      />

      {/* ── 3. SUBTLE GRAIN OVERLAY (SVG Fractal Noise) ── */}
      <div className="noise-overlay" />

      {/* ── 4. MAIN EDITORIAL CONTENT BLOCK (Full-bleed, left & bottom aligned) ── */}
      <div
        className="relative z-10 w-full fluid-pad flex flex-col justify-end"
        style={{
          alignSelf: 'end',
          paddingTop: 'clamp(120px, 16vh, 180px)',
          paddingBottom: 'clamp(48px, 8vh, 120px)',
        }}
      >
        <div className="space-y-6 hero-stagger">
          
          {/* Eyebrow Label with 48px Decorative Line */}
          <div className="flex items-center gap-4">
            <span
              className="inline-block"
              style={{
                width: 48,
                height: 1,
                backgroundColor: 'var(--gold)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.75rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              CALLE URQUIZA 1315, ROSARIO • EST. 1947
            </span>
          </div>

          {/* Master Editorial Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.25rem, 8.5vw, 9rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.025em',
              textWrap: 'balance',
              color: 'var(--paper)',
              maxWidth: 'min(62vw, 72rem)',
              margin: 0,
            }}
          >
            El Arte del<br />
            <em
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(180deg, #e8cf9a, #b8914f)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Caballero
            </em><br />
            Rosarino
          </h1>

          {/* Editorial Paragraph (Max 52ch width, pure sans, high contrast) */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(1rem, 1.15vw, 1.2rem)',
              lineHeight: 1.65,
              color: 'rgba(245, 238, 225, 0.82)',
              maxWidth: '52ch',
              margin: '1.25rem 0 2rem 0',
            }}
          >
            Descubrí tu corte ideal con nuestro Asesor de Visagismo Inteligente, reservá tu turno para hoy o esta semana y adquirí los mejores geles y pomadas.
          </p>

          {/* Action CTAs — Refined, proportioned, metallic bevel */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 max-w-lg">
            <button
              onClick={() => onNavigate('booking')}
              className="flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #e5c682 0%, #c69d4b 100%)',
                color: '#0b0b0c',
                padding: '0.78rem 1.45rem',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.45)',
              }}
            >
              <CalendarClockIcon size={14} />
              <span>Reservar Turno</span>
            </button>
            
            <button
              onClick={() => onNavigate('visagismo')}
              className="flex items-center justify-center gap-2 transition-all duration-200 hover:border-[var(--gold)] hover:bg-white/[0.07] cursor-pointer backdrop-blur-md"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--paper)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '0.78rem 1.45rem',
                borderRadius: 6,
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              <AiDiagnosticIcon size={14} color="var(--gold)" />
              <span>Probador IA</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── 5. FULL-WIDTH STATS ROW (Pinned to bottom edge, fluid padding) ── */}
      <div
        className="relative z-10 w-full fluid-pad"
        style={{
          borderTop: '1px solid rgba(201, 168, 106, 0.25)',
          paddingTop: 'clamp(20px, 3vh, 32px)',
          paddingBottom: 'clamp(20px, 3vh, 32px)',
          backgroundColor: 'rgba(10, 8, 6, 0.65)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          
          {/* Stat 1 */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--gold)',
                fontVariantNumeric: 'lining-nums tabular-nums',
                lineHeight: 1,
              }}
            >
              1947
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--paper)',
                opacity: 0.6,
                marginTop: '0.4rem',
              }}
            >
              Tradición Rosarina
            </div>
          </div>

          {/* Stat 2 */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--paper)',
                fontVariantNumeric: 'lining-nums tabular-nums',
                lineHeight: 1,
              }}
            >
              +12.000
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--paper)',
                opacity: 0.6,
                marginTop: '0.4rem',
              }}
            >
              Cortes Realizados
            </div>
          </div>

          {/* Stat 3 */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--gold)',
                fontVariantNumeric: 'lining-nums tabular-nums',
                lineHeight: 1,
              }}
            >
              100%
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--paper)',
                opacity: 0.6,
                marginTop: '0.4rem',
              }}
            >
              Atención Personalizada
            </div>
          </div>

          {/* Stat 4 */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)',
                fontWeight: 700,
                color: 'var(--paper)',
                fontVariantNumeric: 'lining-nums tabular-nums',
                lineHeight: 1,
              }}
            >
              IA 4.0
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--paper)',
                opacity: 0.6,
                marginTop: '0.4rem',
              }}
            >
              Visagismo Antropométrico
            </div>
          </div>

        </div>
      </div>
    </section>
  )
})

export default HeroSection
