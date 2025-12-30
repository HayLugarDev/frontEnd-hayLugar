<template>
  <div class="min-h-screen bg-[#020617] text-white">

    <!-- ================= HEADER ================= -->
    <header class="relative z-40">
      <!-- Back solo mobile -->
      <div class="sm:hidden absolute top-4 left-4 z-50">
        <BackButton />
      </div>

      <MainHeader />
    </header>

    <!-- ================= CONTENIDO ================= -->
    <main
      class="
        pt-[72px]            /* altura real del header */
        px-4 sm:px-6
        pb-10
        max-w-7xl
        mx-auto
        relative
        z-10
      "
    >
      <TrafficNationalMap @publish="goPublish" />
    </main>

  </div>
</template>


<script setup lang="ts">
import TrafficNationalMap from "../features/traffic/TrafficNationalMap.vue";
import { useRouter } from "vue-router";
import MainHeader from '../components/layout/header/MainHeader.vue';
const router = useRouter();

function goPublish() {
  // Ajustá a tu ruta real
  router.push({ path: "/host/spaces/new" });
}
</script>
