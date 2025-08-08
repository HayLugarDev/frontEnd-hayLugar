import { ref } from 'vue';
import universityMarker from '../assets/utn.png'; // Ícono local (asegúrate de que existe)

export function useUniversityMap() {
  const center = ref({ lat: -26.82414, lng: -65.2226 }); // UTN FRT
  const zoom = ref(17);
  const hoveredSpace = ref(null);

  // Reemplazo con string temporal para evitar error de google.maps no definido
  const markerIconUrl = universityMarker || 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png';

  const getMarkerOptions = (espacio: any) => {
    return {
      position: {
        lat: Number(espacio.latitude),
        lng: Number(espacio.longitude)
      },
      icon: {
        url: markerIconUrl,
        scaledSize: { width: 48, height: 48 }, // Vue Google Maps acepta objetos planos también
        anchor: { x: 24, y: 48 }
      },
      title: espacio.name || 'Estacionamiento UTN'
    };
  };

  const handleMouseOver = (espacio: any) => {
    hoveredSpace.value = espacio;
  };

  const handleMouseOut = () => {
    hoveredSpace.value = null;
  };

  const setCenterToLocation = (lat: number, lng: number) => {
    center.value = { lat, lng };
  };

  const mapOptions = ref({
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#eaeaea' }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#333' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#d6d6d6' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9e3f1' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ],
    disableDefaultUI: true,
    draggable: true,
    zoomControl: true,
    fullscreenControl: false,
    scrollwheel: true,
    streetViewControl: false
  });

  return {
    center,
    zoom,
    hoveredSpace,
    getMarkerOptions,
    handleMouseOver,
    handleMouseOut,
    mapOptions,
    setCenterToLocation
  };
}
