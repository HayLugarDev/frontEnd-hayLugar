import { ref } from 'vue';
import logoMarker from '../assets/logo.png';

export function useGoogleMap() {
    const center = ref({ lat: -26.8333, lng: -65.2167 });
    const zoom = ref(15);
    const hoveredSpace = ref(null);

    const markerIcon = logoMarker;

    const getMarkerOptions = (espacio: any) => ({
        position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
        icon: { url: markerIcon, scaledSize: { width: 40, height: 40 } }
    });

    const handleMouseOver = (espacio: any) => {
        hoveredSpace.value = espacio;
    };

    const handleMouseOut = () => {
        hoveredSpace.value = null;
    };

    const setCenterToUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    center.value = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                },
                (err) => {
                    console.error("Error al obtener geolocalización:", err);
                }
            );
        }
    };

    const mapOptions = ref({
        styles: [
            { featureType: "all", elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
            { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
            { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
            { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
            { featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{ color: "#dcd2be" }] },
            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e90" }] },
            { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#93817c" }] },
            { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#a5b076" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#447530" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f1e6" }] },
            { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fdfcf8" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8c967" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9bc62" }] },
            { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#e98d58" }] },
            { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#db8555" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
    });

    return {
        center,
        zoom,
        hoveredSpace,
        getMarkerOptions,
        handleMouseOver,
        handleMouseOut,
        mapOptions,
        setCenterToUserLocation
    };
}
