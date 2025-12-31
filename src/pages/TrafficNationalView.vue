<template>
  <div class="min-h-screen bg-[#020617] text-white">

    <!-- ================= HEADER ================= -->
    <header class="relative z-40">
      <!-- BOTÓN ATRÁS MOBILE -->
      <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">

        <!-- SAFE AREA -->
        <div class="safe-top"></div>

        <!-- CONTENIDO REAL -->
        <div class="px-6 py-3 sm:py-4 xl:px-16
           flex items-center justify-between gap-6 text-white">

          <BackButton />
        </div>
      </div>

      <MainHeader />
    </header>

    <!-- ================= CONTENIDO ================= -->
    <main class="
        pt-[72px]            /* altura real del header */
        px-4 sm:px-6
        pb-10
        max-w-7xl
        mx-auto
        relative
        z-10
      ">
      <TrafficNationalMap @publish="goPublish" />
    </main>

  </div>
</template>


<script setup lang="ts">
import TrafficNationalMap from "../features/traffic/TrafficNationalMap.vue";
import { useRouter } from "vue-router";
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from "../components/common/BackButton.vue";
const router = useRouter();

function goPublish() {
  // Ajustá a tu ruta real
  router.push({ path: "/host/spaces/new" });
}
</script>
