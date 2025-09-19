<template>
  <transition name="fade">
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white"
      :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
    >
      <span v-if="toast.type === 'success'">✔️</span>
      <span v-else-if="toast.type === 'error'">❌</span>
      <span v-else-if="toast.type === 'notification'" class="text-2xl">✉</span>
      <span>{{ toast.text }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { toast } from "../../utils/toast";
</script>