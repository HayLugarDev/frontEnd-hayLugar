<template>
    <button 
        @click="executeAction"
        class="hover:bg-gray-300 p-2 w-full text-start text-red-700 font-medium rounded-lg">
        <b><font-awesome-icon :icon="usedIcon" class="xl:mr-1 text-xl" /> Salir</b>
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