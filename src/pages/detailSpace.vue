<template>
  <MainHeader />

  <!-- Skeleton mientras carga -->
  <SpaceDetailsSkeleton v-if="spaceStore.loading" />

  <div v-else-if="space" class="flex flex-col bg-secondary xl:w-11/12 mx-auto md:gap-4 mt-16 md:mt-0">

    <main class="flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">

      <!-- Carrusel en móviles -->
      <Carousel :images="carouselImages" class="lg:hidden w-full h-full rounded-lg" :controls="false" />

      <!-- Info del anfitrión -->
      <section v-if="space?.host"
        class="col-span-3 bg-white p-6 px-10 rounded-xl shadow-md mt-6 font-normal border border-gray-200 transition-all hover:shadow-xl">
        <div class="flex flex-row items-center gap-6">
          <img :src="hostImage" alt="Imagen del anfitrión"
            class="w-20 h-20 rounded-full shadow-lg border-2 border-primary object-cover" @error="onHostImageError" />
          <div class="flex flex-col gap-2 w-full text-gray-800 text-base">
            <div class="flex flex-row gap-2 items-center text-lg">
              <span class="font-bold text-primary">Anfitrión:</span>
              <span class="font-semibold">{{ space.host.name }} {{ space.host.last_name }}</span>
            </div>
            <div v-if="space.host.phone" class="flex flex-row gap-2 items-center">
              <font-awesome-icon :icon="['fab', 'whatsapp']" class="text-2xl text-green-600" />
              <span class="font-medium">+549{{ space.host.phone }}</span>
            </div>
            <div class="text-md md:text-md flex flex-row gap-2 items-center">
              <span class="font-medium">email: {{ space.host.email }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Título + Favorito + Compartir -->
      <div
        class="flex flex-row items-center justify-between mt-4 px-6 md:px-2 sticky top-0 bg-white z-10 rounded-xl shadow-sm py-2">
        <h1 class="text-2xl sm:text-xl font-bold text-primary pl-2">{{ capitalizeFirst(space.name) }}</h1>
        <div class="flex flex-row items-center gap-4">
          <button @click="toggleFavourite"
            class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 bg-white border-2 border-gray-200 hover:border-red-400"
            :class="activedFavouriteIcon ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-700'"
            title="Agregar a favoritos">
            <font-awesome-icon :icon="[activedFavouriteIcon ? 'fas' : 'far', 'heart']" class="text-2xl" />
          </button>
          <button @click="sharePublication"
            class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-primary"
            title="Compartir publicación">
            <font-awesome-icon :icon="['fas', 'share-alt']" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Galería de imágenes grande -->
      <div v-if="space?.images && space.images.length > 0"
        class="hidden lg:grid grid-cols-8 grid-rows-8 gap-2 py-4 h-[400px]">

        <div class="col-span-4 row-span-8">
          <img :src="space.images?.[0] || someImg" alt="Principal"
            class="h-full w-full object-cover rounded-lg shadow-md border cursor-pointer transition-transform duration-200 hover:scale-105"
            @click="openImageModal(0)" @error="onImageError" />
        </div>

        <div
          v-for="(img, index) in space.images?.slice(1, space.images.length) || [someImg, someImg, someImg, someImg]"
          :key="index">
          <div :class="imageGridPosition(index)">
            <img :src="img || someImg" alt="Espacio"
              class="h-full w-full object-cover rounded-lg shadow-md border cursor-pointer transition-transform duration-200 hover:scale-105"
              @click="openImageModal(index + 1)" @error="onImageError" />
          </div>
        </div>
      </div>



      <!-- Modal -->
      <ImageModal v-if="!imageErrorOccurred" :visible="isImageModalOpen" :images="space.images"
        :startIndex="currentImageIndex" @close="isImageModalOpen = false" />


      <!-- Info general + Formulario -->
      <div class="w-full mx-auto grid grid-cols-1 lg:grid-cols-10 lg:gap-10">
        <!-- Información del espacio -->
        <div class="md:col-span-6 md:grid md:grid-cols-3 gap-4 p-10">
          <div class="flex flex-row md:col-span-3 justify-between items-center text-xl mb-4 gap-2">
            <span :class="avgRating ? 'text-yellow-600' : 'text-gray-400'">
              <div v-for="v in avgRating ? Math.round(avgRating) : 5" :key="v" class="inline-block">
                ⭐
              </div>
            </span>
            <div class="flex flex-row gap-2">
              <span class="text-black">{{ totalReviews > 0 ? avgRating.toFixed(1) : '5.0' }}</span>
              <span class="font-sans cursor-pointer hover:underline text-lg md:text-md" @click="openReviews">
                ({{ totalReviews > 0 ? `${totalReviews} calificaciones` : "Sin calificaciones" }})
              </span>
            </div>
          </div>
          <div class="col-span-2">
            <p v-if="space.location" class="text-2xl md:text-md font-bold text-gray-800 mb-1">
              {{ space.location.split(',')[1] || '' }}
            </p>
            <p class="text-xl md:text-lg text-gray-500 font-semibold mb-4">{{ space.location.split(',')[0] }}</p>
            <div class="my-4 flex flex-col gap-3">
              <div v-for="v in space.vehicle_capacities" :key="v.type"
                class="p-3 px-6 border-2 rounded-xl shadow-md bg-gray-50 flex flex-col gap-1">
                <p class="font-semibold text-xl flex items-center gap-2">
                  <font-awesome-icon :icon="['fas', getVehicleType(v.type)]" class="text-primary" />
                  {{ getVehicleType(v.type) }}
                </p>
                <span v-if="v.price_per_hour"
                  class="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  ${{ v.price_per_hour.toLocaleString() }} / hora
                </span>
              </div>
            </div>
            <!-- Días disponibles -->
            <div class="mt-4">
              <p class="text-xl md:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <font-awesome-icon icon="calendar-days" class="text-primary text-xl" />
                Disponibilidad:
              </p>

              <!-- Si está disponible todos los días -->


              <div class="flex flex-wrap gap-2 my-2">
                <template v-if="disponibilidad?.days?.length">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(day, i) in disponibilidad.days" :key="i"
                      class="px-3 py-1 text-sm rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">
                      {{ capitalizeDay(day) }}
                    </span>
                  </div>
                </template>

                <template v-else>
                  <span
                    class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium shadow-sm">
                    <font-awesome-icon icon="check-circle" />
                    Todos los días
                  </span>
                </template>
              </div>
              <span v-if="disponibilidad.start && disponibilidad.end"
                class="day-chip border border-primary/30 bg-primary/10 text-primary flex-wrap">
                Horario: {{ disponibilidad.start }} - {{ disponibilidad.end }}</span>
            </div>
          </div>
        </div>

        <!-- Formulario reserva -->
        <FormReservation v-if="!isOwner && isLogged" class="col-span-10 lg:col-span-4 order-5 lg:order-3"
          :tipoVehiculo="tipoVehiculo" :tipoPlazoReserva="tipoPlazoReserva" :tiempoInicial="tiempoInicial"
          :tiempoFinal="tiempoFinal" :totalCalculado="totalCalculado" :vehicleOptions="vehicleOptions"
          @update:tipoVehiculo="tipoVehiculo = $event" @update:tipoPlazoReserva="tipoPlazoReserva = $event"
          @update:tiempoInicial="tiempoInicial = $event" @update:tiempoFinal="tiempoFinal = $event" @reservar="reservar"
          :availability="disponibilidad" />

        <!-- Botón para dueño -->
        <div v-else-if="isOwner"
          class="col-span-10 lg:col-span-4 flex justify-center items-start p-6 order-5 lg:order-3">
          <button @click="editPublication()"
            class="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-primary text-white font-bold shadow-lg hover:from-indigo-600 hover:to-primary transition-all duration-300 text-xl">
            ✏️ Editar publicación
          </button>
        </div>

        <!-- No logueado -->
        <div v-else-if="!isLogged"
          class="col-span-10 lg:col-span-4 flex flex-col items-center justify-center p-8 bg-white lg:rounded-xl shadow-lg border border-gray-200 text-center order-5 lg:order-3">
          <font-awesome-icon icon="user-lock" class="text-4xl text-primary mb-2" />
          <h2 class="text-2xl font-bold text-primary mb-2">¡Inicia sesión para reservar!</h2>
          <p class="text-gray-600 mb-6">Debes estar autenticado para poder seleccionar un vehículo y completar tu
            reserva.</p>
          <router-link to="/login"
            class="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition-all font-semibold">Iniciar
            sesión</router-link>
          <router-link to="/login" class="mt-3 text-primary underline">¿No tienes cuenta? Regístrate
            aquí</router-link>
        </div>

        <!-- Descripción -->
        <section class="col-span-10 border border-gray-300 p-6 rounded-xl text-xl order-6 bg-white shadow-md">
          <p class="font-semibold flex items-center gap-2">
            <font-awesome-icon icon="info-circle" class="text-primary" />
            Descripción:
          </p>
          <p class="text-gray-600 font-medium mt-2">{{ space.description }}</p>
        </section>

        <!-- Mapa -->
        <div
          class="col-span-10 flex flex-col justify-center items-start h-[350px] order-7 relative overflow-hidden p-4 rounded-xl bg-white shadow-md border border-gray-200">
          <p class="px-4 font-semibold mb-2">Ubicación en el mapa:</p>
          <CustomGoogleMap :center="{ lat: Number(space.latitude), lng: Number(space.longitude) }" :locateUser="false"
            class="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-md">
            <GMapMarker :position="{ lat: Number(space.latitude), lng: Number(space.longitude) }"
              :icon="{ url: carMarker, scaledSize: { width: 40, height: 40 } }" />
          </CustomGoogleMap>
        </div>

      </div>
    </main>
  </div>
  <EditPublications :visible="openEditModal" :spaceId="space?.id" @close="openEditModal = false" />

  <SessionExpired :sessionExpired="isSessionInvalid" />

  <ReviewsModal :show="showReviewsModal" :reviews="reviews" :avgRating="avgRating" :totalReviews="totalReviews"
    @close="showReviewsModal = false" />

  <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
    icon="/src/assets/logo.png" :isHtml="modalIsHtml" :buttonText="requiresTerms ? 'Aceptar términos' : 'Cerrar'"
    @close="showErrorModal = false" @confirm="requiresTerms ? redirigirATerminos() : showErrorModal = false" />

  <VehicleSelectModal :show="showVehicleModal" :vehicles="vehiculosUsuario" :vehicleType="getVehicleKey(tipoVehiculo)"
    @selected="onSelectedVehicle" :isHtml="modalIsHtml" @close="showVehicleModal = false" />

</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import MainHeader from "../components/layout/header/MainHeader.vue";
import carMarker from '../assets/logo.png';
import Carousel from '../components/common/Carousel.vue';
import { useReservationStore } from '../store/reservationStore';
import { useVerifyToken } from '../logic/useVerifyToken';
import SessionExpired from '../components/common/SessionExpired.vue';
import { useUserStore } from '../store/userStore';
import vehicleLabel, { getVehicleKey } from '../logic/useVehicleLabel';
import { getAllVehicles } from '../services/vehicleService';
import VehicleSelectModal from '../components/pages/detailSpacePage/VehicleSelectModal.vue';
import FormReservation from '../components/forms/FormReservation.vue';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';
import { capitalizeFirst } from '../utils/capitalizeFirstCharAt';
import EditPublications from '../components/pages/profilePage/UI/EditPublications.vue';
import ImageModal from '../components/common/ImageModal.vue';
import { addFavorite, removeFavorite, getUserFavorites } from '../services/favoriteService';
import { getVehicleType } from '../utils/vehicleTypeIconTraslation';
import { showToast } from '../utils/toast';
import { formatLocalDateTime } from '../utils/FormatDate';
import { imageGridPosition } from '../utils/imageGrid';
import { getReviewsBySpace } from "../services/reviewService";
import ReviewsModal from '../components/common/ReviewsModal.vue';
import { storeToRefs } from 'pinia'
import { useSpaceStore } from '../store/spaceStore'
import SpaceDetailsSkeleton from '../components/layout/skeletons/SpaceDetailsSkeleton.vue';
import someImg from '../assets/img-haylugar.jpeg';
import defaultProfile from '../assets/user_icon_primary.png';

const spaceStore = useSpaceStore()
const { selectedSpace: space, favorites } = storeToRefs(spaceStore)
const reservationStore = useReservationStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tiempoInicial = ref(null);
const tiempoFinal = ref(null);
const tipoVehiculo = ref('');
const tipoPlazoReserva = ref('Por hora');
const deadLine = ref(null);
const activedFavouriteIcon = ref(false);

const showVehicleModal = ref(false);
const vehiculosUsuario = ref([]);
const vehiculoSeleccionado = ref(null);

const isLogged = computed(() => !!userStore.user && !!userStore.user.id);

const showErrorModal = ref(false);
const errorMessage = ref('');
const modalIsHtml = ref(false);
const openEditModal = ref(false);
const requiresTerms = ref(false);
const isImageModalOpen = ref(false);
const currentImageIndex = ref(0);

const showReviewsModal = ref(false);
const reviews = ref([]);
const avgRating = ref(0);
const totalReviews = ref(0);

const imageErrorOccurred = ref(false);

const carouselImages = computed(() => {
  if (!space.value?.images || space.value.images.length === 0) {
    return [someImg];
  }
  return space.value.images;
});

const onImageError = (e) => {
  e.target.src = someImg;
  imageErrorOccurred.value = true;
};

const onHostImageError = (e) => {
  e.target.src = defaultProfile;
};

const ownerIdFromSpace = computed(() => {
  if (!space.value) return null;
  return space.value.owner_id ?? space.value.host?.id ?? space.value.host?.user_id ?? null;
});

const isOwner = computed(() => {
  if (!isLogged.value || !ownerIdFromSpace.value) return false;
  return Number(userStore.user.id) === Number(ownerIdFromSpace.value);
});

const { verifyToken, isSessionInvalid } = useVerifyToken();

// Espacio disponible del espacio
const disponibilidad = computed(() => {
  if (!space.value?.availability) return {};
  return typeof space.value.availability === 'string'
    ? JSON.parse(space.value.availability)
    : space.value.availability;
});

const obtenerEspacio = async () => {
  const slug = route.params.slug
  const space = await spaceStore.fetchSpaceBySlug(slug)
  if (!space) return

  avgRating.value = space.average_rating || 5
  fetchReviews(space.id)

  if (isLogged.value) {
    await spaceStore.fetchFavoriteSpaces()
    activedFavouriteIcon.value = await spaceStore.isFavorite(space.id)
  }
};

onMounted(async () => {
  await obtenerEspacio();
});

const openReviews = () => {
  showReviewsModal.value = true;
}

const fetchReviews = async (SpaceId) => {
  try {
    const { reviews: r, totalReviews: total } = await getReviewsBySpace(SpaceId);
    reviews.value = r;
    totalReviews.value = total;
  } catch (e) {
    console.error("Error al cargar opiniones", e);
  }
};

const sharePublication = async () => {
  if (!space.value) return;

  try {
    const url = `${window.location.origin}/espacio/${space.value.slug}`;

    if (navigator.share) {
      // Usa el API nativo de compartir (móvil/compatible)
      await navigator.share({
        title: space.value.name,
        text: '¡Mirá este espacio que encontré para estacionar!',
        url,
      });
    } else {
      // Copiar al portapapeles en escritorio
      await navigator.clipboard.writeText(url);
      showToast('Enlace copiado al portapapeles', 'success');
    }
  } catch (err) {
    console.error('Error al compartir:', err);
    showToast('No se pudo compartir', 'error');
  }
};


const redirigirATerminos = () => {
  showErrorModal.value = false;
  router.push('/aceptar-terminos');
};

const reservar = async () => {
  if (isOwner.value) {
    errorMessage.value = 'No podés reservar tu propio espacio.';
    modalIsHtml.value = false;
    showErrorModal.value = true;
    return;
  }

  if (!space.value || !tiempoInicial.value || !tiempoFinal.value || !tipoVehiculo.value) {
    errorMessage.value = 'Faltan completar campos para la reserva';
    modalIsHtml.value = false;
    showErrorModal.value = true;
    return;
  }

  if (userStore.terms?.mustReaccept) {
    errorMessage.value = 'Todavía no aceptaste los Términos y Condiciones de HayLugar';
    modalIsHtml.value = false;
    requiresTerms.value = true; // 👈 solo en este caso
    showErrorModal.value = true;
    return;
  }

  await verifyToken();
  if (isSessionInvalid.value) return;

  try {
    const vehiculos = await getAllVehicles();
    vehiculosUsuario.value = vehiculos.filter(v => v.type === getVehicleKey(tipoVehiculo.value));

    if (vehiculosUsuario.value.length === 0) {
      errorMessage.value = `No tenés vehículos registrados para este tipo.<br/>
        <a href="/profile?section=vehicles" class="text-blue-600 underline hover:text-blue-800">Agrega tu vehículo aquí</a>.`;
      showErrorModal.value = true;
      modalIsHtml.value = true;
      return;
    }

    showVehicleModal.value = true;
  } catch (error) {
    console.error('Error al traer vehículos', error);
  }
};

const onSelectedVehicle = (vehicle) => {
  vehiculoSeleccionado.value = vehicle;
  const payload = {
    owner_id: space.value.owner_id,
    space_id: space.value.id,
    vehicle_id: vehiculoSeleccionado.value.id,
    vehicle_type: getVehicleKey(tipoVehiculo.value),
    start_time: formatLocalDateTime(new Date(tiempoInicial.value)),
    end_time: formatLocalDateTime(new Date(tiempoFinal.value)),
    dead_line: deadLine.value,
    total: totalCalculado.value,
    user_vehicle_id: vehicle.id
  };

  reservationStore.setReservationData(payload);
  router.push('/pago');
};

const totalCalculado = computed(() => {
  if (!tiempoInicial.value || !tiempoFinal.value || !space.value || !tipoVehiculo.value) return 0;

  const inicio = new Date(tiempoInicial.value);
  const fin = new Date(tiempoFinal.value);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin <= inicio) {
    errorMessage.value = 'Error en las fechas ingresadas'
    modalIsHtml.value = false;
    showErrorModal.value = true;
    return;
  };

  // Buscar la tarifa del vehículo seleccionado
  let precioHora = 0;
  if (Array.isArray(space.value.vehicle_capacities)) {
    const tipoOriginal = getVehicleKey(tipoVehiculo.value);
    const vehicle = space.value.vehicle_capacities.find(v => v.type === tipoOriginal);
    if (vehicle) {
      precioHora = Number(vehicle.price_per_hour);
    }
  }

  if (precioHora === 0) return 0;

  const diferenciaMs = fin - inicio;

  switch (tipoPlazoReserva.value) {
    case 'Por hora': {
      const horas = diferenciaMs / (1000 * 60 * 60);
      deadLine.value = horas;
      return Math.ceil(horas) * precioHora;
    }
    case 'Por día': {
      const dias = diferenciaMs / (1000 * 60 * 60 * 24);
      deadLine.value = dias;
      return Math.ceil(dias) * precioHora * 24;
    }
    case 'Por mes': {
      const meses = diferenciaMs / (1000 * 60 * 60 * 24 * 30);
      deadLine.value = meses;
      return Math.ceil(meses) * precioHora * 24 * 30;
    }
    default:
      return 0;
  }
});

