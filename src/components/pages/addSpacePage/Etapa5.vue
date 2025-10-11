<template>
    <div class="flex flex-col max-w-3xl mx-auto p-6 gap-6 min-h-[80vh] animate-fade-in">
        <div class="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100">

            <!-- Título -->
            <h2 class="text-3xl font-bold text-primary text-center mb-4">
                🚗 Resumen antes de publicar
            </h2>

            <!-- Lista de detalles -->
            <ul class="space-y-4 text-gray-700">
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📍 Nombre:</span> {{ modelValue.name }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📬 Dirección:</span> {{ modelValue.location }}, {{
                        modelValue.locationDetails }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">🏷️ Tipo de espacio:</span> {{ modelValue.parking_type }}
                </li>
                <li class="flex items-center gap-2">
                    <span class="font-semibold">📢 Publicación activa:</span>
                    <span
                        :class="modelValue.status === 'active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                        {{ modelValue.status === "active" ? "Sí" : "No" }}
                    </span>
                </li>
                <li class="flex flex-col items-start gap-2">
                    <span class="font-semibold">📝 Descripción:</span>
                    <span class="pl-2 text-gray-600">{{ modelValue.description }}</span>
                </li>
                <li>
                    <span class="font-semibold">🖼️ Imágenes cargadas:</span>
                    <div class="flex flex-wrap gap-3 mt-2">
                        <img v-for="(img, index) in modelValue.images" :key="index" :src="getImageSrc(img)"
                            class="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                    </div>
                </li>
            </ul>

            <!-- Acciones -->
            <div class="flex flex-col md:flex-row gap-4 justify-between mt-6">
                <button @click="emit('prev')"
                    class="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition">
                    Volver a editar        
                </button>

                <button type="button" @click="submitForm"
                    class="px-8 py-2 bg-primary text-white rounded-full font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all">
                    <img v-if="cargando" :src="loadIcon" alt="Cargando" class="w-6 h-6 animate-spin" />
                    <span v-else>Confirmar y Publicar</span>
                </button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import loadIcon from '../../../assets/load-icon_secondary.svg';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'next', 'prev', 'submit']);

const cargando = ref(false);

// Función segura para mostrar imágenes
const getImageSrc = (img: string | File | null | undefined) => {
    if (!img) return '';
    return typeof img === 'string' ? img : URL.createObjectURL(img);
};

onUnmounted(() => {
    props.modelValue.images.forEach((img: string | File | null | undefined) => {
        if (img instanceof File) {
            URL.revokeObjectURL(img as any);
        }
    });
});


const submitForm = () => {
    cargando.value = true;
    emit('submit');
};
</script>

<style scoped>
.input-field {
    @apply w-full mt-2 p-2 border border-gray-300 rounded;
}
</style>
