```vue
<script setup lang="ts">
import CookieBanner from './components/common/CookieBanner.vue'
</script>

<template>
  <div
    class="safe-area-container min-h-screen raleway bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]"
  >
    <router-view :key="$route.fullPath" />

    <CookieBanner />
  </div>
</template>

<style>
.safe-area-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  /* fallback para algunos navegadores */
  padding-top: constant(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
}
</style>
```
