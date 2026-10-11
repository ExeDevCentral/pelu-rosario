import React, { memo } from 'react'
import {
  HeraldicOwlIcon,
  LuxuryBagIcon,
  ShieldCheckIcon,
  AiDiagnosticIcon,
} from './icons/CustomIcons'

interface HeaderNavbarProps {
  cartCount: number
  onOpenCart: () => void
  onOpenAdmin: () => void
  onNavigate: (sectionId: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderNavbar: React.FC<HeaderNavbarProps> = memo(({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0806]/92 backdrop-blur-md border-b border-[#c9a86a]/20 py-3.5 transition-all duration-300">
      <div className="w-full flex items-center justify-between fluid-pad">
        
        {/* LOGO */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg border border-[#d4af67]/50 bg-[#1a1510] flex items-center justify-center text-[#d4af67] group-hover:border-[#d4af67] group-hover:scale-105 transition-all shadow-md">
            <HeraldicOwlIcon size={22} />
          </div>
          <div>
            <div className="font-['Playfair_Display'] text-lg sm:text-xl font-bold tracking-wide text-[#f5ebd7] group-hover:text-[#d4af67] transition-colors leading-tight">
              PELU ROSARIO
            </div>
            <div className="text-[9px] tracking-[0.25em] text-[#d4af67] uppercase font-bold">
              El Búho Dorado • Rosario 1947
            </div>
          </div>
        </button>

        {/* DESKTOP NAV LINKS (Wide spacing) */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-xs font-bold tracking-wider text-[#b8a994]">
          <button onClick={() => onNavigate('catalog')} className="hover:text-[#d4af67] transition-colors cursor-pointer uppercase">
            Cortes Exclusivos
          </button>
          <button onClick={() => onNavigate('visagismo')} className="hover:text-[#d4af67] transition-colors cursor-pointer uppercase flex items-center gap-1.5 text-[#d4af67]">
            <AiDiagnosticIcon size={14} />
            <span>Asesor IA Capilar</span>
          </button>
          <button onClick={() => onNavigate('services')} className="hover:text-[#d4af67] transition-colors cursor-pointer uppercase">
            Servicios & Rituales
          </button>
          <button onClick={() => onNavigate('products')} className="hover:text-[#d4af67] transition-colors cursor-pointer uppercase">
            Boutique de Cremas
          </button>
          <button onClick={() => onNavigate('team')} className="hover:text-[#d4af67] transition-colors cursor-pointer uppercase">
            Barberos
          </button>
          <button onClick={() => onNavigate('booking')} className="px-4 py-2 rounded bg-[#d4af67] text-[#0b0a08] hover:bg-[#e8c98b] font-black transition-all cursor-pointer uppercase shadow-md">
            Reservar Turno
          </button>
        </div>

        {/* ACTIONS (CART & ADMIN & MOBILE TOGGLE) */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg bg-[#1a1510] border border-[#d4af67]/35 text-[#f5ebd7] hover:border-[#d4af67] hover:text-[#d4af67] transition-all cursor-pointer"
            title="Ver Carrito de Compras"
          >
            <LuxuryBagIcon size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#d4af67] text-[#0b0a08] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-lg bg-[#1a1510] border border-[#d4af67]/35 text-[#b8a994] hover:text-[#d4af67] hover:border-[#d4af67] transition-all cursor-pointer"
            title="Acceso Administración & Base de Datos"
          >
            <ShieldCheckIcon size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-[#f5ebd7] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#d4af67]/20 flex flex-col gap-2 text-xs font-bold tracking-wider text-[#f5ebd7] bg-[#14110d]/98 p-4 rounded-xl border border-[#d4af67]/30">
          <button onClick={() => { onNavigate('catalog'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67]">
            Cortes Exclusivos
          </button>
          <button onClick={() => { onNavigate('visagismo'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67] text-[#d4af67] flex items-center gap-1.5">
            <AiDiagnosticIcon size={14} />
            <span>Asesor IA Capilar</span>
          </button>
          <button onClick={() => { onNavigate('services'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67]">
            Servicios & Rituales
          </button>
          <button onClick={() => { onNavigate('booking'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67] text-[#d4af67]">
            Reservar Turno
          </button>
          <button onClick={() => { onNavigate('products'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67]">
            Boutique de Cremas
          </button>
          <button onClick={() => { onNavigate('team'); setIsMobileMenuOpen(false) }} className="py-2 text-left hover:text-[#d4af67]">
            Nuestros Barberos
          </button>
          <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false) }} className="py-2 text-left text-[#d4af67] flex items-center gap-1.5 border-t border-[#d4af67]/20 mt-1 pt-2">
            <ShieldCheckIcon size={14} />
            <span>Panel de Administración</span>
          </button>
        </div>
      )}
    </nav>
  )
})

export default HeaderNavbar
