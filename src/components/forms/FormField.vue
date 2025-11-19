<template>
    <label class="block text-gray-300">
    <span class="text-md font-semibold text-gray-200">{{ label }}</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :min="'1'"
      class="input-field bg-white/10 border-white/10"
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