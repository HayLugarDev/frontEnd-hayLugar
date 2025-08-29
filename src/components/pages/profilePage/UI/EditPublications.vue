<template>
    <transition name="fade">
        <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">

                <!-- Botón cerrar -->
                <button @click="close" class="absolute top-4 right-4 text-gray-600 hover:text-black">
                    ✖
                </button>

                <!-- Encabezado -->
                <h2 class="text-3xl font-bold text-primary mb-6">
                    Editá tu espacio
                </h2>

                <!-- Formulario -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField v-model="formData.name" label="Nombre del espacio" type="text" required />
                    <FormFieldAutocomplete v-model="formData.location" label="Ubicación" class="md:col-span-2" />
                    <FormField v-model="formData.type" label="Tipo de espacio" type="text" required />
                    <FormField v-model="formData.parking_type" label="Tipo de estacionamiento" type="text" required />
                    <FormField v-model="formData.description" label="Descripción" type="textarea"
                        class="md:col-span-2" />
                </div>

                <!-- Capacidades -->
                <div class="mt-6">
                    <h3 class="text-xl font-semibold text-primary mb-4">Vehículos aceptados</h3>

                    <!-- Lista de opciones -->
                    <div class="flex flex-col gap-3">
                        <VehicleFormOption v-for="type in vehicleTypes" :key="type.value" :value="type.value"
                            :title="type.title" :text="type.description" :configured="!!vehicleMap[type.value]"
                            :configuration="vehicleMap[type.value]" @configure="openConfig(type.value)" />
                    </div>

                    <!-- Modal de configuración -->
                    <VehicleModal v-if="selectedType" :type="selectedType" :existing="vehicleMap[selectedType]"
                        @save="saveConfiguration" @close="selectedType = null" />

                    <!-- Error si no selecciona ninguno -->
                    <StatusModal :visible="showErrorModal" title="¡Atención!"
                        message="Selecciona al menos un vehículo y configura capacidad y precio."
                        icon="/src/assets/logo.png" @close="showErrorModal = false" />

                    <!-- Imágenes -->
                    <div class="mt-6">
                        <h3 class="text-xl font-semibold text-primary mb-2">Modificar imágenes actuales</h3>
                        <input type="file" multiple @change="onFileChange"
                            class="border-2 shadow-xl rounded-full p-2" />
                        <div class="flex gap-2 mt-2 flex-wrap">
                            <img v-for="(img, i) in previewImages" :key="i" :src="img"
                                class="w-24 h-24 object-cover rounded-lg shadow" />
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="mt-8 flex justify-end gap-4">
                        <button @click="close" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button @click="guardarCambios"
                            class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal Éxito -->
    <transition name="fade">
        <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h2 class="text-2xl font-bold text-primary mb-2">¡Éxito!</h2>
                <p class="text-gray-700 text-center mb-6">El espacio se actualizó correctamente.</p>
                <button @click="closeSuccess" class="bg-primary text-white px-6 py-3 rounded-lg">
                    Continuar
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from '../../../../services/apiService';
import FormField from '../../../forms/FormField.vue';
import FormFieldAutocomplete from '../../../forms/FormFieldAutocomplete.vue';
import VehicleFormOption from '../../../forms/VehicleFormOption.vue';
import VehicleModal from '../../addSpacePage/VehicleModal.vue';
import StatusModal from '../../addSpacePage/StatusModal.vue';

const selectedType = ref<string | null>(null)
const showErrorModal = ref(false)

const vehicleTypes = [
    { value: 'van', title: 'Camioneta', description: 'Espacio mín. 2.5 x 4 m.' },
    { value: 'car', title: 'Automóvil', description: 'Espacio mín. 2.2 x 3.2 m.' },
    { value: 'motorcycle', title: 'Motocicleta', description: 'Espacio mín. 1 x 1.8 m.' },
    { value: 'bicycle', title: 'Bicicleta / Monopatín', description: 'Espacio seguro para almacenarlas.' }
]

// mapa de configuraciones actuales
const vehicleMap = computed<Record<string, any>>(() => {
    const map: Record<string, any> = {}
        ; (formData.value.vehicle_capacities || []).forEach((v: any) => {
            map[v.type] = v
        })
    return map;
})

function openConfig(type: string) {
    selectedType.value = type
}

function saveConfiguration(data: any) {
    const updated = formData.value.vehicle_capacities.filter((v: any) => v.type !== data.type)
    updated.push(data)
    formData.value.vehicle_capacities = updated
    selectedType.value = null
}

const props = defineProps<{
    visible: boolean,
    spaceId: number | null
}>()

const emit = defineEmits(['close', 'updated'])

const formData = ref<any>({
    name: '',
    location: '',
    type: '',
    parking_type: '',
    description: '',
    vehicle_capacities: [],
    images: []
})

const previewImages = ref<string[]>([])
const showSuccessModal = ref(false)

watch(() => props.visible, async (val) => {
    if (val && props.spaceId) {
        try {
            const res = await api.get(`/spaces/getbyid/${props.spaceId}`)
            formData.value = res.data
            console.log(res.data.images);
        } catch (e) {
            console.error("Error cargando espacio:", e)
        }
    }
})

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return

  // Convertimos a array y agregamos al array existente
  const newFiles = Array.from(files)
  formData.value.images = [
    // mantenemos las imágenes antiguas (strings)
    ...formData.value.images.filter((img: any) => typeof img === 'string'),
    // agregamos los nuevos archivos
    ...newFiles
  ]

  // Actualizamos la previsualización
  previewImages.value = formData.value.images.map((img: any) =>
    typeof img === 'string' ? img : URL.createObjectURL(img)
  )
}


const guardarCambios = async () => {
  const fd = new FormData()

  // Separamos archivos nuevos de imágenes existentes
  const imagesArray = Array.isArray(formData.value.images) ? formData.value.images : []
  const existingImages = imagesArray.filter((img: any) => typeof img === 'string')
  const newFiles = imagesArray.filter((img: any) => img instanceof File)

  // Enviamos las imágenes existentes dentro del JSON
  const payload = { ...formData.value, images: existingImages }
  fd.append('data', JSON.stringify(payload))

  // Adjuntamos solo los archivos nuevos
  newFiles.forEach((file: File) => fd.append('images', file))

  try {
    await api.put(`/spaces/${props.spaceId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    showSuccessModal.value = true
    emit('updated')
  } catch (e) {
    console.error("Error guardando cambios:", e)
  }
}




const close = () => emit('close')
const closeSuccess = () => {
    showSuccessModal.value = false
    emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
