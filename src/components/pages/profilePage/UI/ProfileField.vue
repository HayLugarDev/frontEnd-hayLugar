<template>
  <div class="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-row justify-between items-center">
    <div>
      <p class="text-xs text-gray-300">{{ label }}</p>
      <p class="font-medium">
        {{ valueToShow }}
      </p>
    </div>

    <!-- Si NO está registrado → mostrar ícono de agregar -->
    <button v-if="valueToShow === 'No registrado' && editable" @click.stop="handleClick"
      class="relative pr-2 text-newgreen flex flex-row items-center">
      <font-awesome-icon :icon="icon" class="text-xl" />
      <font-awesome-icon v-if="showPlus" icon="fa-solid fa-plus" class="text-sm absolute -top-1 right-1.5 font-bold" />
    </button>

    <!-- Si sí está registrado → mostrar ícono de editar -->
    <button v-else-if="editable" @click.stop="handleClick"
      class="relative pr-2 text-newgreen flex flex-row items-center">
      <font-awesome-icon icon="fa-edit" class="text-xl" />
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  icon?: string | string[];
  showPlus?: boolean;
  editable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["action"]);

const valueToShow = computed(() => {
  return props.value ?? props.fallback ?? "No cargado";
});

const handleClick = () => {
  emit("action", props.label); // Campo a editar
};
</script>
