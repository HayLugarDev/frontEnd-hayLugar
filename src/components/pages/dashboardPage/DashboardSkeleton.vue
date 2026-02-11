<template>
  <div class="flex flex-col h-full pt-24 md:pt-20 animate-pulse">

    <!-- HEADER -->
    <div
      class="fixed top-0 left-0 right-0 h-20 z-50
             bg-white/5 backdrop-blur-xl border-b border-white/10
             flex items-center justify-between px-6 md:px-10"
    >
      <div class="w-28 h-8 bg-white/10 rounded-lg"></div>

      <div class="flex gap-3">
        <div class="w-10 h-10 bg-white/10 rounded-full"></div>
        <div class="w-10 h-10 bg-white/10 rounded-full"></div>
      </div>
    </div>

    <!-- BUSCADOR MOBILE -->
    <div class="md:hidden px-6 mt-4">
      <div class="h-12 rounded-full bg-white/10"></div>
    </div>

    <!-- TITULO -->
    <div class="px-6 md:px-10 mt-6">
      <div class="w-40 h-6 bg-white/10 rounded-md"></div>
    </div>

    <!-- RESULTADOS -->
    <div class="flex flex-col gap-10 px-4 md:px-8 mt-6">

      <!-- SECCIÓN CIUDAD (repetible) -->
      <section
        v-for="section in 4"
        :key="'section-' + section"
        class="relative"
      >
        <!-- Título ciudad -->
        <div class="w-32 h-5 bg-white/10 rounded-md mb-4 ml-2"></div>

        <!-- Slider -->
        <div class="flex gap-4 overflow-x-hidden px-2 pb-2">
          <SkeletonSpaceCard
            v-for="n in 5"
            :key="'card-' + section + '-' + n"
            class="min-w-[260px] max-w-[260px]"
          />
        </div>
      </section>

    </div>

  </div>
</template>

<script setup>
import SkeletonSpaceCard from './SkeletonSpaceCard.vue'
</script>
