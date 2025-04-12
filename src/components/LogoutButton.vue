<template>
    <button 
        @click="executeAction"
        class="p-2 text-start text-red-700 font-medium rounded-lg hover:scale-105 transition-all">
        <b><font-awesome-icon :icon="usedIcon" class="xl:mr-1 text-xl" />Cerrar sesión</b>
    </button>
</template>

<script setup>
const props = defineProps({
  action: {
    type: Function,
    required: true
  },
  route: String,
  usedIcon: String
});

const executeAction = () => {
  props.action(props.route);
};
</script>