// ── REPOSITORIO DE DATOS DEMO (ARQUITECTURA PREPARADA PARA SUPABASE) ─────────
// Este servicio desacopla completamente la lógica de base de datos de la UI.
// Cuando se configure Supabase, solo se reemplazan estas funciones internas
// por llamadas a `supabase.from('...')` sin alterar ningún componente.

export interface ClientProfile {
  id: string
  name: string
  phone: string
  email: string
  createdAt: string
  lastVisit: string
  totalVisits: number
  totalSpent: number
  hairType: string // 'Lacio Fino' | 'Ondulado Grueso' | 'Con Entradas' | 'Rizado'
  preferredBarberId?: string
  preferredBarberName?: string
  preferredStyle?: string
  notes: string // Notas técnicas del barbero
}

export interface AppointmentRecord {
  id: string
  clientId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string
  serviceName: string
  barberId: string
  barberName: string
  dateDisplay: string
  dateStr: string
  time: string
  totalPrice: number
  depositPaid: number
  status: 'PENDIENTE' | 'CONFIRMADO' | 'COMPLETADO' | 'CANCELADO'
  paymentMethod: 'mercadopago' | 'efectivo' | 'whatsapp'
  createdAt: string
}

export interface InventoryItem {
  id: string
  name: string
  category: 'Cremas & Pomadas' | 'Geles' | 'Ceras' | 'Aceites & Bálsamos'
  price: number
  costPrice: number
  stock: number
  minStockAlert: number
  hold: string
  shine: string
  description: string
  image: string
}

export interface SaleRecord {
  id: string
  clientId?: string
  clientName: string
  items: Array<{
    productId: string
    productName: string
    qty: number
    unitPrice: number
  }>
  totalAmount: number
  paymentMethod: 'efectivo' | 'mercadopago' | 'transferencia'
  dateDisplay: string
  createdAt: string
}

export interface FinancialReportSummary {
  totalServiceRevenue: number
  totalProductRevenue: number
  totalDepositsCollected: number
  completedAppointmentsCount: number
  pendingAppointmentsCount: number
  cancelledAppointmentsCount: number
  activeClientsCount: number
  averageTicket: number
  topProducts: Array<{ id: string; name: string; unitsSold: number; totalRevenue: number }>
  barberStats: Array<{ barberName: string; appointmentsCount: number; revenueGenerated: number }>
}

// ── SEED DATA INICIAL PARA EL MODO DEMO ────────────────────────────────────────

