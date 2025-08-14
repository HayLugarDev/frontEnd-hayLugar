<template>
  <div class="flex flex-col md:w-1/2 mx-auto p-6 gap-4">
    <!-- Título -->
    <h1 class="text-primary text-3xl md:text-4xl font-bold text-center mb-6">
      ¿Qué tipo de vehículo querés registrar?
    </h1>

    <!-- Opciones de vehículo -->
    <div class="space-y-4">
      <FormOption
        v-model="type"
        value="van"
        title="Camioneta"
        text="Vehículo de gran porte (2.5 x 4 m aprox)."
      />
      <FormOption
        v-model="type"
        value="car"
        title="Automóvil"
        text="Tamaño convencional (2.2 x 3.2 m aprox)."
      />
      <FormOption
        v-model="type"
        value="motorcycle"
        title="Motocicleta"
        text="Motos estándar (1 x 1.8 m aprox)."
      />
      <FormOption
        v-model="type"
        value="bicycle"
        title="Bicicleta o Monopatín"
        text="(0.5 x 1.8 m aprox)."
      />
    </div>

    <!-- Botón continuar -->
    <div class="flex justify-end mt-8">
      <button
        @click="type ? $emit('next') : (showErrorModal = true)"
        class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300 w-full md:w-auto"
      >
        Continuar
      </button>
    </div>

    <!-- Modal de error -->
    <StatusModal
      :visible="showErrorModal"
      type="error"
      title="¡Atención!"
      message="Por favor, seleccioná una opción antes de continuar."
      icon="/src/assets/logo.png"
      @close="showErrorModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FormOption from '../../forms/FormOption.vue';
import StatusModal from "../addSpacePage/StatusModal.vue";

const showErrorModal = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next']);

const type = computed({
  get: () => props.modelValue.type,
  set: (val) => emit('update:modelValue', { ...props.modelValue, type: val })
});
</script>
