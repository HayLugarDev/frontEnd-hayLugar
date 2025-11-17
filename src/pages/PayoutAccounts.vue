<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-lg w-full md:w-2/3">
    <div class="p-4 flex flex-col gap-4" v-if="!loadingUser">
      <!-- Header -->
      <section class="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 class="text-2xl font-semibold text-primary flex items-center gap-2">
              <font-awesome-icon icon="university" />
              Cuentas de cobro
            </h2>
            <p class="text-gray-500 mt-1">
              Administra tus cuentas para recibir retiros de tu billetera.
            </p>
          </div>

          <button @click="openCreate()"
            class="inline-flex items-center bg-accent text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition">
            <font-awesome-icon icon="plus" class="mr-2" />
            Nueva cuenta
          </button>
        </div>
      </section>

      <!-- Listado -->
      <section class="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-primary">Mis cuentas</h3>
          <div v-if="isLoading" class="text-sm text-gray-500">Cargando…</div>
        </div>

        <div v-if="accounts.length === 0 && !isLoading" class="text-center py-10 text-gray-500">
          Aún no cargaste cuentas de cobro.
          <button class="ml-2 text-primary underline" @click="openCreate()">Crear ahora</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="accounts.length">
          <div v-for="acc in accounts" :key="acc.id" class="border rounded-xl p-4 bg-gray-50">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="text-sm text-gray-500">Banco</div>
                <div class="font-semibold text-gray-900 truncate">{{ acc.bank_name || '—' }}</div>

                <div class="mt-2 text-sm text-gray-500">Titular</div>
                <div class="text-gray-900 truncate">{{ acc.account_holder || '—' }}</div>

                <div class="mt-2 text-sm text-gray-500">Alias/CBU/CVU</div>
                <div class="font-mono text-gray-900 break-all">
                  {{ showAliasOrMasked(acc.alias_cbu) }}
                </div>

                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">CUIT/CUIL</div>
                    <div class="text-gray-900 break-all">{{ acc.tax_id || '—' }}</div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Verificada</div>
                    <div class="text-gray-900">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="acc.verified_at ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'">
                        {{ acc.verified_at ? 'Sí' : 'No' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="acc.is_default ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                    {{ acc.is_default ? 'Principal' : 'Secundaria' }}
                  </span>
                </div>

                <div class="mt-2 text-xs text-gray-400">
                  <span>Creada: {{ formatDate(acc.created_at) }}</span>
                  <span v-if="acc.updated_at"> · Actualizada: {{ formatDate(acc.updated_at) }}</span>
                </div>
              </div>

              <div class="flex flex-col items-end gap-2 shrink-0">
                <button class="px-3 py-1.5 rounded-lg border text-sm" :class="acc.is_default
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-primary text-primary hover:bg-primary hover:text-white transition'"
                  :disabled="acc.is_default || busyId === acc.id" @click="makeDefault(acc)"
                  title="Marcar como principal">
                  {{ acc.is_default ? 'Predeterminada' : 'Hacer principal' }}
                </button>

                <div class="flex gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg border text-sm border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    :disabled="busyId === acc.id" @click="openEdit(acc)" title="Editar cuenta">
                    Editar
                  </button>

                  <button
                    class="px-3 py-1.5 rounded-lg border text-sm border-rose-300 text-rose-600 hover:bg-rose-50 transition"
                    :disabled="busyId === acc.id" @click="remove(acc)" title="Eliminar cuenta">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal crear/editar -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div class="absolute inset-0 bg-black/40" @click="closeModal()"></div>

      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-primary">
            {{ editingId ? 'Editar cuenta' : 'Nueva cuenta' }}
          </h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeModal()">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-600 mb-1">Alias o CBU/CVU</label>
              <input v-model.trim="form.alias_cbu" type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none font-mono"
                placeholder="mi.alias.banco ó 2850XXXXXXXXXXXXXXX" />
              <p v-if="errors.alias_cbu" class="text-xs text-rose-600 mt-1">{{ errors.alias_cbu }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Podés ingresar un <strong>alias</strong> (ej: <em>mi.alias.banco</em>) o un <strong>CBU/CVU</strong> (22
                dígitos).
              </p>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Banco (opcional)</label>
              <input v-model.trim="form.bank_name" type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
                placeholder="Banco Ejemplo" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Titular (opcional)</label>
              <input v-model.trim="form.account_holder" type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
                placeholder="Nombre y apellido" />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">CUIT/CUIL (opcional)</label>
              <input v-model.trim="form.tax_id" type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
                placeholder="20-12345678-9" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" class="px-4 py-2 rounded-lg border border-gray-300" @click="closeModal()">
              Cancelar
            </button>
            <button type="submit"
              class="px-4 py-2 rounded-lg bg-primary text-white shadow hover:shadow-md transition disabled:opacity-60"
              :disabled="submitting">
              {{ submitting ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Crear cuenta') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Loader global usuario (si lo querés mostrar)
  <div v-else class="min-h-screen flex items-center justify-center">
    <img :src="loadIcon" alt="Cargando..." class="w-16 h-16 animate-spin" />
  </div> -->
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../services/apiService'
import { useUserStore } from '../store/userStore'
import MainHeader from '../components/layout/header/MainHeader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/** ==== Estado usuario ==== */
const userStore = useUserStore()
const loadingUser = computed(() => userStore.loading)

/** ==== Tipos (alineados a tu tabla) ==== */
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

/** ==== Estado vista ==== */
const accounts = ref<PayoutAccount[]>([])
const isLoading = ref(false)
const busyId = ref<number | null>(null)

/** Modal + form */
const showModal = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)

const form = ref({
  alias_cbu: '',
  bank_name: '',
  account_holder: '',
  tax_id: ''
})
const errors = ref<Record<string, string>>({})

/** ==== Helpers UI ==== */
function is22Digits(s: string) {
  return /^\d{22}$/.test(s)
}
function showAliasOrMasked(v: string) {
  const s = String(v || '')
  return is22Digits(s) ? maskCbu(s) : s
}
function maskCbu(v: string) {
  const s = String(v || '')
  if (s.length <= 8) return s
  return s.slice(0, 6) + '••••••••••' + s.slice(-4)
}
function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(+d) ? '—' : d.toLocaleString()
}

/** ==== Cargar cuentas ==== */
async function loadAccounts() {
  try {
    isLoading.value = true
    // GET /payout-accounts (tu backend)
    const res = await api.get('/payout-accounts', { params: { _: Date.now() } })
    accounts.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Error cargando cuentas', e)
    accounts.value = []
  } finally {
    isLoading.value = false
  }
}

/** ==== Modal ==== */
function openCreate() {
  editingId.value = null
  Object.assign(form.value, {
    alias_cbu: '',
    bank_name: '',
    account_holder: '',
    tax_id: ''
  })
  errors.value = {}
  showModal.value = true
}
function openEdit(acc: PayoutAccount) {
  editingId.value = acc.id
  Object.assign(form.value, {
    alias_cbu: acc.alias_cbu || '',
    bank_name: acc.bank_name || '',
    account_holder: acc.account_holder || '',
    tax_id: acc.tax_id || ''
  })
  errors.value = {}
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

/** ==== Validaciones ==== */
function validate() {
  const e: Record<string, string> = {}
  const alias = String(form.value.alias_cbu || '').trim()
  if (!alias) e.alias_cbu = 'Alias o CBU/CVU es obligatorio.'
  // Permitimos alias libre o CBU de 22 dígitos; si no es 22 dígitos, que tenga mínimo 4 chars
  if (alias && !is22Digits(alias) && alias.length < 4) {
    e.alias_cbu = 'Ingresá un alias válido o un CBU/CVU de 22 dígitos.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

/** ==== Crear/editar ==== */
async function submitForm() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = {
      alias_cbu: String(form.value.alias_cbu).trim(),
      bank_name: form.value.bank_name?.trim() || null,
      account_holder: form.value.account_holder?.trim() || null,
      tax_id: form.value.tax_id?.trim() || null
    }

    if (editingId.value) {
      await api.patch(`/payout-accounts/${editingId.value}`, payload)
    } else {
      await api.post('/payout-accounts', payload)
    }

    await loadAccounts()
    closeModal()
  } catch (e: any) {
    console.error('Error guardando cuenta', e)
    const msg = e?.response?.data?.message || 'No se pudo guardar la cuenta.'
    alert(msg)
  } finally {
    submitting.value = false
  }
}

/** ==== Acciones fila ==== */
async function makeDefault(acc: PayoutAccount) {
  if (acc.is_default) return
  try {
    busyId.value = acc.id
    await api.patch(`/payout-accounts/${acc.id}/default`, {})
    await loadAccounts()
  } catch (e) {
    console.error('Error marcando default', e)
    alert('No se pudo marcar como principal.')
  } finally {
    busyId.value = null
  }
}

async function remove(acc: PayoutAccount) {
  if (!confirm('¿Eliminar esta cuenta?')) return
  try {
    busyId.value = acc.id
    await api.delete(`/payout-accounts/${acc.id}`)
    await loadAccounts()
  } catch (e) {
    console.error('Error eliminando cuenta', e)
    const msg = (e as any)?.response?.data?.message || 'No se pudo eliminar la cuenta.'
    alert(msg)
  } finally {
    busyId.value = null
  }
}

/** ==== ciclo de vida ==== */
onMounted(async () => {
  if (!userStore.user) {
    await userStore.fetchUser()
  }
  await loadAccounts()
})
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
