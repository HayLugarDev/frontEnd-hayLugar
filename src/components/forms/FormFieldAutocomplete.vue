<template>
  <label class="block mt-4 text-gray-400">
    <span class="text-md font-semibold text-gray-200">{{ label }}</span>
    <GMapAutocomplete
      class="input-field bg-white/10 border-white/10"
      :placeholder="modelValue"
      @place_changed="setAddress"
    />
  </label>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

const setAddress = (place) => {
  const address = place.formatted_address || '';
  emit('update:modelValue', address);
};
</script>