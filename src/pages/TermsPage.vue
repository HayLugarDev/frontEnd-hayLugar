<template>

  <div class="w-full flex justify-end p-4 sm:hidden absolute top-0 left-0 z-50">
    <BackButton />
  </div>

  <div class="min-h-screen bg-secondary flex flex-col">
    <div class="flex-grow flex items-start justify-center bg-primary py-10">
      <div class="bg-white p-6 md:rounded-xl shadow-2xl border-2 w-full md:w-3/4 lg:w-1/2">
        <h1 class="text-2xl font-bold mb-1">Términos y Condiciones</h1>
        <p class="text-xs text-gray-500 mb-6">
          Versión: {{ terms?.version || '—' }} · Publicado: {{ formattedDate }}
        </p>

        <div v-if="error" class="bg-red-100 text-red-700 border border-red-600 rounded p-3 mb-4">
          {{ error }}
        </div>

        <div v-if="loading" class="text-sm text-gray-600">Cargando…</div>

        <div v-else class="prose max-w-none" v-html="html"></div>

        <div class="mt-8">
          <RouterLink to="/login" class="underline text-primary">Volver a iniciar sesión</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import api from '../services/apiService'     // 👉 cliente Axios con baseURL = VITE_API_BASE_URL
import axios from 'axios'                    // 👉 instancia default para traer el HTML estático
import BackButton from '../components/common/BackButton.vue'

type Terms = {
  version: string
  publishedAt: string
  documentUrl: string
}

const terms = ref<Terms | null>(null)
const html = ref<string>('')
const loading = ref<boolean>(true)
const error = ref<string>('')

const formattedDate = computed(() => {
  if (!terms.value?.publishedAt) return '—'
  return new Date(terms.value.publishedAt).toLocaleDateString()
})

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
      transformResponse: (r) => r,
    })
    html.value = res.data as string
  } catch (e: any) {
    error.value = e?.message || 'Error cargando Términos.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.prose :deep(img){max-width:100%}
</style>
