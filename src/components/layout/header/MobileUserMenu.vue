<template>
  <div v-if="visible" class="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-40 backdrop-blur-sm" @click.self="closeMenu">
    <div
      class="text-base w-80 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col rounded-r-xl"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center gap-2">
          <img v-if="user?.profile_picture" :src="user.profile_picture" alt="user" class="w-10 h-10 rounded-full" />
          <div v-else class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            <Logo />
          </div>
          <span class="font-semibold text-lg" v-if="user">Hola, {{ user.name.split(' ')[0] }}</span>
        </div>
        <button @click="closeMenu" class="text-3xl text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <!-- Contenido del menú -->
      <UserMenuOptions @navigate="handleNavigate" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import UserMenuOptions from '../UserMenuOptions.vue';
import { useUserStore } from '../../../store/userStore';
import Logo from '../Logo.vue';

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'navigate', path: string): void;
}>();

const userStore = useUserStore();
const user = computed(() => userStore.user);

const visible = ref(props.modelValue);
const isOpen = ref(false);
const startX = ref(0);

const closeMenu = () => {
  isOpen.value = false;
  setTimeout(() => {
    emit('update:modelValue', false);
    emit('close');
  }, 300);
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      visible.value = true;
      setTimeout(() => (isOpen.value = true), 10);
    } else {
      isOpen.value = false;
      setTimeout(() => (visible.value = false), 300);
    }
  }
);

const handleNavigate = (path: string) => {
  emit('navigate', path);
  closeMenu();
};

const onTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX;
};

const onTouchMove = (e: TouchEvent) => {
  const deltaX = e.touches[0].clientX - startX.value;
  if (deltaX < -80) {
    closeMenu();
  }
};
</script>