const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli_01',
    name: 'Facundo Pellegrini',
    phone: '+54 9 341 582-9912',
    email: 'facundo.p@gmail.com',
    createdAt: '2025-11-10',
    lastVisit: '2026-03-28',
    totalVisits: 8,
    totalSpent: 42500,
    hairType: 'Ondulado Grueso',
    preferredBarberName: 'Don Carlos Méndez',
    preferredStyle: 'Pompadour Noir',
    notes: 'Sensible al filo en sienes. Usar bálsamo frío sin mentol. Siempre compra Pomada Fuerte Noir.',
  },
  {
    id: 'cli_02',
    name: 'Santiago Varela',
    phone: '+54 9 341 490-1123',
    email: 'santi.varela@live.com',
    createdAt: '2025-12-04',
    lastVisit: '2026-04-02',
    totalVisits: 5,
    totalSpent: 26800,
    hairType: 'Lacio Fino con Entradas',
    preferredBarberName: 'Facundo Reyes',
    preferredStyle: 'Fade Bajo & Textura',
    notes: 'Degradé al número 1 en laterales, tijera arriba con textura mate. Prefiere Cera Mate.',
  },
  {
    id: 'cli_03',
    name: 'Matías Benítez',
    phone: '+54 9 341 612-4450',
    email: 'matias.b@techrosario.io',
    createdAt: '2026-01-15',
    lastVisit: '2026-04-08',
    totalVisits: 3,
    totalSpent: 19400,
    hairType: 'Lacio Grueso',
    preferredBarberName: 'Marcelo Giordano',
    preferredStyle: 'Slick Back Ejecutivo',
    notes: 'Raya al costado izquierda marcada a navaja. Peinado clásico con fijación húmeda.',
  },
  {
    id: 'cli_04',
    name: 'Ignacio Rossi',
    phone: '+54 9 341 789-2234',
    email: 'ignacio.rossi@outlook.com',
    createdAt: '2026-02-20',
    lastVisit: '2026-04-10',
    totalVisits: 2,
    totalSpent: 12200,
    hairType: 'Rizado Cerrado',
    preferredBarberName: 'Don Carlos Méndez',
    preferredStyle: 'Quiff Buenos Aires',
    notes: 'Acondicionar con aceite botánico antes de cortar. Corte a tijera únicamente.',
  },
]

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'pomada_noir',
    name: 'Pomada Fuerte Noir Búho',
    category: 'Cremas & Pomadas',
    price: 3200,
    costPrice: 1400,
    stock: 14,
    minStockAlert: 5,
    hold: 'Alta (5/5)',
    shine: 'Medio Noble',
    description: 'Fijación máxima a base de agua sin residuos. Aporta estructura limpia a copetes Pompadour y Undercut.',
    image: 'https://images.unsplash.com/photo-1775126250999-806ca8419dcb?w=400&h=480&fit=crop&auto=format',
  },
  {
    id: 'gel_extra_forte',
    name: 'Gel Extra Forte Efecto Húmedo',
    category: 'Geles',
    price: 2900,
    costPrice: 1100,
    stock: 9,
    minStockAlert: 4,
    hold: 'Extrema (5/5)',
    shine: 'Brillo Espejo',
    description: 'Gel concentrado con pro-vitamina B5. Brinda fijación blindada todo el día con acabado brillante espejo.',
    image: 'https://images.unsplash.com/photo-1775126251074-cd5f4cfdf7c9?w=400&h=480&fit=crop&auto=format',
  },
  {
    id: 'cera_mate',
    name: 'Cera Mate Rioplatense',
    category: 'Ceras',
    price: 2700,
    costPrice: 1200,
    stock: 3, // alerta bajo stock
    minStockAlert: 5,
    hold: 'Media-Alta (4/5)',
    shine: 'Mate Total (0/5)',
    description: 'Acabado 100% mate sin sensación grasosa. Aporta volumen natural y textura remoldeable para Quiff y Fade.',
    image: 'https://images.unsplash.com/photo-1638383257225-f810a62c634e?w=400&h=480&fit=crop&auto=format',
  },
  {
    id: 'crema_peinar',
    name: 'Crema de Peinado Brillantina Classic',
    category: 'Cremas & Pomadas',
    price: 2800,
    costPrice: 1300,
    stock: 11,
    minStockAlert: 4,
    hold: 'Media Flexible (3/5)',
    shine: 'Brillo Tradicional',
    description: 'La fórmula original rosarina de 1947. Suaviza la fibra capilar, controla el frizz del río Paraná y facilita la raya lateral.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=480&fit=crop&auto=format',
  },
  {
    id: 'aceite_imperial',
    name: 'Aceite Nutritivo Capilar & Barba',
    category: 'Aceites & Bálsamos',
    price: 3800,
    costPrice: 1600,
    stock: 2, // alerta bajo stock
    minStockAlert: 4,
    hold: 'Nutrición / Ligero',
    shine: 'Luminosidad Natural',
    description: 'Blend botánico de argán, jojoba y madera de cedro. Nutre el cabello seco, aporta sedosidad y perfuma.',
    image: 'https://images.unsplash.com/photo-1776843448493-eb35a803489b?w=400&h=480&fit=crop&auto=format',
  },
  {
    id: 'gel_fluido',
    name: 'Gel Fluido Moldeador Ligero',
    category: 'Geles',
    price: 2500,
    costPrice: 950,
    stock: 8,
    minStockAlert: 3,
    hold: 'Media (3/5)',
    shine: 'Satinado',
    description: 'Gel ligero sin alcohol de secado rápido. Ideal para peinados casuales con movimiento y flexibilidad.',
    image: 'https://images.unsplash.com/photo-1638383257653-4217e9161b11?w=400&h=480&fit=crop&auto=format',
  },
]

