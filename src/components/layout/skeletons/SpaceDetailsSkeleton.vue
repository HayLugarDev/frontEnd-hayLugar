<template>
  <div
    class="animate-pulse flex flex-col bg-secondary xl:w-11/12 mx-auto md:gap-4 mt-16 md:mt-0 rounded-lg overflow-hidden">
    <main class="flex flex-col lg:px-10 w-full xl:w-11/12 mx-auto">

      <!-- Carrusel / Imagen principal -->
      <div class="w-full aspect-square bg-gray-200 rounded-lg lg:hidden"></div>

      <!-- Host info -->
      <section
        class="bg-white p-6 px-10 rounded-xl shadow-md mt-6 border border-gray-200 flex flex-row items-center gap-6">
        <div class="w-20 h-20 bg-gray-200 rounded-full border-2 border-primary"></div>
        <div class="flex flex-col gap-3 w-full">
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </section>

      <!-- Título + botones -->
      <div
        class="flex flex-row items-center justify-between mt-4 px-6 md:px-2 bg-white rounded-xl shadow-sm py-3 border border-gray-100">
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
        <div class="flex gap-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <!-- Galería de imágenes (desktop) -->
      <div class="hidden lg:grid grid-cols-8 grid-rows-8 gap-2 py-4 h-[400px]">
        <div class="col-span-4 row-span-8 bg-gray-200 rounded-lg"></div>
        <div class="col-span-4 row-span-4 bg-gray-200 rounded-lg"></div>
        <div class="col-span-2 row-span-4 bg-gray-200 rounded-lg"></div>
        <div class="col-span-2 row-span-4 bg-gray-200 rounded-lg"></div>
      </div>

      <!-- Info general + formulario -->
      <div class="w-full mx-auto grid grid-cols-1 lg:grid-cols-10 lg:gap-10 mt-6">

        <!-- Información del espacio -->
        <div class="col-span-6 grid grid-cols-3 gap-4 p-10">
          <div class="col-span-2 flex flex-col gap-4">
            <!-- ubicación -->
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>

            <!-- cards de vehículos -->
            <div class="flex flex-col gap-3 mt-4">
              <div
                v-for="i in 3"
                :key="i"
                class="p-3 px-6 border-2 rounded-xl shadow-md bg-gray-100 flex flex-col gap-2">
                <div class="h-5 bg-gray-300 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>

            <!-- disponibilidad -->
            <div class="mt-6 flex flex-col gap-3">
              <div class="h-5 bg-gray-200 rounded w-1/3"></div>
              <div class="flex flex-wrap gap-2">
                <div v-for="i in 5" :key="'day-'+i" class="w-20 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          <!-- calificación -->
          <div class="col-start-3 flex flex-col items-end gap-3">
            <div class="h-6 bg-gray-200 rounded w-16"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        <!-- Formulario de reserva -->
        <div
          class="col-span-10 lg:col-span-4 bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
          <div class="h-8 bg-gray-200 rounded w-2/3"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>

        <!-- Descripción -->
        <section
          class="col-span-10 border border-gray-300 p-6 rounded-xl bg-white shadow-md mt-6 space-y-3">
          <div class="h-5 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </section>

        <!-- Mapa -->
        <div
          class="col-span-10 flex flex-col justify-center items-start h-[350px] order-7 relative overflow-hidden p-4 rounded-xl bg-white shadow-md border border-gray-200 mt-6">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div class="absolute inset-0 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </main>
  </div>
</template>