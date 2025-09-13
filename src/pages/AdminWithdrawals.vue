<template>
  <div class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
    <div class="md:p-10 mx-auto max-w-7xl">
      <!-- Header / filtros -->
      <section class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 class="text-2xl font-semibold text-primary flex items-center gap-2">
              <font-awesome-icon icon="money-check-alt" />
              Retiros (admin)
            </h2>
            <p class="text-gray-500 mt-1">Revisa y gestiona solicitudes de retiro.</p>
          </div>

          <div class="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
            <input
              v-model.trim="q"
              type="text"
              placeholder="Buscar por ID de retiro / usuario / ref"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none w-full"
            />

            <select
              v-model="status"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm w-full"
            >
              <option value="">Todos los estados</option>
              <option value="requested">Pendientes</option>
              <option value="under_review">En revisión</option>
              <option value="approved">Aprobados</option>
              <option value="scheduled">Programados</option>
              <option value="processing">Procesando</option>
              <option value="paid">Pagados</option>
              <option value="rejected">Rechazados</option>
              <option value="failed">Fallidos</option>
              <option value="canceled">Cancelados</option>
            </select>

            <input
              v-model="from"
              type="date"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm w-full"
            />
            <input
              v-model="to"
              type="date"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm w-full"
            />

            <select
              v-model.number="limit"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm w-full"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>

            <button
              @click="load()"
              class="px-4 py-2 rounded-lg bg-primary text-white shadow hover:shadow-md transition"
              :disabled="loading"
            >
              {{ loading ? 'Cargando…' : 'Aplicar' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Tabla -->
      <section class="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-primary">Solicitudes</h3>
          <div class="text-sm text-gray-500" v-if="total">Total: {{ total }}</div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="p-3 text-sm font-semibold text-gray-600">#</th>
                <th class="p-3 text-sm font-semibold text-gray-600">Usuario</th>
                <th class="p-3 text-sm font-semibold text-gray-600">Fecha</th>
                <th class="p-3 text-sm font-semibold text-gray-600">Cuenta</th>
                <th class="p-3 text-sm font-semibold text-gray-600 text-right">Monto</th>
                <th class="p-3 text-sm font-semibold text-gray-600">Estado</th>
                <th class="p-3 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in rows" :key="w.id" class="border-b hover:bg-gray-50">
                <td class="p-3 font-mono text-xs">{{ w.id }}</td>
                <td class="p-3">
                  <div class="text-sm text-gray-900">
                    {{ w.user?.name || w.user_id }}
                  </div>
                  <div class="text-xs text-gray-500 truncate" v-if="w.user?.email">{{ w.user.email }}</div>
                </td>
                <td class="p-3 whitespace-nowrap text-sm text-gray-700">
                  {{ fmtDate(w.created_at || w.requested_at) }}
                </td>
                <td class="p-3 text-sm text-gray-700 max-w-[260px]">
                  <div v-if="w.payout_account">
                    <div class="font-medium">
                      {{ w.payout_account.alias_cbu || '—' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ w.payout_account.bank_name || 'Banco' }} •
                      {{ w.payout_account.account_holder || 'Titular' }}
                    </div>
                    <div class="font-mono text-xs text-gray-500 truncate">
                      {{ maskCbu(w.payout_account.alias_cbu || '') }}
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-500">
                    ID cuenta: {{ w.payout_account_id || '—' }}
                  </div>
                </td>
                <td class="p-3 text-right font-semibold">
                  <span :class="w.status === 'rejected' ? 'text-gray-500' : 'text-gray-900'">
                    {{ fmtARS(w.amount) }}
                    <span class="text-xs text-gray-400">{{ w.currency || 'ARS' }}</span>
                  </span>
                </td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(w.status)">
                    {{ statusLabel(w.status) }}
                  </span>
                </td>
                <td class="p-3">
                  <!-- Acciones condicionadas por estado -->
                  <div class="flex items-center gap-2">
                    <!-- Estados finales: solo Ver detalle -->
                    <template v-if="isFinalStatus(w.status)">
                      <button
                        class="px-3 py-1.5 rounded-lg border text-sm border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        @click="openView(w)"
                      >
                        Ver detalle
                      </button>
                    </template>

                    <!-- Flujos activos -->
                    <template v-else>
                      <button
                        class="px-3 py-1.5 rounded-lg border text-sm border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                        :disabled="loadingId === w.id || !canApprove(w.status)"
                        @click="approve(w)"
                      >
                        Aprobar
                      </button>

                      <button
                        class="px-3 py-1.5 rounded-lg border text-sm border-primary text-primary hover:bg-primary hover:text-white transition"
                        :disabled="loadingId === w.id || !canPay(w.status)"
                        @click="openPayIfAllowed(w)"
                      >
                        Pagar
                      </button>

                      <button
                        class="px-3 py-1.5 rounded-lg border text-sm border-rose-300 text-rose-600 hover:bg-rose-50 transition"
                        :disabled="loadingId === w.id || !canReject(w.status)"
                        @click="openReject(w)"
                      >
                        Rechazar
                      </button>

                      <button
                        class="px-3 py-1.5 rounded-lg border text-sm border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        @click="openView(w)"
                      >
                        Ver detalle
                      </button>
                    </template>
                  </div>
                </td>
              </tr>

              <tr v-if="!rows.length && !loading">
                <td colspan="7" class="p-6 text-center text-gray-500">
                  No hay resultados para los filtros seleccionados
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginado -->
        <div class="mt-4 flex flex-col lg:flex-row items-center justify-between w-full">
          <div class="text-xs text-gray-500">Mostrando {{ rows.length }} / {{ total }}</div>
          <div class="flex flex-row items-center justify-between gap-2 w-full">
            <button class="px-3 py-1.5 rounded-lg border" :disabled="page <= 1 || loading" @click="prev()">
              Anterior
            </button>
            <div class="text-sm">Página {{ page }}</div>
            <button class="px-3 py-1.5 rounded-lg border" :disabled="rows.length < limit || loading" @click="next()">
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal Pagar -->
    <div v-if="showPay" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closePay()"></div>
      <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-[95%] md:w-[560px] p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-primary">Pagar retiro #{{ current?.id }}</h3>
          <button @click="closePay" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div class="space-y-3">
          <div class="text-sm text-gray-700">
            Monto: <strong>{{ fmtARS(current?.amount || 0) }}</strong>
            <span class="text-xs text-gray-500">{{ current?.currency || 'ARS' }}</span>
          </div>
          <div class="text-sm text-gray-700">
            Estado: <strong>{{ statusLabel(current?.status || '') }}</strong>
          </div>
          <div class="text-sm text-gray-700">
            Cuenta:
            <span class="font-mono">
              {{ current?.payout_account?.alias_cbu || current?.payout_account_id }}
            </span>
          </div>

          <label class="block text-sm text-gray-600 mt-2">Referencia/comprobante</label>
          <input
            v-model.trim="payRef"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-gray-300"
            placeholder="Ej. TRF-000123"
          />

          <label class="block text-sm text-gray-600 mt-2">Nota interna (opcional)</label>
          <textarea
            v-model.trim="payNote"
            rows="2"
            class="w-full px-3 py-2 rounded-lg border border-gray-300"
          />

          <div class="mt-4 flex items-center justify-end gap-2">
            <button class="px-4 py-2 rounded-lg border border-gray-300" @click="closePay">Cancelar</button>
            <button
              class="px-4 py-2 rounded-lg bg-primary text-white shadow hover:shadow-md transition disabled:opacity-60"
              :disabled="!payRef || loadingId === current?.id"
              @click="markPaid()"
            >
              Confirmar pago
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Rechazar -->
    <div v-if="showReject" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeReject()"></div>
      <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-[95%] md:w-[560px] p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-rose-600">Rechazar retiro #{{ current?.id }}</h3>
          <button @click="closeReject" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <label class="block text-sm text-gray-600">Motivo</label>
        <textarea
          v-model.trim="rejectReason"
          rows="3"
          class="w-full px-3 py-2 rounded-lg border border-gray-300"
          placeholder="Explicá el motivo…"
        />
        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="px-4 py-2 rounded-lg border border-gray-300" @click="closeReject">Cancelar</button>
          <button
            class="px-4 py-2 rounded-lg bg-rose-600 text-white shadow hover:shadow-md transition disabled:opacity-60"
            :disabled="!rejectReason || loadingId === current?.id"
            @click="reject()"
          >
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Ver detalle (solo lectura) -->
    <div v-if="showView" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeView()"></div>
      <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-[95%] md:w-[640px] p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-primary">Detalle retiro #{{ current?.id }}</h3>
          <button @click="closeView" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div class="space-y-2 text-sm">
          <div><span class="text-gray-500">Usuario:</span> {{ current?.user?.name || current?.user_id }}</div>
          <div><span class="text-gray-500">Email:</span> {{ current?.user?.email || '—' }}</div>
          <div><span class="text-gray-500">Fecha:</span> {{ fmtDate(current?.created_at || current?.requested_at) }}</div>
          <div>
            <span class="text-gray-500">Estado:</span>
            <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(current?.status || '')">
              {{ statusLabel(current?.status || '') }}
            </span>
          </div>
          <div>
            <span class="text-gray-500">Cuenta:</span>
            <div class="mt-1">
              <div class="font-medium">
                {{ current?.payout_account?.alias_cbu || current?.payout_account_id || '—' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ current?.payout_account?.bank_name || 'Banco' }} •
                {{ current?.payout_account?.account_holder || 'Titular' }}
              </div>
              <div class="font-mono text-xs text-gray-500 truncate">
                {{ maskCbu(current?.payout_account?.alias_cbu || '') }}
              </div>
            </div>
          </div>
          <div><span class="text-gray-500">Monto:</span> {{ fmtARS(current?.amount || 0) }} {{ current?.currency || 'ARS' }}</div>
          <div v-if="current?.admin_note"><span class="text-gray-500">Nota admin:</span> {{ current?.admin_note }}</div>
          <div v-if="current?.payout_ref"><span class="text-gray-500">Referencia/comprobante:</span> <span class="font-mono">{{ current?.payout_ref }}</span></div>
          <div v-if="current?.requested_at"><span class="text-gray-500">Solicitado:</span> {{ fmtDate(current?.requested_at) }}</div>
          <div v-if="current?.reviewed_at"><span class="text-gray-500">Revisado:</span> {{ fmtDate(current?.reviewed_at) }}</div>
          <div v-if="current?.processed_at"><span class="text-gray-500">Pagado:</span> {{ fmtDate(current?.processed_at) }}</div>
        </div>

        <div class="mt-4 flex items-center justify-end">
          <button class="px-4 py-2 rounded-lg border border-gray-300" @click="closeView">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '../services/apiService'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Withdrawal = {
  id: number
  user_id: number
  amount: number
  currency?: string
  status: string
  note?: string | null
  admin_note?: string | null
  payout_ref?: string | null
  requested_at?: string
  reviewed_at?: string
  processed_at?: string
  created_at?: string
  updated_at?: string
  payout_account_id?: number
  payout_account?: {
    alias_cbu?: string | null
    bank_name?: string | null
    account_holder?: string | null
  } | null
  user?: { id: number; name?: string; email?: string } | null
}

const rows = ref<Withdrawal[]>([])
const total = ref<number>(0)
const loading = ref(false)
const loadingId = ref<number | null>(null)
const page = ref(1)
const limit = ref(25)
const q = ref('')
const status = ref<string>('') // filtros: '', 'requested', 'under_review', 'approved', 'paid', ...
const from = ref<string>('')
const to = ref<string>('')

// Modales/acciones
const showPay = ref(false)
const showReject = ref(false)
const showView = ref(false)
const current = ref<Withdrawal | null>(null)
const payRef = ref('')
const payNote = ref('')
const rejectReason = ref('')

// helpers
function fmtARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(n || 0))
}
function fmtDate(s?: string) {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(+d) ? '—' : d.toLocaleString()
}
function maskCbu(v: string) {
  const s = String(v || '')
  if (s.length <= 8) return s
  return s.slice(0, 6) + '••••••••' + s.slice(-4)
}

