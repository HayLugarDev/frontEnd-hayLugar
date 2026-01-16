import { ref } from 'vue';
import logoMarker from '../assets/logo.png';

const userAddress = ref<string>('')

export async function resolveUserAddress(coords: google.maps.LatLngLiteral) {
    if (!window.google) return

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results?.length) {
            userAddress.value = results[0].formatted_address
        }
    })
}

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
        if (!navigator.geolocation) return

        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            }

            center.value = coords
            resolveUserAddress(coords)
        })
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
        userAddress,
        hoveredSpace,
        getMarkerOptions,
        handleMouseOver,
        handleMouseOut,
        mapOptions,
        setCenterToUserLocation,
        setCenterToLocation
    };
}
