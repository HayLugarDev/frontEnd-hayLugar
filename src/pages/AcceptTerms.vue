<template>
  <div class="min-h-screen bg-secondary flex flex-col">
    <div class="flex-grow flex items-start justify-center bg-primary py-10">
      <div class="bg-white p-6 md:rounded-xl shadow-2xl border-2 w-full md:w-3/4 lg:w-1/2">
        <div class="flex items-center justify-between mb-3">
          <h1 class="text-2xl font-bold">Actualizamos los Términos</h1>
          <span class="text-xs text-gray-500">Versión: {{ terms?.version || '—' }}</span>
        </div>

        <div v-if="banner" class="bg-yellow-50 text-yellow-800 border border-yellow-300 rounded p-3 mb-4 text-sm">
          Para continuar usando HayLugar (reservas/pagos/gestión), debés aceptar los Términos vigentes.
        </div>

        <div v-if="error" class="bg-red-100 text-red-700 border border-red-600 rounded p-3 mb-4">
          {{ error }}
        </div>

        <div v-if="loading" class="text-sm text-gray-600">Cargando…</div>

        <div v-else class="h-96 overflow-y-auto border rounded-md p-4 bg-white">
          <div class="prose max-w-none" v-html="html"></div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
            @click="accept"
            :disabled="loading || !terms || loadingAccept"
          >
            {{ loadingAccept ? 'Guardando…' : 'Acepto' }}
          </button>
          <RouterLink to="/" class="px-4 py-2 border rounded">Cancelar</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/apiService'
import axios from 'axios'                     

type Terms = {
  version: string
  publishedAt: string
  documentUrl: string
}

const router = useRouter()

const terms = ref<Terms | null>(null)
const html = ref<string>('')
const loading = ref<boolean>(true)
const loadingAccept = ref<boolean>(false)
const error = ref<string>('')
const banner = ref<boolean>(true)

async function load() {
  loading.value = true
  error.value = ''
  try {
    // 1) Traer versión activa (API)
    const { data } = await api.get<Terms>('/terms/active')
    terms.value = data

    // 2) Traer HTML del documento (estático del front)
    const res = await axios.get(terms.value.documentUrl, {
      responseType: 'text',
      transformResponse: (r) => r, // evitar que Axios intente parsear JSON
    })
    html.value = res.data as string
  } catch (e: any) {
    error.value = e?.message || 'Error cargando Términos.'
  } finally {
    loading.value = false
  }
}

async function accept() {
  if (!terms.value) return
  loadingAccept.value = true
  error.value = ''
  try {
    await api.post('/terms/accept', { version: terms.value.version })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.message || 'Error guardando aceptación.'
  } finally {
    loadingAccept.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.prose :deep(img){max-width:100%}
</style>
