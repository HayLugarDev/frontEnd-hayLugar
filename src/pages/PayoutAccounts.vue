<template>


  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
    <BackButton />
  </div>

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path: string) => router.push(path)" class="md:hidden" :showMap="false" />

  <div v-if="!loadingUser"
    class="font-normal flex flex-col space-y-6 min-h-screen py-20 md:pt-32 sm:p-8 sm:w-2/3 mx-auto md:px-6 md:py-10 text-white">

    <!-- Header -->
    <section class="sm:bg-white/10 sm:border border-white/10 p-6 md:p-8 rounded-2xl sm:shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 class="text-2xl font-semibold text-primary flex items-center gap-2">
            <font-awesome-icon icon="university" />
            Cuentas de cobro
          </h2>
          <p class="text-gray-200 mt-1">
            Administra tus cuentas para recibir retiros de tu billetera.
          </p>
        </div>

        <button @click="openCreate()"
          class="inline-flex items-center bg-newgreen/20 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition">
          <font-awesome-icon icon="plus" class="mr-2" />
          Nueva cuenta
        </button>
      </div>
    </section>

    <!-- Listado -->
    <section class="sm:bg-white/10 sm:border sm:border-white/10 p-6 md:p-8 rounded-2xl sm:shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-primary">Mis cuentas</h3>
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="n in 2" :key="n"
            class="rounded-2xl p-5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 animate-pulse">
            <div class="h-4 w-32 bg-white/10 rounded mb-3"></div>
            <div class="h-6 w-3/4 bg-white/10 rounded mb-4"></div>

            <div class="h-3 w-full bg-white/10 rounded mb-2"></div>
            <div class="h-3 w-5/6 bg-white/10 rounded mb-4"></div>

            <div class="flex gap-3">
              <div class="h-6 w-24 bg-white/10 rounded-full"></div>
              <div class="h-6 w-28 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="accounts.length === 0 && !isLoading"
        class="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a]/60 to-[#020617]/80">
        <div class="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </div>

        <h4 class="text-lg font-semibold text-white mb-1">
          No tenés cuentas de cobro
        </h4>
        <p class="text-sm text-gray-400 max-w-sm mb-6">
          Agregá una cuenta para recibir pagos automáticamente cuando completes una reserva.
        </p>

        <button
          class="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium shadow-lg shadow-sky-500/20 transition"
          @click="openCreate()">
          Agregar cuenta
        </button>
      </div>


      <div class="grid grid-cols-1 gap-4" v-if="accounts.length">
        <div v-for="acc in accounts" :key="acc.id" class="border rounded-xl p-4 bg-gray-900">
          <div class="flex flex-col md:flex-row items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="text-sm text-gray-500">Banco</div>
              <div class="font-semibold text-gray-200 truncate">{{ acc.bank_name || '—' }}</div>

              <div class="mt-2 text-sm text-gray-500">Titular</div>
              <div class="text-gray-200 truncate">{{ acc.account_holder || '—' }}</div>

              <div class="mt-2 text-sm text-gray-500">Alias/CBU/CVU</div>
                <div class="font-mono text-gray-200 break-all">
                  {{ showAliasOrMasked(acc.alias_cbu) }}
                  <button @click="copy(acc.alias_cbu)" class="ml-2 text-sm text-primary hover:underline">
                    Copiar
                  </button>
                </div>


              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500">CUIT/CUIL</div>
                  <div class="text-gray-200 break-all">{{ acc.tax_id || '—' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Verificada</div>
                  <span v-if="acc.verified_at"
                    class="absolute -top-1 -left-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
                  <div class="text-gray-900">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="acc.verified_at ? 'bg-emerald-100 text-newgreen' : 'bg-gray-200 text-gray-600'">
                      {{ acc.verified_at ? 'Sí' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="acc.is_default ? 'bg-green-100 text-newgreen' : 'bg-gray-200 text-gray-600'">
                  {{ acc.is_default ? 'Principal' : 'Secundaria' }}
                </span>
              </div>

              <div class="mt-2 text-xs text-gray-400">
                <span>Creada: {{ formatDate(acc.created_at) }}</span>
                <span v-if="acc.updated_at"> · Actualizada: {{ formatDate(acc.updated_at) }}</span>
              </div>
            </div>

            <div class="flex flex-row md:flex-col items-end gap-2 shrink-0">
              <button class="px-3 py-1.5 rounded-lg border text-sm" :class="acc.is_default
                ? 'border-gray-300 text-newgreen cursor-not-allowed'
                : 'border-primary text-gray-400 hover:bg-primary hover:text-white transition'"
                :disabled="acc.is_default || busyId === acc.id" @click="makeDefault(acc)" title="Marcar como principal">
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

    <div
      class="relative w-full max-w-2xl bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] rounded-2xl shadow-xl p-6 md:p-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-primary">
          {{ editingId ? 'Editar cuenta' : 'Nueva cuenta' }}
        </h3>
        <button class="text-gray-500 hover:text-gray-700" @click="closeModal()">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">

        <!-- Alias / CBU -->
        <div class="space-y-2 text-gray-400">
          <label class="block text-sm text-gray-200">Alias o CBU/CVU</label>

          <input v-model.trim="form.alias_cbu" class="w-full bg-white/10 border rounded-xl px-3 py-2" />

          <p v-if="detectAliasType(form.alias_cbu)" class="text-xs text-emerald-400 mt-1">
            ✔ Detectado: {{ detectAliasType(form.alias_cbu) }}
          </p>

          <p v-else-if="errors.alias_cbu" class="text-xs text-rose-500">
            {{ errors.alias_cbu }}
          </p>


          <p class="text-xs text-gray-400 leading-relaxed">
            Podés ingresar un <strong>alias</strong> (ej: <em>mi.alias.banco</em>) o un
            <strong>CBU/CVU</strong> (22 dígitos).
          </p>
        </div>

        <!-- Grid general -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">

          <!-- Titular -->
          <div class="flex flex-col space-y-2">
            <label class="text-sm text-gray-200">Titular</label>
            <input v-model.trim="form.account_holder" type="text" placeholder="Nombre y apellido" class="w-full bg-white/10 border border-white/10 px-3 py-2 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-primary/60 transition" />
          </div>

          <!-- CUIT/CUIL -->
          <div class="flex flex-col space-y-2">
            <label class="text-sm text-gray-200">CUIT/CUIL</label>
            <input v-model.trim="form.tax_id" placeholder="20123456789"
              class="w-full bg-white/10 border rounded-xl px-3 py-2" />

            <p v-if="form.tax_id && isValidCUIT(form.tax_id)" class="text-xs text-emerald-400">
              ✔ CUIT válido
            </p>

            <p v-else-if="errors.tax_id" class="text-xs text-rose-500">
              {{ errors.tax_id }}
            </p>
          </div>

          <!-- Banco -->
          <div class="flex flex-col space-y-2">
            <select v-model="form.bank_name" class="w-full bg-white/10 border rounded-xl px-3 py-2">
              <option value="" disabled>Seleccioná tu banco</option>
              <option v-for="b in BANKS" :key="b" :value="b">
                {{ b }}
              </option>
            </select>
            <p v-if="errors.bank_name" class="text-xs text-rose-500">
              {{ errors.bank_name }}
            </p>

          </div>


        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 pt-4">

          <button type="button" @click="closeModal()" class="px-4 py-2 rounded-xl border border-white/20 bg-white/5 
             text-gray-200 hover:bg-white/10 transition">
            Cancelar
          </button>

          <button type="submit" :disabled="submitting" class="px-4 py-2 rounded-xl bg-primary text-white shadow
             hover:shadow-lg transition disabled:opacity-50">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../services/apiService'
import { useUserStore } from '../store/userStore'
import MainHeader from '../components/layout/header/MainHeader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BackButton from '../components/common/BackButton.vue'
import { useRouter } from 'vue-router'
import MobileButtonNav from '../components/layout/MobileButtonNav.vue'
import { detectAliasType, isValidCUIT } from '../utils/validateBankData'
import { showToast } from '../utils/toast'

/** ==== Estado usuario ==== */
const userStore = useUserStore()
const router = useRouter();
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

const BANKS = [
  'Mercado Pago',
  'Santander',
  'Galicia',
  'BBVA',
  'Macro',
  'Provincia',
  'Naranja X',
  'Ualá',
  'Brubank'
]

/** Modal + form */
const showModal = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  showToast('¡Copiado al portapapeles!','success')
}


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

  if (!form.value.bank_name)
    e.bank_name = 'Seleccioná un banco'

  if (!form.value.alias_cbu)
    e.alias_cbu = 'Alias o CBU requerido'
  else if (!detectAliasType(form.value.alias_cbu))
    e.alias_cbu = 'Alias o CBU inválido'

  if (!form.value.account_holder || form.value.account_holder.length < 3)
    e.account_holder = 'Ingresá el titular'

  if (!isValidCUIT(form.value.tax_id))
    e.tax_id = 'CUIT/CUIL inválido'

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
