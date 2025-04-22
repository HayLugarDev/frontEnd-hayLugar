<template>
  <MainHeader />
  <div class="flex flex-col min-h-screen bg-secondary w-10/12 mx-auto">
    <header class="flex flex-col md:flex-row rounded-lg overflow-hidden p-4 lg:px-16">
      <div class="flex-1">
        <div class="flex flex-row items-center">
          <div class="text-3xl font-bold text-primary">{{ espacio?.name }}</div>
        </div>
        <div v-if="espacio && espacio.images && espacio.images.length">
          <div class="grid grid-cols-8 grid-rows-8 gap-2 py-6 h-[400px]">
            <!-- Imagen grande -->
            <div class="col-span-4 row-span-4 md:row-span-8">
              <img :src="`http://localhost:3000${espacio.images[0]}`" alt="Imagen principal"
                class="h-full w-full object-cover rounded-lg shadow-md border" />
            </div>

            <!-- Imágenes pequeñas -->
            <template v-for="(img, index) in espacio.images.slice(1, 5)" :key="index">
              <div :class="[
                'col-span-4 md:col-span-2 row-span-4',
                index === 0 && 'md:col-start-5 md:row-start-1',
                index === 1 && 'md:col-start-7 md:row-start-1',
                index === 2 && 'md:col-start-5 md:row-start-3',
                index === 3 && 'md:col-start-7 md:row-start-3'
              ]">
                <img :src="`http://localhost:3000${img}`" alt="Foto del espacio"
                  class="h-full w-full object-cover rounded-lg shadow-md border" />
              </div>
            </template>
          </div>
          <div class="w-11/12 mx-auto grid grid-cols-10 gap-2">
            <div class="col-span-6 grid grid-cols-3 grid-rows-3 gap-4 items-center justify-between p-4">
              <div class="col-span-2">
                <p class="text-2xl font-bold text-gray-800">
                  <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{
                    espacio.location.split(',')[1]
                      ?.split(' ')
                      .slice(2)
                      .join(' ')
                  }}
                </p>
                <p class="text-2xl text-gray-500 font-semibold">
                  {{ espacio.location.split(',')[0] }}
                </p>
                <p class="text-gray-900 font-semibold">
                  <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
                </p>
              </div>
              <div class="col-start-3 justify-center items-center flex flex-col">
                <span class="text-end text-gray-800 font-semibold">
                  <span class=" text-yellow-600">★</span>
                  4,70
                </span>
                <span class=" font-serif cursor-pointer hover:underline">62 Opiniones</span>
              </div>
              <section class="p-4 rounded-lg col-span-3 row-start-2 gap-4 border">
                <div class="flex flex-col">
                  <span class="font-semibold">Descripción: </span>
                  <p class="text-gray-600 w-auto font-medium">{{  espacio?.description  }}</p>
                </div>
              </section>
            </div>
            <section class="col-span-4 shadow-2xl p-4 rounded-xl h-[600px]">
              <div class="relative grid grid-cols-2 grid-rows-2 border rounded-md">
                <span class="col-span-2 flex items-center justify-center text-xl text-gray-700 font-semibold">Completá tu reserva</span>
                <MenuDropdown :options="['Por hora','Por día', 'Por mes']" :title="'Periódo de tiempo'"/>
                <div class="col-span-1 flex flex-col border p-2 items-center justify-center">
                  <label class="font-semibold">CheckIn</label>
                  <span>14/05/2025</span>
                </div>
                <div class="col-span-1 flex flex-col border p-2 items-center justify-center">
                  <label class="font-semibold">CheckOut</label>
                  <span>14/05/2025</span>
                </div>
                <MenuDropdown :options="['Camioneta','Auto', 'Motocicleta', 'Bicicleta']" :title="'Seleccioná tu vehículo'"/>
              </div>
            </section>
          </div>
        </div>
        <!-- <section class="flex justify-left">
          <button @click="reservar"
            class="bg-accent text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
            <font-awesome-icon icon="calendar-check" class="mr-2" />
            Reservar Ahora
          </button>
        </section> -->
      </div>

      <!-- <div class="w-80 h-90 flex justify-center items-center">
        <CustomGoogleMap v-if="espacio" :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
          class="w-full h-full rounded-lg overflow-hidden shadow-md">
          <Marker :options="{
            position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
            icon: markerIcon
          }" />
        </CustomGoogleMap>
      </div> -->
    </header>

    <section v-if="espacio?.host" class="bg-white p-6 rounded-lg shadow-md flex items-center">
      <img :src="espacio.host.image || 'https://source.unsplash.com/100x100/?person,avatar'" alt="Imagen del anfitrión"
        class="w-16 h-16 rounded-full shadow-md mr-4" />
      <div>
        <p class="text-lg font-semibold">Anfitrión: {{ espacio.host.nombre }}</p>
        <p class="text-gray-600">
          <font-awesome-icon icon="map-marker-alt" class="mr-1" />
          {{ espacio.host.ubicacion }}
        </p>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Marker } from 'vue3-google-map';
import CustomGoogleMap from '../components/GoogleMap.vue';
import MainHeader from "../components/MainHeader.vue";
import carMarker from '../assets/logo.png';
import bicycleMarker from '../assets/logo.png';
import truckMarker from '../assets/logo.png';
import { getSpaceById } from '../services/spaceService';
import Logo from '../components/Logo.vue';
import MenuDropdown from "../components/MenuDropdown.vue";

const router = useRouter();
const route = useRoute();
const rangoTiempo = ref("hora");
const espacio = ref(null);
const openMenu = ref(false);

const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const space = await getSpaceById(id);
    return espacio.value = space;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);

const markerIcon = computed(() => {
  if (espacio.value && espacio.value.type) {
    const tipo = espacio.value.type.toLowerCase();
    let iconUrl = null;
    if (tipo === "auto") {
      iconUrl = carMarker;
    } else if (tipo === "bicicleta") {
      iconUrl = bicycleMarker;
    } else if (tipo === "camioneta") {
      iconUrl = truckMarker;
    }
    return { url: iconUrl, scaledSize: { width: 40, height: 40 } };
  }
  return null;
});

const reservar = () => {
  if (espacio.value) {
    router.push(`/reserva/${espacio.value.id}`);
  }
};
</script>

<style scoped></style>
