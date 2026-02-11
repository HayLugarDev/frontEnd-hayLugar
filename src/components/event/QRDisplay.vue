<template>
  <div class="flex flex-col items-center text-center bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6">
    
    <!-- QR GENERADO EN VUE (simple) -->
    <qrcode-vue 
      :value="token"
      :size="200"
      level="H"
      render-as="svg"
      class="mb-4"
    />

    <!-- Mostrar token -->
    <p class="text-[#B0BEC5] text-sm break-all max-w-xs">{{ token }}</p>

    <!-- Copiar -->
    <button 
      @click="copy" 
      class="mt-4 bg-[#00B4D8] hover:bg-newgreen text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 transition"
    >
      Copiar Token
    </button>

    <p v-if="copied" class="mt-2 text-newgreen text-sm">Copiado ✔</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{ token: string }>();

const copied = ref(false);

async function copy() {
  await navigator.clipboard.writeText(props.token);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>
