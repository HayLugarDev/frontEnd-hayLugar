<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <!-- Dialog -->
      <div
        class="relative z-10 w-[95%] md:w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog" aria-modal="true"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <!-- wallet icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 12.79V7a2 2 0 00-2-2H7a4 4 0 100 8h12a2 2 0 002-2z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M7 15h10m-6 4h6a2 2 0 002-2v-1a2 2 0 00-2-2h-6" />
              </svg>
            </span>
            <h3 class="text-lg md:text-xl font-semibold text-primary">Retirar fondos</h3>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            @click="close"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">
          <!-- KPIs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div class="text-xs text-gray-500">Saldo</div>
              <div class="text-lg font-semibold text-gray-900">{{ fmt(summary.balance) }}</div>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div class="text-xs text-gray-500">Retiros pendientes</div>
              <div class="text-lg font-semibold text-amber-700">{{ fmt(summary.pending_withdrawals) }}</div>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div class="text-xs text-gray-500">Disponible</div>
              <div class="text-lg font-semibold text-green-700">{{ fmt(summary.available) }}</div>
            </div>
          </div>

          <!-- Cuenta de cobro -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cuenta de cobro</label>

            <div v-if="accounts?.length" class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                v-for="acc in accounts"
                :key="acc.id"
                type="button"
                class="text-left border rounded-xl p-3 hover:shadow-sm transition"
                :class="selectedAccountId === acc.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'"
                @click="selectedAccountId = acc.id"
              >
                <div class="text-sm font-semibold text-gray-900 truncate">
                  {{ displayAliasOrCbu(acc.alias_cbu) }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ acc.bank_name || '—' }} • Titular: {{ acc.account_holder || '—' }}
                </div>
                <div class="mt-1">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    :class="acc.is_default ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                  >
                    {{ acc.is_default ? 'Principal' : 'Secundaria' }}
                  </span>
                  <span
                    v-if="acc.verified_at"
                    class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700"
                  >
                    Verificada
                  </span>
                </div>
              </button>
            </div>

            <div v-else class="text-sm text-gray-500">
              No tenés cuentas de cobro guardadas.
              <slot name="no-accounts-cta">
                <a class="text-primary underline cursor-pointer" @click="$emit('open-accounts')">
                  Cargar una cuenta
                </a>
              </slot>
            </div>
          </div>

          <!-- Monto -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Monto a retirar</label>
              <div class="relative">
                <input
                  v-model.number="amount"
                  type="number" min="0" step="0.01"
                  class="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="0,00"
                />
                <button
                  class="absolute right-1 top-1 bottom-1 px-3 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                  @click="setMax"
                  type="button"
                >Max</button>
              </div>
              <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
              <p v-else class="text-xs text-gray-500">
                Mínimo por retiro: {{ fmt(minWithdraw) }} • Disponible: <strong>{{ fmt(summary.available) }}</strong>
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Detalle</label>
              <div class="rounded-xl border border-gray-200 p-3 bg-gray-50 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Monto</span>
                  <span class="font-medium">{{ fmt(amount || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Tarifa de retiro</span>
                  <span class="font-medium">{{ fmt(fee) }}</span>
                </div>
                <div class="mt-2 pt-2 border-t flex justify-between">
                  <span class="text-gray-700 font-semibold">A recibir</span>
                  <span class="font-semibold text-green-700">{{ fmt(netAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nota -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nota (opcional)</label>
            <textarea
              v-model="note"
              rows="2"
              class="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
              placeholder="Referencia para tu retiro…"
              maxlength="255"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="close"
            type="button"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition
                   disabled:opacity-60 disabled:cursor-not-allowed
                   bg-accent"
            :disabled="disableSubmit || loading"
            @click="submit"
            type="button"
          >
            <span v-if="!loading">Solicitar retiro</span>
            <span v-else>Procesando…</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type Summary = { balance: number; pending_withdrawals: number; available: number }
type PayoutAccount = {
  id: number
  alias_cbu: string
  bank_name?: string | null
  account_holder?: string | null
  tax_id?: string | null
  is_default?: boolean
  verified_at?: string | null
}

// v-model
const props = defineProps<{
  modelValue: boolean
  summary: Summary
  accounts: PayoutAccount[]
  minWithdraw?: number // default: 1000
}>()
const emit = defineEmits<{
  (e:'update:modelValue', v:boolean): void
  (e:'submitted', payload: { amount: number; note?: string; payout_account_id: number }): void
  (e:'open-accounts'): void
}>()

const amount = ref<number>(0)
const note = ref<string>('')
const selectedAccountId = ref<number | null>(null)
const loading = ref(false)
const error = ref<string>('')

const minWithdraw = computed(() => props.minWithdraw ?? 1000)
const fee = computed(() => 0) // si en el futuro cobrás, cambialo aquí
const netAmount = computed(() => Math.max(0, (amount.value || 0) - (fee.value || 0)))
const disableSubmit = computed(() => !valid())

watch(() => props.modelValue, (open) => {
  if (open) {
    // reset al abrir
    error.value = ''
    amount.value = 0
    note.value = ''
    // preseleccionar la default si existe, si no la primera
    const def = props.accounts?.find(a => a.is_default) || props.accounts?.[0]
    selectedAccountId.value = def?.id ?? null
  }
})

function close() {
  emit('update:modelValue', false)
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS' }).format(Number(n||0))
}
function is22Digits(s: string) {
  return /^\d{22}$/.test(String(s || ''))
}
function maskCbu(v: string) {
  const s = String(v || '')
  if (s.length <= 8) return s
  return s.slice(0, 6) + '••••••••••' + s.slice(-4)
}
function displayAliasOrCbu(alias_cbu: string) {
  return is22Digits(alias_cbu) ? maskCbu(alias_cbu) : alias_cbu
}

function setMax() {
  amount.value = Math.max(0, props.summary?.available || 0)
}

function valid(): boolean {
  error.value = ''
  const a = Number(amount.value || 0)
  if (!(a > 0)) { error.value = 'Ingresá un monto válido.'; return false }
  if (a < minWithdraw.value) { error.value = `El mínimo por retiro es ${fmt(minWithdraw.value)}.`; return false }
  if (a > (props.summary?.available || 0)) { error.value = 'El monto supera el disponible.'; return false }
  if (!selectedAccountId.value) { error.value = 'Seleccioná una cuenta de cobro.'; return false }
  return true
}

async function submit() {
  if (!valid()) return
  try {
    loading.value = true
    emit('submitted', {
      amount: Number(amount.value),
      note: note.value?.trim() || undefined,
      payout_account_id: selectedAccountId.value as number,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
