<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3 flex flex-col gap-4">
    <!-- Loader -->
    <div class="min-h-screen flex items-center justify-center" v-if="loading">
      <img :src="loadIcon" alt="Cargando..." class="w-16 h-16 animate-spin" />
    </div>

    <div class="p-4 border-b">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 class="text-2xl font-semibold text-primary flex items-center gap-2">
            <font-awesome-icon icon="wallet" />
            Mi Billetera
          </h2>
          <p class="text-gray-500 mt-1">Resumen y movimientos de tu cuenta</p>
        </div>

        <div class="text-right">
          <span class="block text-gray-500 text-sm">Saldo actual</span>
          <span class="text-4xl font-extrabold text-green-600 tracking-tight">
            {{ formatARS(balance) }}
          </span>
        </div>
      </div>

      <!-- Controles -->
      <div class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition border" :class="activeFilter === f.value
              ? 'bg-primary text-white border-transparent'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'">
            {{ f.label }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Período:</label>
          <select v-model="days"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none">
            <option :value="7">Últimos 7 días</option>
            <option :value="30">Últimos 30 días</option>
            <option :value="90">Últimos 90 días</option>
          </select>

          <label class="text-sm text-gray-600">Mostrar:</label>
          <select v-model="limit"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- KPIs rápidos -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <div class="text-sm text-gray-500">Ingresos (período)</div>
          <div class="text-xl font-semibold text-green-600">
            {{ formatARS(sumIn) }}
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <div class="text-sm text-gray-500">Egresos (período)</div>
          <div class="text-xl font-semibold text-red-600">
            {{ formatARS(Math.abs(sumOut)) }}
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <div class="text-sm text-gray-500">Neto (período)</div>
          <div class="text-xl font-semibold" :class="netPeriod >= 0 ? 'text-green-700' : 'text-red-700'">
            {{ formatARS(netPeriod) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Movimientos -->
    <div class="mx-auto max-w-6xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-primary">Movimientos</h3>

        <button @click="withdrawFunds"
          class="hidden md:flex items-center bg-accent text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition">
          <font-awesome-icon icon="arrow-down" class="mr-2" />
          Retirar fondos
        </button>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 text-sm font-semibold text-gray-600">Fecha</th>
              <th class="p-3 text-sm font-semibold text-gray-600">Tipo</th>
              <th class="p-3 text-sm font-semibold text-gray-600">Descripción</th>
              <th class="p-3 text-sm font-semibold text-gray-600">Ref</th>
              <th class="p-3 text-sm font-semibold text-gray-600 text-right">Monto</th>
              <th class="p-3 text-sm font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filteredTx" :key="tx.id || tx.reference_id || tx.created_at"
              class="border-b hover:bg-gray-50 transition">
              <td class="p-3 whitespace-nowrap">{{ formatDate(txDate(tx)) }}</td>
              <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="badgeClass(tx.transaction_type)">
                  {{ typeLabel(tx.transaction_type) }}
                </span>
              </td>
              <td class="p-3 text-gray-700">
                <span v-if="tx.description">{{ tx.description }}</span>
                <span v-else class="text-gray-400 italic">—</span>
              </td>
              <td class="p-3 text-gray-500">
                <span v-if="tx.reference_id" class="font-mono text-xs">{{ tx.reference_id }}</span>
                <span v-else class="text-gray-400 italic">—</span>
              </td>
              <td class="p-3 text-right font-semibold" :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ signedARS(tx.amount) }}
              </td>
              <td class="p-3 capitalize">
                <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(tx.status)">
                  {{ tx.status }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredTx.length === 0">
              <td colspan="6" class="p-6 text-center text-gray-500">
                Sin movimientos para los filtros seleccionados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden space-y-3">
        <div v-for="tx in filteredTx" :key="tx.id || tx.reference_id || tx.created_at"
          class="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="text-sm text-gray-500">{{ formatDate(txDate(tx)) }}</div>
              <div>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="badgeClass(tx.transaction_type)">
                  {{ typeLabel(tx.transaction_type) }}
                </span>
              </div>
              <div class="text-sm text-gray-700" v-if="tx.description">
                {{ tx.description }}
              </div>
              <div class="text-xs text-gray-400 font-mono" v-if="tx.reference_id">
                Ref: {{ tx.reference_id }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold" :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ signedARS(tx.amount) }}
              </div>
              <div class="mt-1">
                <span class="px-2 py-0.5 rounded text-xs font-medium capitalize" :class="statusClass(tx.status)">
                  {{ tx.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredTx.length === 0" class="p-6 text-center text-gray-500">
          Sin movimientos para los filtros seleccionados
        </div>

        <button @click="withdrawFunds"
          class="w-full mt-2 flex md:hidden items-center justify-center bg-accent text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition">
          <font-awesome-icon icon="arrow-down" class="mr-2" />
          Retirar fondos
        </button>
      </div>

      <!-- Leyenda -->
      <div class="mt-6 text-xs text-gray-500">
        <p>
          * “Pago de reserva” acredita el neto recibido (descontadas tarifas del procesador).
          “Comisión plataforma” refleja el cargo de servicio cuando aplica.
          Los importes positivos suman a tu saldo; los negativos lo descuentan.
        </p>
      </div>
    </div>

    <!-- Modal de retiro -->
    <WithdrawModal ref="modalRef" v-model="showWithdraw" :summary="summary" :accounts="payoutAccounts"
      :min-withdraw="1000" @submitted="onModalSubmitted" @open-accounts="$router.push({ name: 'payout-accounts' })" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '../store/userStore'
import api from '../services/apiService'
import loadIcon from '../assets/load-icon_primary.svg'
import WithdrawModal from '../components/WithdrawModal.vue'

const userStore = useUserStore()

/* ===== estado principal ===== */
const balance = ref<number>(0)

type Tx = {
  meta: any
  id?: number
  transaction_type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'platform_fee' | string
  amount: number
  status: 'pending' | 'completed' | 'failed' | string
  created_at?: string
  createdAt?: string
  description?: string | null
  reference_id?: string | null
}
const transactions = ref<Tx[]>([])

/* filtros UI */
const limit = ref<number>(25)
const days = ref<number>(30)
type FilterType = 'all' | 'in' | 'out'
const activeFilter = ref<FilterType>('all')

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Entradas', value: 'in' },
  { label: 'Salidas', value: 'out' },
]

const loading = computed(() => userStore.loading)

/* ===== helpers de formato ===== */
const fmtARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
function formatARS(v: number) { return fmtARS.format(Number(v || 0)) }
function signedARS(v: number) {
  const s = Number(v || 0)
  return (s >= 0 ? '+' : '−') + fmtARS.format(Math.abs(s))
}
function formatDate(dateStr: string | number | Date) {
  const d = new Date(dateStr)
  return isNaN(+d) ? '—' : d.toLocaleString()
}
function txDate(tx: Tx): string {
  return (tx.created_at || tx.createdAt || tx.meta?.date || '')
}

/* badges */
function badgeClass(t: string) {
  switch (t) {
    case 'payment': return 'bg-green-100 text-green-700'
    case 'deposit': return 'bg-blue-100 text-blue-700'
    case 'withdrawal': return 'bg-amber-100 text-amber-700'
    case 'refund': return 'bg-purple-100 text-purple-700'
    case 'platform_fee': return 'bg-rose-100 text-rose-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
function typeLabel(t: string) {
  switch (t) {
    case 'payment': return 'Pago de reserva'
    case 'deposit': return 'Depósito'
    case 'withdrawal': return 'Retiro'
    case 'refund': return 'Reintegro'
    case 'platform_fee': return 'Comisión plataforma'
    default: return t
  }
}
function statusClass(s: string) {
  switch (s) {
    case 'completed': return 'bg-green-100 text-green-700'
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    case 'failed': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

/* ===== carga de datos ===== */
let loggedOnce = false
function normalizeTxPayload(payload: any): Tx[] {
  if (Array.isArray(payload)) return payload as Tx[]
  if (payload && Array.isArray(payload.rows)) return payload.rows as Tx[]
  if (payload && Array.isArray(payload.data)) return payload.data as Tx[]
  if (payload && Array.isArray(payload.items)) return payload.items as Tx[]
  return []
}

async function loadWallet() {
  if (!userStore.user) {
    await userStore.fetchUser()
  }
  const userId = userStore.user?.id
  if (!userId) return

  // balance con anti-cache
  try {
    const resBal = await api.get(`/wallet/${userId}/balance`, {
      params: { _: Date.now() },
      headers: { 'Cache-Control': 'no-cache' }
    })
    balance.value = Number(resBal.data?.balance ?? 0)
  } catch (e) {
    console.error('Error al cargar balance', e)
  }

  // transacciones con anti-cache
  try {
    const resTx = await api.get(`/wallet/${userId}/transactions`, {
      params: { limit: limit.value, days: days.value, _: Date.now() },
      headers: { 'Cache-Control': 'no-cache' }
    })
    const list = normalizeTxPayload(resTx.data)
    if (!loggedOnce) {
      loggedOnce = true
      // console.log('TX raw payload ->', resTx.data)
    }
    transactions.value = list.map(t => ({
      ...t,
      amount: Number((t as any).amount ?? 0)
    }))
  } catch (e) {
    console.error('Error al cargar transacciones', e)
    transactions.value = []
  }
}

/* ===== summary & payout accounts para el modal ===== */
type Summary = { balance: number; pending_withdrawals: number; available: number }
type PayoutAccount = {
  id: number
  user_id: number
  alias_cbu: string
  bank_name?: string | null
  account_holder?: string | null
  tax_id?: string | null
  is_default: boolean
  verified_at?: string | null
  created_at?: string
  updated_at?: string
}
const summary = ref<Summary>({ balance: 0, pending_withdrawals: 0, available: 0 })
const payoutAccounts = ref<PayoutAccount[]>([])

async function loadSummaryAndAccounts() {
  if (!userStore.user) await userStore.fetchUser()
  const userId = userStore.user?.id
  if (!userId) return

  try {
    const s = await api.get(`/wallet/${userId}/summary`, {
      params: { _: Date.now() },
      headers: { 'Cache-Control': 'no-cache' }
    })
    summary.value = s.data
  } catch (e) {
    console.error('Error al cargar summary', e)
    summary.value = { balance: balance.value, pending_withdrawals: 0, available: balance.value }
  }

  try {
    const accRes = await api.get(`/payout-accounts`, {
      params: { _: Date.now() },
      headers: { 'Cache-Control': 'no-cache' }
    })
    payoutAccounts.value = Array.isArray(accRes.data) ? accRes.data : []
  } catch (e) {
    console.error('Error al cargar cuentas de cobro', e)
    payoutAccounts.value = []
  }
}

/* montar */
onMounted(async () => {
  await loadWallet()
  await loadSummaryAndAccounts()
})

/* refresca al cambiar límite o período */
watch([limit, days], async () => {
  await loadWallet()
})

/* derivados (filtro UI local) */
const filteredTx = computed(() => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days.value)

  return transactions.value
    .filter(tx => {
      const dateStr = txDate(tx)
      const d = new Date(dateStr)
      if (isNaN(+d)) return true
      return d >= cutoff
    })
    .filter(tx => {
      if (activeFilter.value === 'in') return Number(tx.amount) >= 0
      if (activeFilter.value === 'out') return Number(tx.amount) < 0
      return true
    })
})

/* KPIs */
const sumIn = computed(() => filteredTx.value.reduce((acc, t) => acc + Math.max(0, Number(t.amount || 0)), 0))
const sumOut = computed(() => filteredTx.value.reduce((acc, t) => acc + Math.min(0, Number(t.amount || 0)), 0))
const netPeriod = computed(() => sumIn.value + sumOut.value)

/* ===== modal de retiro ===== */
const showWithdraw = ref(false)
const modalRef = ref<InstanceType<typeof WithdrawModal> | null>(null)
const modalAmount = ref<number>(0)
const modalAccountId = ref<number | null>(null)
const modalNote = ref<string>('')

function withdrawFunds() {
  showWithdraw.value = true
}

/* al enviar desde el modal, leemos sus valores y pegamos POST /withdrawals */
async function onModalSubmitted() {
  try {
    // acceder al state del modal (setupState)
    // @ts-ignore
    modalAmount.value = Number(modalRef.value?.$?.setupState?.amount || 0)
    // @ts-ignore
    modalAccountId.value = Number(modalRef.value?.$?.setupState?.selectedAccountId || 0) || null
    // @ts-ignore
    modalNote.value = String(modalRef.value?.$?.setupState?.note || '')

    await api.post(`/withdrawals`, {
      amount: modalAmount.value,
      payout_account_id: modalAccountId.value,
      note: modalNote.value
    })

    showWithdraw.value = false
    // refrescar todo
    await Promise.all([loadSummaryAndAccounts(), loadWallet()])
    // opcional: toast de éxito
    // toast.success('Solicitud de retiro enviada')
  } catch (e: any) {
    console.error('Error solicitando retiro', e)
    // opcional: toast de error
    // toast.error(e?.response?.data?.message || 'Error solicitando retiro')
  }
}
</script>

<style scoped>
/* Todo el look & feel se apoya en Tailwind */
</style>
