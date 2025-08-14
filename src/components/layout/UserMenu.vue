<template>
  <div class="relative">
    <button @click="toggleMenu"
      class="hidden md:flex items-center gap-2 hover:shadow-lg hover:bg-gray-50 px-4 py-2 rounded-full">
      <font-awesome-icon :icon="open ? 'fa-angle-up' : 'fa-angle-down'" class="text-gray-500" />
      <img :src="hostImage" alt="ProfileIMG" class="w-9 rounded-full" />
    </button>

    <ul v-if="open"
      class="absolute bg-white rounded-xl flex flex-col py-2 top-14 -left-20 z-50 cursor-pointer shadow-xl min-w-48">
      <UserMenuOptions @navigate="$emit('navigate', $event)" />
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../../store/userStore';
import user_icon_primary from '../../assets/user_icon_primary.png';
import UserMenuOptions from './UserMenuOptions.vue';

const open = ref(false);
const userStore = useUserStore();

const toggleMenu = () => {
  open.value = !open.value;
};

const hostImage = computed(() => {
  return userStore?.user?.profile_picture || user_icon_primary;
});

</script>
