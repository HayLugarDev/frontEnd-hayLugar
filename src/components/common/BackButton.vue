<template>
   <button
          @click="goBack"
          class="text-gray-200 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          Atrás
        </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/dashboard');
  }
};
</script>