<template>
  <div
    class="flex flex-col max-w-xl mx-auto rounded-2xl shadow-lg p-8 gap-6 md:min-h-[80vh] animate-fade-in">

    <!-- Título -->
    <h1 class="text-primary text-2xl sm:text-4xl font-bold text-center mb-4">
      ¿Qué tipo de vehículo queres registrar?
    </h1>

    <p class="text-gray-300 text-center sm:mb-6 text-xs sm:text-base">
      Elegí la categoría que mejor describa tu vehículo.
    </p>

    <!-- Opciones de vehículo -->
    <div class="space-y-4">
      <FormOption v-model="type" value="van" title="Camioneta" text="Vehículo de gran porte (2.5 x 4 m aprox)."
        icon="truck-pickup" />
      <FormOption v-model="type" value="car" title="Automóvil" text="Tamaño convencional (2.2 x 3.2 m aprox)."
        icon="car-side" />
      <FormOption v-model="type" value="motorcycle" title="Motocicleta" text="Motos estándar (1 x 1.8 m aprox)."
        icon="motorcycle" />
      <FormOption v-model="type" value="bicycle" title="Bicicleta o Monopatín" text="(0.5 x 1.8 m aprox)."
        icon="bicycle" />
    </div>

    <!-- Botón continuar -->
    <div class="mt-auto flex justify-end">
      <button @click="type ? $emit('next') : (showErrorModal = true)"
        class="w-full md:w-auto bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md">
        Continuar ➜
      </button>
    </div>

    <!-- Modal de error -->
    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
      message="Por favor, seleccioná una opción antes de continuar." :icon="logo"
      @confirm="showErrorModal = false" />
  </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import FormOption from '../../forms/FormOption.vue';
import StatusModal from "../addSpacePage/StatusModal.vue";
import logo from "../../../assets/logo.png";

const showErrorModal = ref(false);
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'next']);

const type = computed({
  get: () => props.modelValue.type,
  set: (val) => emit('update:modelValue', { ...props.modelValue, type: val })
});
</script>
