import React, { memo } from 'react'
import { CartItem } from '../types'
import { fmt } from '../data/mockData'
import { LuxuryBagIcon } from './icons/CustomIcons'

interface CartDrawerProps {
  isOpen: boolean
  cart: CartItem[]
  onClose: () => void
  onUpdateQty: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

const CartDrawer: React.FC<CartDrawerProps> = memo(({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#070605]/85 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12100d] border-l border-[#d4af67]/30 shadow-2xl flex flex-col justify-between p-6">
          
          {/* Cart Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af67]/20 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#1c1712] text-[#d4af67]">
                  <LuxuryBagIcon size={20} />
                </div>
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#f5ebd7]">
                  Tu Carrito Capilar
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#a89b88] hover:text-[#f5ebd7] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#a89b88]">
                <div className="w-16 h-16 rounded-full bg-[#18140f] border border-[#d4af67]/20 flex items-center justify-center mx-auto mb-3 text-[#d4af67]">
                  <LuxuryBagIcon size={28} />
                </div>
                <p className="text-sm font-bold text-[#f5ebd7]">Tu carrito está vacío</p>
                <p className="text-xs text-[#a89b88] mt-1">Explora nuestra boutique y agrega tus pomadas y ceras preferidas.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#0a0907] rounded-lg border border-[#d4af67]/20 flex items-center justify-between gap-3"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border border-[#d4af67]/30" />
                    )}

                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#f5ebd7] leading-tight mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#d4af67] font-mono font-bold">
                        {fmt(item.price)}
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 bg-[#16120e] border border-[#d4af67]/20 rounded px-2 py-1">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="text-xs text-[#d4af67] font-bold px-1 hover:text-[#f5ebd7] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-[#f5ebd7]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="text-xs text-[#d4af67] font-bold px-1 hover:text-[#f5ebd7] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1.5 rounded hover:bg-rose-950/40 cursor-pointer"
                      title="Eliminar del carrito"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer Total & Checkout */}
          {cart.length > 0 && (
            <div className="pt-6 border-t border-[#d4af67]/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#a89b88] uppercase">Subtotal Estimado:</span>
                <span className="font-['Playfair_Display'] text-2xl font-bold text-[#d4af67]">
                  {fmt(subtotal)}
                </span>
              </div>

              <p className="text-[11px] text-[#a89b88]">
                Al presionar el botón a continuación, se abrirá un chat directo con la barbería para coordinar retiro inmediato en local o envío en Rosario.
              </p>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-[#0b0a08] font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Coordinar Pedido por WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
})

export default CartDrawer
