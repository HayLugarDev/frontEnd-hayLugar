<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import logo from "../../../assets/logo.png";

const emit = defineEmits(["close", "selected"]);

const marker = ref<{ lat: number; lng: number }>({ lat: -26.8083, lng: -65.2176 });
const address = ref("");
const mapRef = ref<HTMLDivElement | null>(null);
const map = ref<google.maps.Map | null>(null);
const googleMarker = ref<google.maps.Marker | null>(null);

const options = computed<google.maps.MapOptions>(() => ({
  zoom: 15,
  gestureHandling: "greedy",
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}));

// 🔹 Inicializa el mapa con el Loader oficial de Google Maps
const initMap = async () => {
  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });

    const google = await loader.load();
    await nextTick();

    if (!mapRef.value) return;

    const m = new google.maps.Map(mapRef.value, {
      center: marker.value,
      ...options.value,
    });

    map.value = m;

    googleMarker.value = new google.maps.Marker({
      position: marker.value,
      map: m,
      icon: {
        url: logo,
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    // 📍 Escucha clics para seleccionar una ubicación manualmente
    m.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      marker.value = { lat, lng };
      googleMarker.value?.setPosition(marker.value);
      getAddressFromCoords(lat, lng);
    });

    // 📍 Intenta obtener la ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          marker.value = { lat, lng };
          map.value?.setCenter(marker.value);
          googleMarker.value?.setPosition(marker.value);
          getAddressFromCoords(lat, lng);
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación:", error.message);
          // Si falla, mantiene el valor por defecto
          getAddressFromCoords(marker.value.lat, marker.value.lng);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.warn("Geolocalización no soportada");
      getAddressFromCoords(marker.value.lat, marker.value.lng);
    }
  } catch (err) {
    console.error("Error inicializando mapa:", err);
  }
};

// 🔹 Geocodifica coordenadas → dirección
const getAddressFromCoords = (lat: number, lng: number) => {
  if (!window.google || !window.google.maps) {
    address.value = "Ubicación seleccionada manualmente";
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      address.value = results[0].formatted_address;
    } else {
      address.value = "Ubicación seleccionada manualmente";
    }
  });
};

// 🔹 Confirmar selección
const confirmSelection = () => {
  emit("selected", { ...marker.value, address: address.value || null });
  emit("close");
};

// 🔹 Montaje
onMounted(() => {
  initMap();
});
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-xl">
      <h2 class="text-lg font-bold mb-4 text-gray-800 text-center">Seleccioná la ubicación</h2>

      <!-- Contenedor del mapa -->
      <div ref="mapRef" class="w-full h-[400px] rounded-xl overflow-hidden shadow-md"></div>

      <p v-if="address" class="text-gray-600 text-sm mt-3 italic text-center">{{ address }}</p>

      <div class="flex justify-end mt-5 space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button
          @click="confirmSelection"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
