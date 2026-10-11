import React, { memo } from 'react'
import { Toast } from '../types'
import { ShieldCheckIcon, AiDiagnosticIcon } from './icons/CustomIcons'

interface ToastNotificationProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastNotification: React.FC<ToastNotificationProps> = memo(({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isGold = toast.type === 'gold'
        const isSuccess = toast.type === 'success'

        return (
          <div
            key={toast.id}
            onClick={() => onRemove(toast.id)}
            className={`pointer-events-auto p-4 rounded-lg shadow-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-fadeIn cursor-pointer transition-all ${
              isGold
                ? 'bg-[#12100d] border-[#d4af67] text-[#f5ebd7]'
                : isSuccess
                ? 'bg-[#0a1710] border-[#10b981] text-[#10b981]'
                : 'bg-[#12100d] border-[#d4af67]/30 text-[#f5ebd7]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isGold ? (
                <AiDiagnosticIcon size={16} className="text-[#d4af67] shrink-0" />
              ) : isSuccess ? (
                <ShieldCheckIcon size={16} className="text-[#10b981] shrink-0" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#d4af67] shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button className="text-[#a89b88] hover:text-[#f5ebd7] font-bold p-1">✕</button>
          </div>
        )
      })}
    </div>
  )
})

export default ToastNotification
