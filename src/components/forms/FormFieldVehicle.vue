<template>
    <label class="block text-gray-200">
    <span class="text-md font-semibold text-gray-400">{{ label }}</span>
    <input
      :value="modelValue === null ? 'No aplica' : modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :min="'1'"
      class="input-field bg-gray-900"
    />
  </label>
</template>

<script setup>

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String },
  required: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);
</script>