const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'vnt_101',
    clientId: 'cli_01',
    clientName: 'Facundo Pellegrini',
    items: [{ productId: 'pomada_noir', productName: 'Pomada Fuerte Noir Búho', qty: 1, unitPrice: 3200 }],
    totalAmount: 3200,
    paymentMethod: 'mercadopago',
    dateDisplay: 'Hoy 11:30 hs',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vnt_102',
    clientId: 'cli_02',
    clientName: 'Santiago Varela',
    items: [
      { productId: 'cera_mate', productName: 'Cera Mate Rioplatense', qty: 1, unitPrice: 2700 },
      { productId: 'aceite_imperial', productName: 'Aceite Nutritivo Capilar & Barba', qty: 1, unitPrice: 3800 },
    ],
    totalAmount: 6500,
    paymentMethod: 'efectivo',
    dateDisplay: 'Ayer 17:45 hs',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'vnt_103',
    clientName: 'Cliente Mostrador Particular',
    items: [{ productId: 'crema_peinar', productName: 'Crema de Peinado Brillantina Classic', qty: 2, unitPrice: 2800 }],
    totalAmount: 5600,
    paymentMethod: 'efectivo',
    dateDisplay: 'Ayer 15:10 hs',
    createdAt: new Date(Date.now() - 90000000).toISOString(),
  },
]

// ── CAPA DE PERSISTENCIA LOCAL / SUPABASE READY ──────────────────────────────

const KEYS = {
  CLIENTS: 'pelu_db_clients_v2',
  APPOINTMENTS: 'pelu_db_appointments_v2',
  INVENTORY: 'pelu_db_inventory_v2',
  SALES: 'pelu_db_sales_v2',
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`[DB Layer] Error saving key ${key}:`, err)
  }
}

