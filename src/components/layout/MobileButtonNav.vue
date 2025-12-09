<template>
  <nav class="bottom-safe fixed bottom-0 left-0 right-0 md:hidden z-50 
         bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
         transition-transform duration-400" :class="isHidden ? 'translate-y-full' : 'translate-y-0'">

    <ul class="flex justify-around items-center py-4">

      <!-- INICIO -->
      <li @click="$emit('navigate', '/dashboard')" class="flex flex-col items-center text-xs cursor-pointer"
        :class="isActive('/dashboard')">
        <font-awesome-icon icon="house" class="text-2xl mb-1" />
        <h1>Inicio</h1>
      </li>

      <!-- MAPA / LISTA -->
      <li @click="route.path !== '/dashboard' ? $emit('navigate', '/dashboard') : $emit('toggle-map')"
        class="flex flex-col items-center text-xs cursor-pointer"
        :class="props.showMap ? 'text-primary font-semibold' : isActive('/mapa')">
        <font-awesome-icon :icon="props.showMap ? 'list' : 'map'" class="text-2xl mb-1" />
        <h1>{{ props.showMap ? 'Lista' : 'Mapa' }}</h1>
      </li>


      <!-- PUBLICAR - FAB -->
      <li @click="$emit('navigate', '/add-space')" class="relative -mt-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center 
                 shadow-lg shadow-primary/40 border-2 border-white/20 cursor-pointer">
        <font-awesome-icon icon="plus" class="text-2xl" />
        <img :src="decoPublica" alt="Publicar ahora" class="absolute -bottom-10 -right-2 h-24 rotate-12 pointer-events-none select-none" />
      </li>

      <!-- NOTIFICACIONES -->
      <li v-if="userStore.user" @click="$emit('navigate', '/notifications')"
        class="flex flex-col items-center text-xs cursor-pointer" :class="isActive('/notifications')">
        <font-awesome-icon icon="bell" class="text-2xl mb-1" />
        <h1>Notif.</h1>
      </li>

      <!-- AYUDA -->
      <li v-else @click="$emit('navigate', '/help')" class="flex flex-col items-center text-xs cursor-pointer"
        :class="isActive('/help')">
        <font-awesome-icon icon="question-circle" class="text-2xl mb-1" />
        <h1>Ayuda</h1>
      </li>

      <!-- PERFIL -->
      <li @click="userStore.user ? $emit('navigate', '/profile') : $emit('navigate', '/login')"
        class="flex flex-col items-center text-xs cursor-pointer" :class="isActive('/profile')">
        <font-awesome-icon v-if="!userStore.user" icon="user" class="text-2xl mb-1" />
        <img v-else :src="userStore.user.profile_picture" alt="Perfil"
          class="w-7 h-7 rounded-full object-cover mb-1" />
        <h1>Menu</h1>
      </li>

    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../store/userStore";
import decoPublica from "../../assets/deco-publica.png";

const userStore = useUserStore();

// Recibo desde el padre si el mapa está activado
const props = defineProps<{ showMap: boolean }>();

defineEmits(["toggle-map", "navigate"]);

const route = useRoute();

function isActive(path: string) {
  return route.path.startsWith(path)
    ? "text-primary font-semibold"
    : "text-gray-300";
}

const lastScrollY = ref(0);
const isHidden = ref(false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (current > lastScrollY.value + 10) {
      isHidden.value = true;   // Scroll down → hide
    } else if (current < lastScrollY.value - 10) {
      isHidden.value = false;  // Scroll up → show
    }

    lastScrollY.value = current;
  });
});
</script>

<style scoped>
nav ul li {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

nav ul li:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
</style>
