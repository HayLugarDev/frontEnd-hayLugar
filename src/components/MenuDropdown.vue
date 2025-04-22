<template>
    <div class="relative col-span-2">
      <div
        @click="toggleMenu"
        class="flex flex-row border p-2 px-4 items-center justify-between cursor-pointer rounded-md shadow-sm"
      >
        <span class="font-semibold">
          {{ selectedMenuOption || title }}
        </span>
        <font-awesome-icon
          :icon="openMenu ? 'fa-angle-up' : 'fa-angle-down'"
          class="text-gray-500 ml-2"
        />
      </div>
  
      <ul
        v-if="openMenu"
        class="absolute z-10 mt-2 bg-white border rounded-md w-full shadow-md animate-fade-in"
      >
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="p-2 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    options: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Seleccionar'
    }
  });
  
  const openMenu = ref(false);
  const selectedMenuOption = ref('');
  
  const toggleMenu = () => {
    openMenu.value = !openMenu.value;
  };
  
  const selectOption = (option) => {
    selectedMenuOption.value = option;
    openMenu.value = false;
  };
  </script>
  
  <style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  </style>