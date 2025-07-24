<template>
  <label class="block mt-4 text-gray-500">
    <span class="text-md font-semibold text-black">{{ label }}</span>
    <GMapAutocomplete
      class="input-field"
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