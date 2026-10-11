import React from 'react'

interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
  color?: string
}

// Tijeras de barbero de precisión grabadas artesanalmente
export const ScissorsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)

// Navaja clásica de barbero abierta (Straight Razor)
export const StraightRazorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 20L10 14" />
    <path d="M10 14L8 6C8 4.89543 8.89543 4 10 4H18C19.1046 4 20 4.89543 20 6V9C20 10.1046 19.1046 11 18 11H13L10 14Z" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" />
    <line x1="11" y1="7" x2="17" y2="7" />
  </svg>
)

// Tarro de pomada / crema capilar de boticario
export const PomadePotIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="10" width="18" height="10" rx="3" />
    <path d="M5 10V8C5 6.89543 5.89543 6 7 6H17C18.1046 6 19 6.89543 19 8V10" />
    <line x1="3" y1="13" x2="21" y2="13" strokeDasharray="1 1" />
    <circle cx="12" cy="16" r="1.5" />
    <path d="M9 3H15" />
  </svg>
)

// Emblema Heráldico de El Búho Dorado (Monograma / Sello geométrico de autor)
export const HeraldicOwlIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.6, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2L4 6V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V6L12 2Z" />
    <circle cx="9" cy="10" r="2" />
    <circle cx="15" cy="10" r="2" />
    <path d="M12 12V14.5L11 16" />
    <path d="M8 6L10 8" />
    <path d="M16 6L14 8" />
  </svg>
)

// Diagnóstico Facial y Proporción Áurea (IA Visagismo)
export const AiDiagnosticIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 3C7.5 3 4 6.5 4 11C4 16 8 20.5 12 21.5C16 20.5 20 16 20 11C20 6.5 16.5 3 12 3Z" />
    <line x1="8" y1="10" x2="16" y2="10" strokeDasharray="1.5 1.5" />
    <line x1="12" y1="5" x2="12" y2="19" strokeDasharray="1.5 1.5" />
    <circle cx="12" cy="10" r="1.5" fill="currentColor" />
    <path d="M10 15C11 15.5 13 15.5 14 15" />
  </svg>
)

// Calendario con reloj de citas sin espera
export const CalendarClockIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="5" />
    <line x1="16" y1="2" x2="16" y2="5" />
    <circle cx="15" cy="15" r="3.5" />
    <polyline points="15 13.5 15 15 16.5 15" />
  </svg>
)

// Bolsa Boutique Capilar
export const LuxuryBagIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M5 8H19L18 20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20L5 8Z" />
    <path d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" />
    <circle cx="12" cy="14" r="1.5" />
  </svg>
)

// Ficha de Cliente / CRM
export const ClientCardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M19 21V19C19 16.7909 17.2091 15 15 15H9C6.79086 15 5 16.7909 5 19V21" />
    <circle cx="12" cy="8" r="4" />
    <line x1="18" y1="8" x2="21" y2="8" />
    <line x1="18" y1="11" x2="21" y2="11" />
  </svg>
)

// Gráfico y Reportes de Negocio
export const FinancialReportIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M3 3V21H21" />
    <path d="M7 16L12 10L16 13L21 6" />
    <polyline points="17 6 21 6 21 10" />
    <circle cx="12" cy="10" r="1.5" fill="currentColor" />
  </svg>
)

// Inventario / Control de Stock
export const InventoryBoxIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M21 8L12 3L3 8V16L12 21L21 16V8Z" />
    <path d="M3 8L12 13L21 8" />
    <line x1="12" y1="13" x2="12" y2="21" />
    <path d="M7.5 5.5L16.5 10.5" strokeDasharray="1 1" />
  </svg>
)

// Exportar Archivo / Descargar Planilla
export const ExportFileIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="12" x2="12" y2="18" />
    <polyline points="9 15 12 18 15 15" />
  </svg>
)

// Escudo Seguro / Autenticación
export const ShieldCheckIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size, strokeWidth = 1.75, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 22S4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
