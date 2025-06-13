<template>
  <GMapMap :center="center" :options="options" :zoom="zoom" map-type-id="roadmap"
    class="w-full h-[500px] rounded-lg shadow-md">
    <slot />
  </GMapMap>

</template>

<script setup>

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const props = defineProps({
  center: {
    type: Object,
    required: true,
  },
  zoom: {
    type: Number,
    default: 15,
  },
  options: {
    type: Object,
    default: () => ({}) // ← así evitás errores si no se pasan
  }

  // mapOptions: {
  //   type: Object,
  //   default: () => ({

  //     styles: [
  //       {
  //         featureType: "all",
  //         elementType: "geometry",
  //         stylers: [{ color: "#ebe3cd" }]
  //       },
  //       {
  //         featureType: "all",
  //         elementType: "labels.text.fill",
  //         stylers: [{ color: "#523735" }]
  //       },
  //       {
  //         featureType: "all",
  //         elementType: "labels.text.stroke",
  //         stylers: [{ color: "#f5f1e6" }]
  //       },
  //       {
  //         featureType: "administrative",
  //         elementType: "geometry.stroke",
  //         stylers: [{ color: "#c9b2a6" }]
  //       },
  //       {
  //         featureType: "administrative.land_parcel",
  //         elementType: "geometry.stroke",
  //         stylers: [{ color: "#dcd2be" }]
  //       },
  //       {
  //         featureType: "administrative.land_parcel",
  //         elementType: "labels.text.fill",
  //         stylers: [{ color: "#ae9e90" }]
  //       },
  //       {
  //         featureType: "landscape.natural",
  //         elementType: "geometry",
  //         stylers: [{ color: "#dfd2ae" }]
  //       },
  //       {
  //         featureType: "poi",
  //         elementType: "geometry",
  //         stylers: [{ color: "#dfd2ae" }]
  //       },
  //       {
  //         featureType: "poi",
  //         elementType: "labels.text.fill",
  //         stylers: [{ color: "#93817c" }]
  //       },
  //       {
  //         featureType: "poi.park",
  //         elementType: "geometry.fill",
  //         stylers: [{ color: "#a5b076" }]
  //       },
  //       {
  //         featureType: "poi.park",
  //         elementType: "labels.text.fill",
  //         stylers: [{ color: "#447530" }]
  //       },
  //       {
  //         featureType: "road",
  //         elementType: "geometry",
  //         stylers: [{ color: "#f5f1e6" }]
  //       },
  //       {
  //         featureType: "road.arterial",
  //         elementType: "geometry",
  //         stylers: [{ color: "#fdfcf8" }]
  //       },
  //       {
  //         featureType: "road.highway",
  //         elementType: "geometry",
  //         stylers: [{ color: "#f8c967" }]
  //       },
  //       {
  //         featureType: "road.highway",
  //         elementType: "geometry.stroke",
  //         stylers: [{ color: "#e9bc62" }]
  //       },
  //       {
  //         featureType: "road.highway.controlled_access",
  //         elementType: "geometry",
  //         stylers: [{ color: "#e98d58" }]
  //       },
  //       {
  //         featureType: "road.highway.controlled_access",
  //         elementType: "geometry.stroke",
  //         stylers: [{ color: "#db8555" }]
  //       },
  //       {
  //         featureType: "transit",
  //         elementType: "geometry",
  //         stylers: [{ color: "#dfd2ae" }]
  //       },
  //       {
  //         featureType: "water",
  //         elementType: "geometry.fill",
  //         stylers: [{ color: "#b9d3c2" }]
  //       },
  //       {
  //         featureType: "water",
  //         elementType: "labels.text.fill",
  //         stylers: [{ color: "#92998d" }]
  //       }
  //     ],
  //     disableDefaultUI: true,     // Oculta controles por defecto para un look más limpio
  //     zoomControl: true,          // Habilita solo el control de zoom
  //     streetViewControl: false,   // Deshabilita el Street View
  //     fullscreenControl: false,   // Deshabilita el botón de pantalla completa
  //     mapTypeControl: false,      // Oculta el control de tipo de mapa
  //   }),
  // },
});
</script>
