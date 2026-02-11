<template>
  <div class="flex flex-col">
    <!-- Label -->
    <p class="text-gray-400 text-xs mb-1">
      {{ label }}
    </p>

    <!-- Valor -->
    <p
      class="font-semibold text-base sm:text-lg"
      :class="[
        valueClass,
        { 'capitalize': capitalize }
      ]"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  valueClass: { type: String, default: '' },
  capitalize: { type: Boolean, default: false }
});
</script>