export const dbService = {
  // ── CLIENTS CRUD (Supabase: supabase.from('clients')) ──────────────────────
  clients: {
    getAll: async (): Promise<ClientProfile[]> => {
      // NOTE: En Supabase: const { data } = await supabase.from('clients').select('*').order('name')
      return loadStorage<ClientProfile[]>(KEYS.CLIENTS, INITIAL_CLIENTS)
    },

    getById: async (id: string): Promise<ClientProfile | null> => {
      const list = await dbService.clients.getAll()
      return list.find(c => c.id === id) || null
    },

    create: async (profile: Omit<ClientProfile, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>): Promise<ClientProfile> => {
      const list = await dbService.clients.getAll()
      const newClient: ClientProfile = {
        ...profile,
        id: `cli_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString().split('T')[0],
        totalVisits: 1,
        totalSpent: 0,
      }
      const updated = [newClient, ...list]
      saveStorage(KEYS.CLIENTS, updated)
      return newClient
    },

    update: async (id: string, updates: Partial<ClientProfile>): Promise<ClientProfile> => {
      const list = await dbService.clients.getAll()
      const idx = list.findIndex(c => c.id === id)
      if (idx === -1) throw new Error(`Cliente ${id} no encontrado`)
      const updatedItem = { ...list[idx], ...updates }
      list[idx] = updatedItem
      saveStorage(KEYS.CLIENTS, list)
      return updatedItem
    },

    delete: async (id: string): Promise<void> => {
      const list = await dbService.clients.getAll()
      saveStorage(KEYS.CLIENTS, list.filter(c => c.id !== id))
    },
  },

  // ── APPOINTMENTS (Supabase: supabase.from('appointments')) ─────────────────
  appointments: {
    getAll: async (): Promise<AppointmentRecord[]> => {
      // Enlazamos también las reservas previas guardadas en localStorage para compatibilidad
      const legacyRaw = localStorage.getItem('peluqueria_brian_reservations')
      let legacyAppointments: AppointmentRecord[] = []
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw)
          legacyAppointments = parsedLegacy.map((r: any) => ({
            id: r.id,
            clientId: r.customerId || 'cli_01',
            customerName: r.customerName || 'Cliente Particular',
            customerPhone: r.customerPhone || '',
            customerEmail: r.customerEmail || '',
            serviceId: r.serviceId || 's1',
            serviceName: r.serviceName,
            barberId: r.barberId || 'carlos',
            barberName: r.barberName,
            dateDisplay: r.dateDisplay,
            dateStr: r.dateStr || '2026-04-12',
            time: r.time,
            totalPrice: r.totalPrice,
            depositPaid: r.depositPaid,
            status: 'CONFIRMADO' as const,
            paymentMethod: r.paymentMethod || 'mercadopago',
            createdAt: new Date().toISOString(),
          }))
        } catch {}
      }

      const current = loadStorage<AppointmentRecord[]>(KEYS.APPOINTMENTS, [])
      if (current.length === 0 && legacyAppointments.length > 0) {
        saveStorage(KEYS.APPOINTMENTS, legacyAppointments)
        return legacyAppointments
      }
      return current
    },

    create: async (record: Omit<AppointmentRecord, 'id' | 'createdAt'>): Promise<AppointmentRecord> => {
      const list = await dbService.appointments.getAll()
      const newRecord: AppointmentRecord = {
        ...record,
        id: `AP-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      }
      const updated = [newRecord, ...list]
      saveStorage(KEYS.APPOINTMENTS, updated)

      // Actualizar automáticamente visitas y gasto del cliente si existe
      try {
        const clients = await dbService.clients.getAll()
        const client = clients.find(c => c.phone === record.customerPhone || c.name.toLowerCase() === record.customerName.toLowerCase())
        if (client) {
          await dbService.clients.update(client.id, {
            totalVisits: client.totalVisits + 1,
            totalSpent: client.totalSpent + record.totalPrice,
            lastVisit: record.dateDisplay,
            preferredBarberName: record.barberName,
          })
        }
      } catch (e) {
        console.warn('[DB] Could not sync client record:', e)
      }

      return newRecord
    },

    updateStatus: async (id: string, newStatus: AppointmentRecord['status']): Promise<void> => {
      const list = await dbService.appointments.getAll()
      const updated = list.map(a => a.id === id ? { ...a, status: newStatus } : a)
      saveStorage(KEYS.APPOINTMENTS, updated)
    },

    delete: async (id: string): Promise<void> => {
      const list = await dbService.appointments.getAll()
      saveStorage(KEYS.APPOINTMENTS, list.filter(a => a.id !== id))
    },
  },

  // ── INVENTORY & CREAMS (Supabase: supabase.from('products')) ───────────────
  inventory: {
    getAll: async (): Promise<InventoryItem[]> => {
      return loadStorage<InventoryItem[]>(KEYS.INVENTORY, INITIAL_INVENTORY)
    },

    updateStock: async (id: string, delta: number): Promise<InventoryItem> => {
      const list = await dbService.inventory.getAll()
      const idx = list.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Producto no encontrado')
      const updatedItem = { ...list[idx], stock: Math.max(0, list[idx].stock + delta) }
      list[idx] = updatedItem
      saveStorage(KEYS.INVENTORY, list)
      return updatedItem
    },

    setStock: async (id: string, exactStock: number): Promise<InventoryItem> => {
      const list = await dbService.inventory.getAll()
      const idx = list.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Producto no encontrado')
      const updatedItem = { ...list[idx], stock: Math.max(0, exactStock) }
      list[idx] = updatedItem
      saveStorage(KEYS.INVENTORY, list)
      return updatedItem
    },
  },

  // ── SALES / BOUTIQUE RECEIPTS (Supabase: supabase.from('sales')) ───────────
  sales: {
    getAll: async (): Promise<SaleRecord[]> => {
      return loadStorage<SaleRecord[]>(KEYS.SALES, INITIAL_SALES)
    },

    create: async (sale: Omit<SaleRecord, 'id' | 'createdAt'>): Promise<SaleRecord> => {
      const list = await dbService.sales.getAll()
      const newSale: SaleRecord = {
        ...sale,
        id: `vnt_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      }
      // Deducir stock del inventario
      for (const it of sale.items) {
        try {
          await dbService.inventory.updateStock(it.productId, -it.qty)
        } catch {}
      }
      const updated = [newSale, ...list]
      saveStorage(KEYS.SALES, updated)
      return newSale
    },
  },

  // ── BUSINESS INTELLIGENCE & FINANCIAL REPORTS ─────────────────────────────
  reports: {
    getSummary: async (): Promise<FinancialReportSummary> => {
      const appointments = await dbService.appointments.getAll()
      const sales = await dbService.sales.getAll()
      const clients = await dbService.clients.getAll()

      const completed = appointments.filter(a => a.status === 'COMPLETADO' || a.status === 'CONFIRMADO')
      const totalServiceRevenue = completed.reduce((sum, a) => sum + a.totalPrice, 0)
      const totalDepositsCollected = appointments
        .filter(a => a.status !== 'CANCELADO')
        .reduce((sum, a) => sum + a.depositPaid, 0)

      const totalProductRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0)

      // Top productos vendidos
      const productMap: Record<string, { name: string; units: number; revenue: number }> = {}
      for (const sale of sales) {
        for (const it of sale.items) {
          if (!productMap[it.productId]) {
            productMap[it.productId] = { name: it.productName, units: 0, revenue: 0 }
          }
          productMap[it.productId].units += it.qty
          productMap[it.productId].revenue += it.unitPrice * it.qty
        }
      }

      const topProducts = Object.entries(productMap)
        .map(([id, val]) => ({ id, name: val.name, unitsSold: val.units, totalRevenue: val.revenue }))
        .sort((a, b) => b.unitsSold - a.unitsSold)

      // Barber Stats
      const barberMap: Record<string, { count: number; rev: number }> = {}
      for (const apt of completed) {
        const b = apt.barberName || 'Sin asignar'
        if (!barberMap[b]) barberMap[b] = { count: 0, rev: 0 }
        barberMap[b].count += 1
        barberMap[b].rev += apt.totalPrice
      }

      const barberStats = Object.entries(barberMap).map(([barberName, d]) => ({
        barberName,
        appointmentsCount: d.count,
        revenueGenerated: d.rev,
      }))

      const totalTx = completed.length + sales.length
      const grandTotal = totalServiceRevenue + totalProductRevenue
      const averageTicket = totalTx > 0 ? Math.round(grandTotal / totalTx) : 0

      return {
        totalServiceRevenue,
        totalProductRevenue,
        totalDepositsCollected,
        completedAppointmentsCount: completed.length,
        pendingAppointmentsCount: appointments.filter(a => a.status === 'PENDIENTE').length,
        cancelledAppointmentsCount: appointments.filter(a => a.status === 'CANCELADO').length,
        activeClientsCount: clients.length,
        averageTicket,
        topProducts,
        barberStats,
      }
    },

    exportAppointmentsCsv: async (): Promise<string> => {
      const appointments = await dbService.appointments.getAll()
      const headers = ['VOUCHER', 'CLIENTE', 'TELEFONO', 'SERVICIO', 'BARBERO', 'FECHA', 'HORA', 'TOTAL', 'SEÑA', 'ESTADO']
      const rows = appointments.map(a => [
        a.id,
        `"${a.customerName.replace(/"/g, '""')}"`,
        `"${a.customerPhone}"`,
        `"${a.serviceName.replace(/"/g, '""')}"`,
        `"${a.barberName.replace(/"/g, '""')}"`,
        a.dateDisplay,
        a.time,
        a.totalPrice,
        a.depositPaid,
        a.status,
      ])
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    },
  },
}
