import React, { memo } from 'react'
import { HeraldicOwlIcon } from './icons/CustomIcons'

const LocationFooter: React.FC = memo(() => {
  return (
    <footer className="bg-[#070605] border-t border-[#d4af67]/30 pt-16 pb-12 text-[#f5ebd7]/80">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-[#d4af67] bg-[#14110d] flex items-center justify-center text-[#d4af67]">
              <HeraldicOwlIcon size={22} />
            </div>
            <div>
              <div className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7] leading-tight">
                PELUQUERÍA BRIAN
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#d4af67] uppercase font-bold">
                El Búho Dorado • Est. 1947
              </div>
            </div>
          </div>
          <p className="text-xs text-[#a89b88] leading-relaxed">
            Barbería clásica rosarina especializada en cortes de caballero, afeitado a navaja tradicional con toallas calientes y visagismo capilar de autor.
          </p>
        </div>

        {/* Col 2: Hours */}
        <div>
          <h4 className="font-['Playfair_Display'] text-base font-bold text-[#d4af67] mb-4 uppercase tracking-wider">
            Horarios de Atención
          </h4>
          <ul className="text-xs space-y-2">
            <li className="flex justify-between border-b border-[#d4af67]/15 pb-1">
              <span className="text-[#a89b88]">Lunes a Viernes:</span>
              <span className="font-bold text-[#f5ebd7]">09:30 - 20:00 hs</span>
            </li>
            <li className="flex justify-between border-b border-[#d4af67]/15 pb-1">
              <span className="text-[#a89b88]">Sábados:</span>
              <span className="font-bold text-[#f5ebd7]">09:00 - 20:30 hs</span>
            </li>
            <li className="flex justify-between text-[#a89b88]/50">
              <span>Domingos:</span>
              <span>Cerrado</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Location */}
        <div>
          <h4 className="font-['Playfair_Display'] text-base font-bold text-[#d4af67] mb-4 uppercase tracking-wider">
            Ubicación & Contacto
          </h4>
          <div className="text-xs space-y-3 text-[#a89b88]">
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#d4af67]">•</span>
              <span>Calle Urquiza 1315, Rosario, Santa Fe</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold text-[#d4af67]">•</span>
              <span>+54 9 341 000-0000</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold text-[#d4af67]">•</span>
              <span>contacto@peluqueriabrian.com.ar</span>
            </p>
          </div>
        </div>

        {/* Col 4: Map Embed Mock / Social */}
        <div>
          <h4 className="font-['Playfair_Display'] text-base font-bold text-[#d4af67] mb-4 uppercase tracking-wider">
            Visítanos en Rosario
          </h4>
          <div className="w-full h-32 rounded-lg bg-[#14110d] border border-[#d4af67]/20 overflow-hidden relative group">
            <iframe
              title="Ubicación Peluquería Brian"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.1!2d-60.64!3d-32.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU2JzI0LjAiUyA2MMKwMzgnMjQuMCJX!5e0!3m2!1ses!2sar!4v1600000000000!5m2!1ses!2sar"
              className="w-full h-full border-0 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
              loading="lazy"
            />
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-[#d4af67]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a89b88]">
        <div>
          © {new Date().getFullYear()} Peluquería Brian • El Búho Dorado Barbería Boutique. Todos los derechos reservados.
        </div>
        <div className="mt-2 sm:mt-0 flex gap-4">
          <span className="text-[#d4af67]">Rosario, Argentina</span>
        </div>
      </div>
    </footer>
  )
})

export default LocationFooter
