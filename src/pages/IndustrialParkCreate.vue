<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white">
    <MainHeader class="hidden md:block" />

    <div class="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <h1 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <i class="fa-solid fa-warehouse text-[#06D6A0]"></i>
        Crear Parque Industrial
      </h1>

      <div class="bg-[#1B263B]/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl space-y-6">

        <!-- Owner -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">ID del Owner (owner_id)</label>
          <input
            v-model.number="form.owner_id"
            type="number"
            class="input"
            placeholder="Ej: 1"
          />
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">Nombre del parque</label>
          <input v-model="form.name" type="text" class="input" placeholder="Parque Logístico Tucumán" />
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-1">Dirección</label>
          <input v-model="form.address" type="text" class="input" placeholder="Ruta 9 Km 1280, Tucumán" />
        </div>

        <!-- Coordenadas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Latitud</label>
            <input v-model.number="form.latitude" type="number" step="0.000001" class="input" />
          </div>

          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Longitud</label>
            <input v-model.number="form.longitude" type="number" step="0.000001" class="input" />
          </div>
        </div>

        <!-- Contacto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Email</label>
            <input v-model="form.contact_email" type="email" class="input" />
          </div>

          <div>
            <label class="block text-sm text-[#B0BEC5] mb-1">Teléfono</label>
            <input v-model="form.contact_phone" type="text" class="input" />
          </div>
        </div>

        <!-- Imágenes desde dispositivo -->
        <div>
          <label class="block text-sm text-[#B0BEC5] mb-2">Agregar imágenes del dispositivo</label>

          <input type="file" multiple accept="image/*" @change="handleFiles" class="text-sm mt-2 text-[#B0BEC5]" />

          <!-- Previews -->
          <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div v-for="(src, index) in previews" :key="index" class="relative group">
              <img :src="src" class="w-full h-28 object-cover rounded-xl shadow-md" />

              <button
                @click="removeImage(index)"
                class="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <i class="fa-solid fa-circle-xmark text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Activo -->
        <div class="flex items-center gap-2 mt-2">
          <input v-model="form.is_active" type="checkbox" class="accent-[#06D6A0]" />
          <span class="text-sm text-[#B0BEC5]">Parque activo y visible</span>
        </div>

        <!-- Botones -->
        <div class="flex flex-col md:flex-row gap-3 mt-6">
          <button @click="createPark" class="btn-primary flex-1 py-3 text-lg">
            Crear Parque Industrial
          </button>

          <button @click="router.back()" class="btn-secondary py-3">
            Cancelar
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/apiService'
import MainHeader from '../components/layout/header/MainHeader.vue'

const router = useRouter()

const form = ref({
  owner_id: null as number | null,
  name: '',
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  contact_email: '',
  contact_phone: '',
  is_active: true
})

const files = ref<File[]>([])
const previews = ref<string[]>([])

function handleFiles(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  for (const file of target.files) {
    files.value.push(file)
    previews.value.push(URL.createObjectURL(file))
  }
}

function removeImage(i: number) {
  files.value.splice(i, 1)
  previews.value.splice(i, 1)
}

async function createPark() {
  if (!form.value.owner_id || !form.value.name) {
    alert('owner_id y nombre son obligatorios.')
    return
  }

  const fd = new FormData()
  fd.append('owner_id', String(form.value.owner_id))
  fd.append('name', form.value.name)
  fd.append('address', form.value.address)
  fd.append('latitude', String(form.value.latitude ?? ''))
  fd.append('longitude', String(form.value.longitude ?? ''))
  fd.append('contact_email', form.value.contact_email)
  fd.append('contact_phone', form.value.contact_phone)
  fd.append('is_active', String(form.value.is_active))

  // Imágenes reales
  files.value.forEach((file) => {
    fd.append('images', file)
  })

  try {
    await api.post('/industrial/parks', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('Parque industrial creado correctamente')
    router.push('/industrial')
  } catch (error) {
    console.error(error)
    alert('Error al crear el parque.')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: white;
  outline: none;
}
.input::placeholder {
  color: #90a4ae;
}
.input:focus {
  border-color: #00b4d8;
  box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.4);
}

.btn-primary {
  background: linear-gradient(to right, #00B4D8, #06D6A0);
  color: #0D1B2A;
  font-weight: 600;
  border-radius: 12px;
  transition: .25s;
}
.btn-primary:hover {
  opacity: .85;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  transition: .25s;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
