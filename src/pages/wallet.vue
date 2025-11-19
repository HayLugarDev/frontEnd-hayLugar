<template>
  <section class="bg-white/10 border-white/10 p-4 md:p-8 rounded-2xl shadow-xl mb-8 w-full md:w-2/3 border border-gray-200 flex flex-col gap-6">

    <!-- Header y saldo -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="hidden text-2xl font-bold text-primary md:flex items-center gap-2">
          <font-awesome-icon icon="wallet" />
          Mi Billetera
        </h2>
        <p class="text-gray-400 mt-1">Resumen y movimientos de tu cuenta</p>
      </div>
      <div class="md:text-right">
        <span class="block text-white text-sm">Saldo actual</span>
        <span class="text-4xl font-extrabold text-[#06D6A0] tracking-tight">{{ formatARS(balance) }}</span>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="h-28 w-full bg-gray-100 animate-pulse rounded-2xl"></div>
    </div>

    <!-- KPIs rápidos -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-2xl border border-gray-200 p-4 bg-white/10 border-white/10 shadow-sm hover:shadow-md transition">
        <div class="text-sm text-gray-400">Ingresos (período)</div>
        <div class="text-xl font-semibold text-[#06D6A0]">{{ formatARS(sumIn) }}</div>
      </div>
      <div class="rounded-2xl border border-gray-200 p-4 bg-white/10 border-white/10 shadow-sm hover:shadow-md transition">
        <div class="text-sm text-gray-400">Egresos (período)</div>
        <div class="text-xl font-semibold text-red-600">{{ formatARS(Math.abs(sumOut)) }}</div>
      </div>
      <div class="rounded-2xl border border-gray-200 p-4 bg-white/10 border-white/10 shadow-sm hover:shadow-md transition">
        <div class="text-sm text-gray-400">Neto (período)</div>
        <div class="text-xl font-semibold" :class="netPeriod >= 0 ? 'text-[#06D6A0]' : 'text-red-700'">
          {{ formatARS(netPeriod) }}
        </div>
      </div>
    </div>

    <!-- Controles y filtros -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
      <div class="flex flex-wrap gap-2">
        <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition border"
          :class="activeFilter === f.value
            ? 'bg-primary text-white border-transparent'
            : 'bg-white/10 border-white/10 text-gray-200 border-gray-300 hover:bg-gray-500'">
          {{ f.label }}
        </button>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-sm text-gray-200">Período:</label>
        <select v-model="days" class="px-3 py-2 rounded-lg border border-gray-300 bg-white/10 border-white/10 text-gray-400 text-sm focus:outline-none">
          <option :value="7">Últimos 7 días</option>
          <option :value="30">Últimos 30 días</option>
          <option :value="90">Últimos 90 días</option>
        </select>
        <label class="text-sm text-gray-200">Mostrar:</label>
        <select v-model="limit" class="px-3 py-2 rounded-lg border border-gray-300 bg-white/10 border-white/10 text-gray-400 text-sm focus:outline-none">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Movimientos -->
    <div class="mt-6 space-y-2">
      <h3 class="text-xl font-semibold text-primary mb-2">Movimientos</h3>
      <div v-if="filteredTx.length === 0" class="p-6 text-center text-gray-400 rounded-2xl border bg-white/10 border-white/10">
        Sin movimientos para los filtros seleccionados
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/10 border-white/10">
              <th class="p-3 text-sm font-semibold text-gray-400">Fecha</th>
              <th class="p-3 text-sm font-semibold text-gray-400">Tipo</th>
              <th class="p-3 text-sm font-semibold text-gray-400">Descripción</th>
              <!-- <th class="p-3 text-sm font-semibold text-gray-400">Ref</th> -->
              <th class="p-3 text-sm font-semibold text-gray-400 text-right">Monto</th>
              <th class="p-3 text-sm font-semibold text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filteredTx" :key="tx.id || tx.reference_id || tx.created_at" class="border-b hover:bg-gray-50 transition">
              <td class="p-3 whitespace-nowrap text-sm">{{ formatDate(txDate(tx)) }}</td>
              <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="badgeClass(tx.transaction_type)">
                  {{ typeLabel(tx.transaction_type) }}
                </span>
              </td>
              <td class="p-3 text-gray-700">{{ tx.description || '—' }}</td>
              <!-- <td class="p-3 text-gray-500">{{ tx.reference_id || '—' }}</td> -->
              <td class="p-3 text-right font-semibold" :class="tx.amount >= 0 ? 'text-[#06D6A0]' : 'text-red-600'">
                {{ signedARS(tx.amount) }}
              </td>
              <td class="p-3 capitalize">
                <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(tx.status)">
                  {{ tx.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden space-y-3">
        <div v-for="tx in filteredTx" :key="tx.id || tx.reference_id || tx.created_at"
          class="border border-gray-200 rounded-2xl p-4 bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-md transition">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="text-sm text-gray-500">{{ formatDate(txDate(tx)) }}</div>
              <div>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="badgeClass(tx.transaction_type)">
                  {{ typeLabel(tx.transaction_type) }}
                </span>
              </div>
              <div class="text-sm text-gray-700">{{ tx.description || '—' }}</div>
              <!-- <div class="text-xs text-gray-400 font-mono">{{ tx.reference_id || '' }}</div> -->
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold" :class="tx.amount >= 0 ? 'text-[#06D6A0]' : 'text-red-600'">
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
      </div>

      <!-- Retiro de fondos -->
      <button @click="withdrawFunds"
        class="w-full md:w-auto mt-4 flex items-center justify-center bg-[#06D6A0]/20 text-white px-4 py-2 rounded-2xl shadow hover:shadow-lg transition">
        <font-awesome-icon icon="arrow-down" class="mr-2" /> Retirar fondos
      </button>

      <!-- Leyenda -->
      <p class="mt-4 text-xs text-gray-500">
        * “Pago de reserva” acredita el neto recibido (descontadas tarifas del procesador).<br>
        “Comisión plataforma” refleja el cargo de servicio cuando aplica.<br>
        Los importes positivos suman a tu saldo; los negativos lo descuentan.
      </p>
    </div>

    <!-- Modal de retiro -->
    <WithdrawModal
      ref="modalRef"
      v-model="showWithdraw"
      :summary="summary"
      :accounts="payoutAccounts"
      :min-withdraw="1000"
      @submitted="onModalSubmitted"
      @open-accounts="$router.push({ name: 'payout-accounts' })"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '../store/userStore'
import api from '../services/apiService'
import loadIcon from '../assets/load-icon_primary.svg'
import WithdrawModal from '../components/WithdrawModal.vue'
import { showToast } from '../utils/toast'

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
    showToast('Solicitud de retiro enviada', 'success');
  } catch (e: any) {
    console.error('Error solicitando retiro', e)
    showToast(e?.response?.data?.message || 'Error solicitando retiro', 'error');
  }
}
</script>

<style scoped>
section {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>