// estados UI
function statusLabel(st: string) {
  if (st === 'requested' || st === 'pending') return 'Pendiente'
  if (st === 'under_review') return 'En revisión'
  if (st === 'approved') return 'Aprobado'
  if (st === 'scheduled') return 'Programado'
  if (st === 'processing') return 'Procesando'
  if (st === 'paid') return 'Pagado'
  if (st === 'rejected') return 'Rechazado'
  if (st === 'failed') return 'Fallido'
  if (st === 'canceled') return 'Cancelado'
  return st
}
function statusClass(st: string) {
  if (st === 'requested' || st === 'pending') return 'bg-yellow-100 text-yellow-700'
  if (st === 'under_review') return 'bg-amber-100 text-amber-700'
  if (st === 'approved') return 'bg-blue-100 text-blue-700'
  if (st === 'scheduled') return 'bg-indigo-100 text-indigo-700'
  if (st === 'processing') return 'bg-sky-100 text-sky-700'
  if (st === 'paid') return 'bg-green-100 text-green-700'
  if (st === 'rejected') return 'bg-rose-100 text-rose-700'
  if (st === 'failed') return 'bg-red-100 text-red-700'
  if (st === 'canceled') return 'bg-gray-200 text-gray-700'
  return 'bg-gray-100 text-gray-700'
}
function isFinalStatus(st: string) {
  return st === 'paid' || st === 'rejected' || st === 'failed' || st === 'canceled'
}
function canApprove(st: string) {
  return st === 'requested' || st === 'pending' || st === 'under_review'
}
function canPay(st: string) {
  return st === 'approved'
}
function canReject(st: string) {
  return st === 'requested' || st === 'pending' || st === 'under_review' || st === 'approved'
}