const vehicleOptions = computed(() => {
  if (!space.value?.vehicle_capacities) return [];

  return space.value.vehicle_capacities.map(v => (vehicleLabel(v.type)));
});

const hostImage = computed(() => {
  if (space.value?.host?.profile_image) {
    return space.value.host.profile_image;
  }
  return defaultProfile;
});

const openImageModal = (index) => {
  currentImageIndex.value = index;
  isImageModalOpen.value = true;
};

const editPublication = () => {
  openEditModal.value = true
};

const toggleFavourite = async () => {
  await verifyToken()
  if (isSessionInvalid.value) return

  try {
    const spaceId = space.value.id
    const isFav = await spaceStore.isFavorite(spaceId);

    if (!isFav) {
      await addFavorite(spaceId)
      await spaceStore.fetchFavoriteSpaces()
      activedFavouriteIcon.value = true;
      showToast("Agregado a mis favoritos", "success")
    } else {
      await removeFavorite(spaceId)
      await spaceStore.fetchFavoriteSpaces()
      activedFavouriteIcon.value = false;
      showToast("Eliminado de mis favoritos", "error")
    }
  } catch (err) {
    console.error("Error en toggleFavourite", err)
    showToast("Ocurrió un error, intenta de nuevo", "error")
  }
}



const capitalizeDay = (day) => {
  const map = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };
  return map[day.toLowerCase()] || day;
};

</script>

<style scoped>
.day-chip {
  @apply px-3 py-1 rounded-full text-sm font-semibold transition-all;
}

.day-chip:hover {
  @apply bg-primary text-white;
}
</style>
