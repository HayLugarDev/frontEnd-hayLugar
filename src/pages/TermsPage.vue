<template>
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
    const r = await fetch('/api/terms/active', { credentials: 'include' })
    if (!r.ok) throw new Error('No hay términos publicados.')
    terms.value = await r.json()

    const res = await fetch(terms.value.documentUrl)
    if (!res.ok) throw new Error('No se pudo cargar el documento de Términos.')
    html.value = await res.text()
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
