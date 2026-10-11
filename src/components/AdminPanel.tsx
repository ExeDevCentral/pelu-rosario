import React, { useState, useEffect, useCallback } from 'react'
import {
  dbService,
  ClientProfile,
  AppointmentRecord,
  InventoryItem,
  SaleRecord,
  FinancialReportSummary,
} from '../services/db'
import {
  ShieldCheckIcon,
  CalendarClockIcon,
  ClientCardIcon,
  InventoryBoxIcon,
  FinancialReportIcon,
  ExportFileIcon,
  ScissorsIcon,
  PomadePotIcon,
} from './icons/CustomIcons'

interface AdminPanelProps {
  onClose: () => void
  onAddToast?: (msg: string, type?: 'success' | 'info' | 'gold') => void
}

type TabKey = 'turnos' | 'clientes' | 'stock' | 'reportes'

export default function AdminPanel({ onClose, onAddToast }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [authError, setAuthError] = useState('')
  const [checking, setChecking] = useState(false)

  // Current Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('turnos')

  // Data States
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [summary, setSummary] = useState<FinancialReportSummary | null>(null)
  const [loading, setLoading] = useState(true)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('TODOS')

  // Client Modal (New / Edit)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [selectedClientForNotes, setSelectedClientForNotes] = useState<ClientProfile | null>(null)
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientHairType, setNewClientHairType] = useState('Lacio Fino')
  const [newClientNotes, setNewClientNotes] = useState('')

  // Quick OTC Cream Sale Modal
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [saleProductId, setSaleProductId] = useState('')
  const [saleQty, setSaleQty] = useState(1)
  const [saleCustomerName, setSaleCustomerName] = useState('')

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [apts, clis, invs, sls, rep] = await Promise.all([
        dbService.appointments.getAll(),
        dbService.clients.getAll(),
        dbService.inventory.getAll(),
        dbService.sales.getAll(),
        dbService.reports.getSummary(),
      ])
      setAppointments(apts)
      setClients(clis)
      setInventory(invs)
      setSales(sls)
      setSummary(rep)
      if (invs.length > 0 && !saleProductId) {
        setSaleProductId(invs[0].id)
      }
    } catch (e) {
      console.error('[Admin] Error loading DB data:', e)
    } finally {
      setLoading(false)
    }
  }, [saleProductId])

  useEffect(() => {
    if (authed) {
      loadAllData()
    }
  }, [authed, loadAllData])

  const handleSubmitPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setAuthError('')
    try {
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const data = await response.json()
      if (data.success) {
        setAuthed(true)
      } else {
        setAuthError(data.error || 'PIN incorrecto')
      }
    } catch {
      // Backend desconectado: modo local habilitado
      setAuthed(true)
    } finally {
      setChecking(false)
    }
  }

  // Appointment Actions
  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentRecord['status']) => {
    await dbService.appointments.updateStatus(id, status)
    await loadAllData()
    if (onAddToast) onAddToast(`Turno actualizado a "${status}"`, 'success')
  }

  // Client Actions
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim() || !newClientPhone.trim()) return

    await dbService.clients.create({
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      email: '',
      lastVisit: 'Hoy',
      hairType: newClientHairType,
      notes: newClientNotes,
    })

    setIsClientModalOpen(false)
    setNewClientName('')
    setNewClientPhone('')
    setNewClientNotes('')
    await loadAllData()
    if (onAddToast) onAddToast('Nuevo cliente registrado en la base de datos', 'gold')
  }

  const handleUpdateNotes = async () => {
    if (!selectedClientForNotes) return
    await dbService.clients.update(selectedClientForNotes.id, {
      notes: selectedClientForNotes.notes,
    })
    setSelectedClientForNotes(null)
    await loadAllData()
    if (onAddToast) onAddToast('Notas técnicas del cliente guardadas', 'success')
  }

  // Inventory Quick Action
  const handleAdjustStock = async (id: string, delta: number) => {
    await dbService.inventory.updateStock(id, delta)
    await loadAllData()
  }

  // Register OTC Product Sale
  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault()
    const product = inventory.find(p => p.id === saleProductId)
    if (!product) return

    await dbService.sales.create({
      clientName: saleCustomerName.trim() || 'Cliente Mostrador',
      items: [
        {
          productId: product.id,
          productName: product.name,
          qty: saleQty,
          unitPrice: product.price,
        },
      ],
      totalAmount: product.price * saleQty,
      paymentMethod: 'efectivo',
      dateDisplay: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
    })

    setIsSaleModalOpen(false)
    setSaleCustomerName('')
    setSaleQty(1)
    await loadAllData()
    if (onAddToast) onAddToast(`Venta de ${product.name} x${saleQty} registrada`, 'gold')
  }

  // Export CSV Action
  const handleDownloadCsv = async () => {
    const csvContent = await dbService.reports.exportAppointmentsCsv()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reporte_peluqueria_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    if (onAddToast) onAddToast('Planilla de turnos exportada con éxito', 'success')
  }

  // Filtering for appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = filterStatus === 'TODOS' || a.status === filterStatus
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.serviceName.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  // Filtering for clients
  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.notes.toLowerCase().includes(q)
  })

  return (
    <div className="fixed inset-0 z-50 bg-[#070605]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {!authed ? (
        /* AUTH PIN MODAL */
        <div className="w-full max-w-md bg-[#12100d] border border-[#d4af67]/30 rounded-xl p-8 shadow-2xl text-center relative">
          <div className="w-14 h-14 rounded-full bg-[#1b1712] border border-[#d4af67]/40 flex items-center justify-center mx-auto mb-4 text-[#d4af67]">
            <ShieldCheckIcon size={28} />
          </div>
          <span className="text-[10px] text-[#d4af67] tracking-[0.3em] font-extrabold uppercase block mb-1">
            CONTROL ADMINISTRATIVO • DEMO DB
          </span>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#f5ebd7] mb-2">
            Acceso al Sistema
          </h2>
          <p className="text-xs text-[#a89b88] mb-6">
            Ingresá el PIN de administración para acceder a la base de datos, clientes y reportes.
          </p>

          <form onSubmit={handleSubmitPin}>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••"
              className="w-full p-3 bg-[#0a0907] border border-[#d4af67]/30 focus:border-[#d4af67] rounded text-[#f5ebd7] text-xl tracking-[0.5em] text-center outline-none transition-all mb-3"
            />
            {authError && <p className="text-xs text-rose-400 mb-3">{authError}</p>}
            <button
              type="submit"
              disabled={checking}
              className="w-full py-3 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] font-black text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg"
            >
              {checking ? 'Verificando...' : 'Entrar al Panel'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#d4af67]/15 flex items-center justify-between text-[11px] text-[#a89b88]">
            <span>Modo Demo: Cualquier PIN ingresa en local</span>
            <button onClick={onClose} className="text-[#d4af67] hover:underline cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        /* FULL ADMIN DASHBOARD */
        <div className="w-full max-w-6xl h-[92vh] bg-[#12100d] border border-[#d4af67]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          
          {/* TOP HEADER */}
          <header className="px-6 py-4 bg-[#0a0907] border-b border-[#d4af67]/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#1a1612] border border-[#d4af67]/30 text-[#d4af67]">
                <ShieldCheckIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#f5ebd7]">
                    Panel de Gestión & Base de Datos
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                    DEMO SUPABASE ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#a89b88]">
                  Rosario Central • Arquitectura de datos desacoplada lista para sincronización en la nube
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded bg-[#1c1813] border border-[#d4af67]/30 hover:border-[#d4af67] text-[#d4af67] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                title="Descargar planilla CSV para Excel"
              >
                <ExportFileIcon size={16} />
                <span className="hidden sm:inline">Exportar Planilla</span>
              </button>
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 text-xs font-bold transition-all cursor-pointer"
              >
                ✕ Salir
              </button>
            </div>
          </header>

          {/* KPI BAR */}
          {summary && (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-3 bg-[#0d0c0a] border-b border-[#d4af67]/15">
              <div className="p-3 bg-[#15120e] rounded border border-[#d4af67]/15">
                <span className="text-[10px] text-[#a89b88] uppercase tracking-wider block font-semibold">
                  Ingresos Servicios
                </span>
                <span className="font-['Playfair_Display'] text-lg font-black text-[#d4af67]">
                  $ {summary.totalServiceRevenue.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-[#10b981] block">
                  {summary.completedAppointmentsCount} turnos atendidos
                </span>
              </div>

              <div className="p-3 bg-[#15120e] rounded border border-[#d4af67]/15">
                <span className="text-[10px] text-[#a89b88] uppercase tracking-wider block font-semibold">
                  Venta de Cremas & Boutique
                </span>
                <span className="font-['Playfair_Display'] text-lg font-black text-[#f5ebd7]">
                  $ {summary.totalProductRevenue.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-[#a89b88] block">
                  Cosmética capilar de mostrador
                </span>
              </div>

              <div className="p-3 bg-[#15120e] rounded border border-[#d4af67]/15">
                <span className="text-[10px] text-[#a89b88] uppercase tracking-wider block font-semibold">
                  Señas Mercado Pago
                </span>
                <span className="font-['Playfair_Display'] text-lg font-black text-[#10b981]">
                  $ {summary.totalDepositsCollected.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-[#a89b88] block">
                  Garantía 50% recaudada
                </span>
              </div>

              <div className="p-3 bg-[#15120e] rounded border border-[#d4af67]/15">
                <span className="text-[10px] text-[#a89b88] uppercase tracking-wider block font-semibold">
                  Clientes en Base de Datos
                </span>
                <span className="font-['Playfair_Display'] text-lg font-black text-[#f5ebd7]">
                  {summary.activeClientsCount} Clientes
                </span>
                <span className="text-[10px] text-[#d4af67] block">
                  Ticket prom: $ {summary.averageTicket.toLocaleString('es-AR')}
                </span>
              </div>
            </section>
          )}

          {/* NAVIGATION TABS & SEARCH */}
          <div className="px-6 py-3 bg-[#12100d] border-b border-[#d4af67]/15 flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('turnos'); setSearchQuery('') }}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'turnos'
                    ? 'bg-[#d4af67] text-[#0b0a08] shadow'
                    : 'bg-[#181510] text-[#a89b88] hover:text-[#f5ebd7]'
                }`}
              >
                <CalendarClockIcon size={16} />
                <span>Agenda de Turnos ({appointments.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('clientes'); setSearchQuery('') }}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'clientes'
                    ? 'bg-[#d4af67] text-[#0b0a08] shadow'
                    : 'bg-[#181510] text-[#a89b88] hover:text-[#f5ebd7]'
                }`}
              >
                <ClientCardIcon size={16} />
                <span>Directorio Clientes ({clients.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('stock'); setSearchQuery('') }}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'stock'
                    ? 'bg-[#d4af67] text-[#0b0a08] shadow'
                    : 'bg-[#181510] text-[#a89b88] hover:text-[#f5ebd7]'
                }`}
              >
                <InventoryBoxIcon size={16} />
                <span>Stock de Cremas ({inventory.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('reportes'); setSearchQuery('') }}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'reportes'
                    ? 'bg-[#d4af67] text-[#0b0a08] shadow'
                    : 'bg-[#181510] text-[#a89b88] hover:text-[#f5ebd7]'
                }`}
              >
                <FinancialReportIcon size={16} />
                <span>Reportes & Rendimiento</span>
              </button>
            </div>

            {/* Quick Actions & Search */}
            <div className="flex items-center gap-3">
              {activeTab === 'turnos' && (
                <div className="flex items-center gap-1">
                  {['TODOS', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO'].map(st => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        filterStatus === st
                          ? 'bg-[#d4af67]/20 text-[#d4af67] border border-[#d4af67]/40'
                          : 'text-[#a89b88] hover:text-[#f5ebd7]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'clientes' && (
                <button
                  onClick={() => setIsClientModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-[#10b981] hover:bg-[#059669] text-[#0b0a08] text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ Nuevo Cliente</span>
                </button>
              )}

              {activeTab === 'stock' && (
                <button
                  onClick={() => setIsSaleModalOpen(true)}
                  className="px-3 py-1.5 rounded bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PomadePotIcon size={14} />
                  <span>+ Venta Mostrador</span>
                </button>
              )}

              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="px-3 py-1.5 bg-[#0a0907] border border-[#d4af67]/25 rounded text-xs text-[#f5ebd7] outline-none focus:border-[#d4af67] w-36 sm:w-48"
              />
            </div>
          </div>

          {/* MAIN TAB CONTENT AREA */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#0e0c0a]">
            
            {/* 1. TAB: AGENDA DE TURNOS */}
            {activeTab === 'turnos' && (
              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-16 text-[#a89b88] text-sm">
                    No se encontraron turnos registrados con este criterio.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#d4af67]/20 text-[#d4af67] uppercase font-bold text-[10px] tracking-wider">
                          <th className="py-3 px-3">Voucher</th>
                          <th className="py-3 px-3">Cliente</th>
                          <th className="py-3 px-3">Servicio</th>
                          <th className="py-3 px-3">Barbero</th>
                          <th className="py-3 px-3">Día & Horario</th>
                          <th className="py-3 px-3 text-right">Seña (50%)</th>
                          <th className="py-3 px-3 text-right">Total</th>
                          <th className="py-3 px-3 text-center">Estado</th>
                          <th className="py-3 px-3 text-right">Gestión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d4af67]/10">
                        {filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-[#15120e] transition-colors">
                            <td className="py-3 px-3 font-mono text-[#d4af67] font-bold">
                              {apt.id}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-[#f5ebd7] block">{apt.customerName}</span>
                              <span className="text-[11px] text-[#a89b88]">{apt.customerPhone || 'Sin tel.'}</span>
                            </td>
                            <td className="py-3 px-3 text-[#f5ebd7]/90">{apt.serviceName}</td>
                            <td className="py-3 px-3 text-[#f5ebd7]/80">{apt.barberName}</td>
                            <td className="py-3 px-3 font-medium text-[#f5ebd7]">
                              {apt.dateDisplay} · {apt.time} hs
                            </td>
                            <td className="py-3 px-3 text-right text-[#10b981] font-bold">
                              $ {apt.depositPaid.toLocaleString('es-AR')}
                            </td>
                            <td className="py-3 px-3 text-right text-[#d4af67] font-bold">
                              $ {apt.totalPrice.toLocaleString('es-AR')}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  apt.status === 'CONFIRMADO'
                                    ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                                    : apt.status === 'COMPLETADO'
                                    ? 'bg-[#d4af67]/20 text-[#d4af67] border border-[#d4af67]/30'
                                    : apt.status === 'CANCELADO'
                                    ? 'bg-rose-950/40 text-rose-400 border border-rose-800/30'
                                    : 'bg-amber-950/40 text-amber-400 border border-amber-800/30'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {apt.status !== 'COMPLETADO' && (
                                  <button
                                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'COMPLETADO')}
                                    className="px-2 py-1 bg-[#d4af67] text-[#0b0a08] rounded text-[10px] font-bold uppercase hover:bg-[#e8c98b] cursor-pointer"
                                    title="Marcar como atendido y cobrado"
                                  >
                                    Cobrar
                                  </button>
                                )}
                                {apt.status !== 'CONFIRMADO' && apt.status !== 'COMPLETADO' && (
                                  <button
                                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'CONFIRMADO')}
                                    className="px-2 py-1 bg-[#10b981] text-[#0b0a08] rounded text-[10px] font-bold uppercase hover:bg-[#059669] cursor-pointer"
                                  >
                                    Confirmar
                                  </button>
                                )}
                                {apt.status !== 'CANCELADO' && (
                                  <button
                                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'CANCELADO')}
                                    className="px-2 py-1 bg-transparent border border-rose-800/40 text-rose-400 rounded text-[10px] font-bold uppercase hover:bg-rose-950/50 cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. TAB: DIRECTORIO CLIENTES (CRM CAPILAR) */}
            {activeTab === 'clientes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    className="p-5 bg-[#14120e] rounded-xl border border-[#d4af67]/20 hover:border-[#d4af67]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7]">
                            {client.name}
                          </h3>
                          <span className="text-xs text-[#d4af67] font-medium">{client.phone}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#1f1b14] border border-[#d4af67]/30 text-[#d4af67] text-[10px] font-black rounded uppercase">
                          {client.totalVisits} visitas
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#a89b88] my-3 bg-[#0a0907] p-3 rounded-lg border border-[#d4af67]/10">
                        <div>
                          <strong className="text-[#f5ebd7]">Tipo de Cabello: </strong>
                          <span>{client.hairType}</span>
                        </div>
                        <div>
                          <strong className="text-[#f5ebd7]">Corte Frecuente: </strong>
                          <span>{client.preferredStyle || 'Corte Clásico'}</span>
                        </div>
                        <div>
                          <strong className="text-[#f5ebd7]">Barbero Preferido: </strong>
                          <span>{client.preferredBarberName || 'Sin preferencia'}</span>
                        </div>
                        <div>
                          <strong className="text-[#f5ebd7]">Última Visita: </strong>
                          <span>{client.lastVisit}</span>
                        </div>
                      </div>

                      <div className="text-xs text-[#a89b88] italic bg-[#17140f] p-2.5 rounded border border-[#d4af67]/15 mb-3">
                        "{client.notes || 'Sin notas técnicas registradas.'}"
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#d4af67]/15">
                      <span className="text-xs font-bold text-[#10b981]">
                        Total Gastado: $ {client.totalSpent.toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={() => setSelectedClientForNotes(client)}
                        className="text-xs text-[#d4af67] hover:underline font-bold cursor-pointer"
                      >
                        Editar Ficha Técnica
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. TAB: STOCK DE CREMAS Y BOUTIQUE */}
            {activeTab === 'stock' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inventory.map(prod => {
                    const isLowStock = prod.stock <= prod.minStockAlert
                    return (
                      <div
                        key={prod.id}
                        className={`p-5 rounded-xl border flex flex-col justify-between ${
                          isLowStock
                            ? 'bg-[#18110e] border-rose-800/50'
                            : 'bg-[#14120e] border-[#d4af67]/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] text-[#d4af67] font-bold uppercase tracking-wider">
                              {prod.category}
                            </span>
                            {isLowStock && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-950/60 text-rose-300 border border-rose-800/60 animate-pulse">
                                ¡STOCK CRÍTICO!
                              </span>
                            )}
                          </div>
                          <h3 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-[#a89b88] line-clamp-2 mb-3">
                            {prod.description}
                          </p>
                          <div className="flex items-center justify-between text-xs bg-[#0a0907] p-2.5 rounded border border-[#d4af67]/15 mb-3">
                            <span className="text-[#a89b88]">Precio Público:</span>
                            <span className="font-bold text-[#d4af67] text-sm">
                              $ {prod.price.toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>

                        {/* Stock Adjustment Controls */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#d4af67]/15">
                          <div>
                            <span className="text-[10px] text-[#a89b88] block uppercase font-semibold">
                              Unidades Disponibles
                            </span>
                            <span className={`text-xl font-black ${isLowStock ? 'text-rose-400' : 'text-[#f5ebd7]'}`}>
                              {prod.stock} un.
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustStock(prod.id, -1)}
                              disabled={prod.stock <= 0}
                              className="w-8 h-8 rounded bg-[#1a1612] border border-[#d4af67]/30 text-[#f5ebd7] font-bold hover:bg-[#d4af67] hover:text-[#0b0a08] transition-all disabled:opacity-30 cursor-pointer"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleAdjustStock(prod.id, 1)}
                              className="w-8 h-8 rounded bg-[#1a1612] border border-[#d4af67]/30 text-[#f5ebd7] font-bold hover:bg-[#d4af67] hover:text-[#0b0a08] transition-all cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* HISTORIAL RECIENTE DE VENTAS DE CREMAS */}
                <div className="p-5 bg-[#14120e] rounded-xl border border-[#d4af67]/20">
                  <h3 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-3">
                    Últimas Ventas de Mostrador (Cremas & Cosmética)
                  </h3>
                  <div className="space-y-2">
                    {sales.map(s => (
                      <div
                        key={s.id}
                        className="p-3 bg-[#0a0907] rounded-lg border border-[#d4af67]/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-[#f5ebd7] block">{s.clientName}</strong>
                          <span className="text-[#a89b88]">
                            {s.items.map(it => `${it.productName} (x${it.qty})`).join(', ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#d4af67] block">
                            $ {s.totalAmount.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-[#a89b88]">{s.dateDisplay}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TAB: REPORTES DE NEGOCIO */}
            {activeTab === 'reportes' && summary && (
              <div className="space-y-6">
                
                {/* Comparativa Ingresos: Servicios vs Cremas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Desglose de Facturación */}
                  <div className="p-5 bg-[#14120e] rounded-xl border border-[#d4af67]/20">
                    <h3 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-4">
                      Desglose de Facturación Total
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#f5ebd7] font-bold">Servicios & Cortes</span>
                          <span className="text-[#d4af67] font-bold">
                            $ {summary.totalServiceRevenue.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-[#1e1a14] overflow-hidden">
                          <div
                            className="h-full bg-[#d4af67] rounded-full"
                            style={{
                              width: `${
                                summary.totalServiceRevenue + summary.totalProductRevenue > 0
                                  ? (summary.totalServiceRevenue /
                                      (summary.totalServiceRevenue + summary.totalProductRevenue)) *
                                    100
                                  : 50
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#f5ebd7] font-bold">Venta de Cremas & Cosmética</span>
                          <span className="text-[#10b981] font-bold">
                            $ {summary.totalProductRevenue.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-[#1e1a14] overflow-hidden">
                          <div
                            className="h-full bg-[#10b981] rounded-full"
                            style={{
                              width: `${
                                summary.totalServiceRevenue + summary.totalProductRevenue > 0
                                  ? (summary.totalProductRevenue /
                                      (summary.totalServiceRevenue + summary.totalProductRevenue)) *
                                    100
                                  : 50
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#d4af67]/15 flex items-center justify-between text-sm">
                        <span className="font-bold text-[#f5ebd7]">Total Facturado:</span>
                        <span className="font-['Playfair_Display'] text-xl font-black text-[#d4af67]">
                          $ {(summary.totalServiceRevenue + summary.totalProductRevenue).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rendimiento por Barbero */}
                  <div className="p-5 bg-[#14120e] rounded-xl border border-[#d4af67]/20">
                    <h3 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-4">
                      Rendimiento por Profesional
                    </h3>
                    <div className="space-y-3">
                      {summary.barberStats.map((b, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-[#0a0907] rounded-lg border border-[#d4af67]/10 text-xs"
                        >
                          <div>
                            <strong className="text-[#f5ebd7] block">{b.barberName}</strong>
                            <span className="text-[#a89b88]">{b.appointmentsCount} turnos completados</span>
                          </div>
                          <span className="font-bold text-[#10b981] text-sm">
                            $ {b.revenueGenerated.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Top Cremas Vendidas */}
                <div className="p-5 bg-[#14120e] rounded-xl border border-[#d4af67]/20">
                  <h3 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-4">
                    Top Cremas & Pomadas Más Vendidas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {summary.topProducts.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#0a0907] rounded-lg border border-[#d4af67]/15 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] text-[#d4af67] font-black uppercase">
                            #{idx + 1} MÁS VENDIDO
                          </span>
                          <strong className="text-xs text-[#f5ebd7] block mt-0.5">{p.name}</strong>
                          <span className="text-[11px] text-[#a89b88]">{p.unitsSold} unidades despachadas</span>
                        </div>
                        <span className="font-bold text-[#d4af67] text-sm">
                          $ {p.totalRevenue.toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>
      )}

      {/* MODAL: NUEVO CLIENTE */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12100d] border border-[#d4af67]/40 rounded-xl p-6 shadow-2xl">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#f5ebd7] mb-4">
              Registrar Nuevo Cliente en la Base de Datos
            </h3>
            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#d4af67] font-bold uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  placeholder="Ej: Marcos Silveira"
                  className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#d4af67] font-bold uppercase mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={newClientPhone}
                  onChange={e => setNewClientPhone(e.target.value)}
                  placeholder="+54 9 341 000-0000"
                  className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#d4af67] font-bold uppercase mb-1">Tipo de Cabello</label>
                <select
                  value={newClientHairType}
                  onChange={e => setNewClientHairType(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none"
                >
                  <option value="Lacio Fino">Lacio Fino</option>
                  <option value="Lacio Grueso">Lacio Grueso</option>
                  <option value="Ondulado">Ondulado</option>
                  <option value="Rizado">Rizado</option>
                  <option value="Con Entradas / Poca Densidad">Con Entradas / Poca Densidad</option>
                </select>
              </div>
              <div>
                <label className="block text-[#d4af67] font-bold uppercase mb-1">Notas Técnicas del Peluquero</label>
                <textarea
                  value={newClientNotes}
                  onChange={e => setNewClientNotes(e.target.value)}
                  placeholder="Ej: Sensible en cuero cabelludo, prefiere cera mate..."
                  className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 border border-[#d4af67]/30 text-[#a89b88] rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d4af67] text-[#0b0a08] font-black rounded cursor-pointer uppercase"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR NOTAS TÉCNICAS */}
      {selectedClientForNotes && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12100d] border border-[#d4af67]/40 rounded-xl p-6 shadow-2xl">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7] mb-2">
              Notas Técnicas: {selectedClientForNotes.name}
            </h3>
            <p className="text-xs text-[#a89b88] mb-4">
              Anotaciones de preferencias de corte, navaja, productos o sensibilidades.
            </p>
            <textarea
              value={selectedClientForNotes.notes}
              onChange={e => setSelectedClientForNotes({ ...selectedClientForNotes, notes: e.target.value })}
              className="w-full p-3 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none h-28 text-xs mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedClientForNotes(null)}
                className="px-4 py-2 border border-[#d4af67]/30 text-[#a89b88] text-xs rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateNotes}
                className="px-4 py-2 bg-[#d4af67] text-[#0b0a08] text-xs font-black rounded cursor-pointer uppercase"
              >
                Actualizar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VENTA DE MOSTRADOR (CREMAS) */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12100d] border border-[#d4af67]/40 rounded-xl p-6 shadow-2xl">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7] mb-2">
              Registrar Venta de Mostrador
            </h3>
            <p className="text-xs text-[#a89b88] mb-4">
              Cobra una crema, cera o pomada directamente en el local y descuenta del stock.
            </p>
            <form onSubmit={handleRecordSale} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#d4af67] font-bold uppercase mb-1">Producto</label>
                <select
                  value={saleProductId}
                  onChange={e => setSaleProductId(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none"
                >
                  {inventory.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ($ {p.price.toLocaleString('es-AR')}) - Stock: {p.stock}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d4af67] font-bold uppercase mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={saleQty}
                    onChange={e => setSaleQty(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block text-[#d4af67] font-bold uppercase mb-1">Cliente (Opcional)</label>
                  <input
                    type="text"
                    value={saleCustomerName}
                    onChange={e => setSaleCustomerName(e.target.value)}
                    placeholder="Cliente mostrador"
                    className="w-full p-2.5 bg-[#0a0907] border border-[#d4af67]/30 rounded text-[#f5ebd7] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="px-4 py-2 border border-[#d4af67]/30 text-[#a89b88] rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d4af67] text-[#0b0a08] font-black rounded cursor-pointer uppercase"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