// carga
async function load() {
  loading.value = true
  try {
    const params: any = {
      limit: limit.value,
      offset: (page.value - 1) * limit.value,
      q: q.value || undefined,
      status: status.value || undefined,
      from: from.value || undefined,
      to: to.value || undefined,
      _: Date.now(),
    }
    const res = await api.get('/admin/withdrawals', { params })
    if (Array.isArray(res.data)) {
      rows.value = res.data
      total.value = res.data.length
    } else {
      rows.value = res.data.rows || []
      total.value = res.data.total || rows.value.length
    }
  } catch (e) {
    console.error('Error cargando retiros', e)
    rows.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function prev() {
  if (page.value <= 1) return
  page.value -= 1
  load()
}
function next() {
  if (rows.value.length < limit.value) return
  page.value += 1
  load()
}

// aprobar (no descuenta; deja listo para pagar)
async function approve(w: Withdrawal) {
  if (!canApprove(w.status)) return
  loadingId.value = w.id
  try {
    await api.post(`/admin/withdrawals/${w.id}/approve`, {})
    await load()
  } catch (e) {
    console.error('Error aprobando', e)
    alert('No se pudo aprobar.')
  } finally {
    loadingId.value = null
  }
}

// pagar
function openPayIfAllowed(w: Withdrawal) {
  if (!canPay(w.status)) return
  openPay(w)
}
function openPay(w: Withdrawal) {
  current.value = w
  payRef.value = ''
  payNote.value = ''
  showPay.value = true
}
function closePay() {
  showPay.value = false
  current.value = null
  payRef.value = ''
  payNote.value = ''
}
async function markPaid() {
  if (!current.value) return
  if (!payRef.value.trim()) return
  loadingId.value = current.value.id
  try {
    await api.post(`/admin/withdrawals/${current.value.id}/mark-paid`, {
      reference: payRef.value.trim(),
      admin_note: payNote.value.trim() || null,
    })
    closePay()
    await load()
  } catch (e) {
    console.error('Error marcando pagado', e)
    alert('No se pudo marcar como pagado.')
  } finally {
    loadingId.value = null
  }
}

// rechazar
function openReject(w: Withdrawal) {
  if (!canReject(w.status)) return
  current.value = w
  rejectReason.value = ''
  showReject.value = true
}
function closeReject() {
  showReject.value = false
  current.value = null
  rejectReason.value = ''
}
async function reject() {
  if (!current.value) return
  if (!rejectReason.value.trim()) return
  loadingId.value = current.value.id
  try {
    await api.post(`/admin/withdrawals/${current.value.id}/reject`, {
      reason: rejectReason.value.trim(),
    })
    closeReject()
    await load()
  } catch (e) {
    console.error('Error rechazando', e)
    alert('No se pudo rechazar.')
  } finally {
    loadingId.value = null
  }
}

// ver detalle
function openView(w: Withdrawal) {
  current.value = w
  showView.value = true
}
function closeView() {
  showView.value = false
  current.value = null
}

watch([limit, status], () => { page.value = 1; load() })
onMounted(load)
</script>

<style scoped>
/* Tailwind para estilos; no se requiere extra */
</style>
