<template>
    <label class="block">
    <span class="text-lg font-semibold text-black">{{ label }}</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :min="'1'"
      class="input-field"
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