<template>
  <div class="border p-4 rounded-lg shadow-sm relative">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <p class="text-gray-600 text-sm">{{ text }}</p>
        <p v-if="configured" class="text-green-600 mt-1 text-sm">
          Configurado: capacidad {{ configuration.capacity }}, ${{ configuration.price_per_hour }}/hora
        </p>
      </div>
      <button
        class="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        @click="$emit('configure')"
      >
        {{ configured ? 'Editar' : 'Configurar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['value', 'title', 'text', 'configured', 'configuration']);
defineEmits(['configure']);
</script>
