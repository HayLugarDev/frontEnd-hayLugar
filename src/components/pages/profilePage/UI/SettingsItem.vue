<template>
  <li 
    class="flex flex-row items-start justify-between cursor-pointer pr-4"
    @click="onClick"
  >
    <div class="space-x-2 flex items-center">
      <font-awesome-icon :icon="icon" :class="[isAdmin ? 'text-green-500' : 'text-gray-300', 'mt-4']" />
      <span :class="[isAdmin ? 'text-green-500' : 'text-gray-300', 'mt-4']">
        {{ label }}
      </span>
    </div>

    <font-awesome-icon 
      icon="fa-chevron-right"
      class="text-gray-400 mt-5 text-xs"
    />
  </li>
</template>

<script setup>
defineProps({
  isAdmin: { type: Boolean, default: false },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  onClick: { type: Function, default: () => {} }
});
</script>
