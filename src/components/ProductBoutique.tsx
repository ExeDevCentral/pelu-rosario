import React, { useState, memo } from 'react'
import { HAIR_PRODUCTS, fmt } from '../data/mockData'
import { HairProduct } from '../types'
import { PomadePotIcon, LuxuryBagIcon } from './icons/CustomIcons'

interface ProductBoutiqueProps {
  onAddToCart: (product: HairProduct) => void
}

const ProductBoutique: React.FC<ProductBoutiqueProps> = memo(({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = ['TODOS', 'Cremas & Pomadas', 'Geles', 'Ceras', 'Aceites & Bálsamos']

  const filteredProducts = HAIR_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'TODOS' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="products" className="py-24 bg-[#070605] border-t border-[#d4af67]/20 relative cvis">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16120e] border border-[#d4af67]/30 text-xs font-black text-[#d4af67] uppercase tracking-widest mb-3">
            <PomadePotIcon size={16} />
            <span>COSMÉTICA MASCULINA EXCLUSIVA</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f5ebd7] mb-4">
            Boutique Capilar Rosarina
          </h2>
          <p className="text-sm sm:text-base text-[#a89b88]">
            Formulaciones artesanales de autor para el peinado y nutrición capilar diaria en Rosario. Retirá en local de calle Urquiza o coordiná entrega a domicilio.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d4af67] text-[#0b0a08] shadow'
                    : 'bg-[#14110d] text-[#a89b88] border border-[#d4af67]/20 hover:border-[#d4af67]/60 hover:text-[#f5ebd7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar pomada, crema o aceite..."
              className="w-full pl-9 pr-4 py-2 bg-[#12100d] border border-[#d4af67]/30 rounded-lg text-xs text-[#f5ebd7] outline-none focus:border-[#d4af67]"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-[#a89b88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#12100d] rounded-xl border border-[#d4af67]/20 hover:border-[#d4af67]/60 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-[#18140f]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#0a0907]/90 backdrop-blur-md border border-[#d4af67]/40 text-[#d4af67] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {prod.category}
                </span>
              </div>

              {/* Product Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#f5ebd7] mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#a89b88] leading-relaxed mb-4">
                    {prod.description}
                  </p>
                  
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#090807] p-3 rounded-lg border border-[#d4af67]/15 mb-4">
                    <div>
                      <span className="text-[#a89b88] block font-semibold">Fijación:</span>
                      <span className="text-[#d4af67] font-bold">{prod.hold}</span>
                    </div>
                    <div>
                      <span className="text-[#a89b88] block font-semibold">Brillo:</span>
                      <span className="text-[#d4af67] font-bold">{prod.shine}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add Button */}
                <div className="flex items-center justify-between pt-4 border-t border-[#d4af67]/20">
                  <div className="font-['Playfair_Display'] text-2xl font-extrabold text-[#d4af67]">
                    {fmt(prod.price)}
                  </div>

                  <button
                    onClick={() => onAddToCart(prod)}
                    className="px-4 py-2.5 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <LuxuryBagIcon size={14} />
                    <span>+ Agregar</span>
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

export default ProductBoutique
