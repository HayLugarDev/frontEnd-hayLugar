<template>
  <!-- HEADER SOLO EN DESKTOP -->
  <MainHeader class="hidden md:block" />

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @toggle-map="toggleMap" @navigate="(path) => router.push(path)" class="md:hidden"
    :showMap="showMap" />

  <!-- Skeleton mientras carga -->
  <SpaceDetailsSkeleton v-if="spaceStore.loading" />

  <div v-else-if="space"
    class="flex flex-col bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] xl:w-11/12 mx-auto md:gap-4">

    <main class="flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">

      <!-- Carrusel en móviles -->
      <Carousel :images="carouselImages" class="lg:hidden w-full h-full rounded-lg" :controls="false" />

      <!-- Info del anfitrión -->
      <section v-if="space?.host"
        class="col-span-3 sm:bg-white/10 sm:border sm:border-white/10 p-6 px-10 rounded-xl shadow-md md:mt-6 font-normal transition-all hover:shadow-xl">
        <div class="flex flex-row items-center gap-6">
          <img :src="hostImage" alt="Imagen del anfitrión"
            class="w-20 h-20 rounded-full shadow-lg sm:border-2 sm:border-primary object-cover bg-white/50"
            @error="onHostImageError" />
          <div class="flex flex-col gap-2 w-full text-white text-base">
            <div class="flex flex-row gap-2 items-center text-lg">
              <span class="font-bold text-primary">Anfitrión:</span>
              <span class="font-semibold">{{ space.host.name }} {{ space.host.last_name }}</span>
            </div>
            <div v-if="space.host.phone" class="flex flex-row gap-2 items-center">
              <font-awesome-icon :icon="['fab', 'whatsapp']" class="text-2xl text-green-600" />
              <span class="font-medium">+549{{ space.host.phone }}</span>
            </div>
            <div class="text-md md:text-md flex flex-row gap-2 items-center">
              <span class="font-medium">{{ space.host.email }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Título + Favorito + Compartir -->
      <div
        class="flex flex-row items-center justify-between mt-4 px-6 md:px-2 sticky top-0 sm:bg-white/10 sm:border sm:border-white/10 z-10 rounded-xl shadow-xl py-2">
        <h1 class="text-2xl sm:text-xl font-bold text-white sm:text-primary pl-2">{{ capitalizeFirst(space.name) }}</h1>
        <div class="flex flex-row items-center gap-4">
          <button @click="toggleFavourite" :class="[
            // CLASES FIJAS
            'flex items-center justify-center w-12 h-12 rounded-full shadow-xl',
            'transition-transform duration-200 hover:scale-110',
            'bg-black/20 border border-white/10',

            // CLASE DINÁMICA DEL ICONO
            activedFavouriteIcon ? 'text-red-500' : 'text-gray-300',

            // CLASES DE HOVER (dinámicas para no conflictuar)
            activedFavouriteIcon
              ? 'hover:border-red-500 hover:text-red-500'
              : 'hover:border-primary hover:text-primary'
          ]" title="Agregar / eliminar de favoritos">
            <font-awesome-icon :icon="[activedFavouriteIcon ? 'fas' : 'far', 'heart']" class="text-2xl" />
          </button>


          <button @click="sharePublication" class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-200 hover:scale-110
         bg-black/20 border border-white/10 hover:border-primary text-gray-300 hover:text-primary"
            title="Compartir publicación">
            <font-awesome-icon :icon="['fas', 'share-alt']" class="text-xl" />
          </button>

        </div>
      </div>

      <!-- Galería de imágenes grande -->
      <div v-if="space?.images && space.images.length > 0"
        class="hidden lg:grid grid-cols-8 grid-rows-8 gap-2 py-4 h-[400px]">
        <div class="col-start-1 row-start-1 col-span-4 row-span-8">
          <img :src="space.images?.[0] || someImg" alt="Principal"
            class="h-full w-full object-cover rounded-lg shadow-md border cursor-pointer" @click="openImageModal(0)"
            @error="onImageError" />
        </div>

        <div v-for="(img, index) in space.images?.slice(1, 5) || [someImg, someImg, someImg, someImg]" :key="index"
          :class="imageGridPosition(index)">
          <img :src="img || someImg" alt="Espacio" class="h-full w-full rounded-lg shadow-md border object-cover"
            @click="openImageModal(index + 1)" @error="onImageError" />
        </div>
      </div>



      <!-- Modal -->
      <ImageModal v-if="!imageErrorOccurred" :visible="isImageModalOpen" :images="space.images"
        :startIndex="currentImageIndex" @close="isImageModalOpen = false" />


      <!-- Info general + Formulario -->
      <div class="w-full mx-auto grid grid-cols-1 lg:grid-cols-10 lg:gap-10">
        <!-- Información del espacio -->
        <!-- Información del espacio -->
        <div class="lg:col-span-6 bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">

          <!-- ★ Rating + Cantidad de reseñas -->
          <div class="flex flex-col items-center gap-2 pb-6 border-b border-white/10">
            <div class="flex gap-1 text-2xl text-yellow-400">
              <span v-for="v in avgRating ? Math.round(avgRating) : 5" :key="v">⭐</span>
            </div>

            <div class="flex items-center gap-2 text-gray-300 text-lg">
              <span>{{ totalReviews > 0 ? avgRating.toFixed(1) : '5.0' }}</span>
              <span class="cursor-pointer hover:underline hover:text-[#00B4D8]" @click="openReviews">
                ({{ totalReviews > 0 ? `${totalReviews} calificaciones` : "Sin calificaciones" }})
              </span>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="mt-6">
            <p class="text-2xl font-bold text-gray-200 tracking-wide">
              {{ space.location.split(',')[1] || '' }}
            </p>
            <p class="text-lg text-gray-400 font-medium">
              {{ space.location.split(',')[0] }}
            </p>
          </div>

          <!-- Vehículos y tarifas -->
          <div class="mt-6 grid sm:grid-cols-2 gap-4">
            <div v-for="v in space.vehicle_capacities" :key="v.type"
              class="p-5 bg-[#1B263B]/60 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <p class="font-semibold text-lg flex items-center gap-2 text-white">
                <font-awesome-icon :icon="['fas', getVehicleType(v.type)]" class="text-[#00B4D8] text-xl" />
                {{ getVehicleType(v.type) }}
              </p>

              <div v-if="v.price_per_hour"
                class="mt-2 inline-block bg-[#00B4D8]/20 text-[#00B4D8] font-medium px-3 py-1 rounded-full text-sm">
                ${{ v.price_per_hour.toLocaleString() }} / hora
              </div>
            </div>
          </div>

          <!-- Disponibilidad -->
          <div class="mt-10">
            <p class="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <font-awesome-icon icon="calendar-days" class="text-[#06D6A0] text-xl" />
              Disponibilidad:
            </p>

            <!-- Días disponibles -->
            <div class="flex flex-wrap gap-2 mt-2">

              <!-- Días particulares -->
              <template v-if="disponibilidad?.days?.length">
                <span v-for="(day, i) in disponibilidad.days" :key="i"
                  class="px-3 py-1 text-sm rounded-full bg-[#06D6A0]/20 border border-[#06D6A0]/30 text-[#06D6A0] font-medium">
                  {{ capitalizeDay(day) }}
                </span>
              </template>

              <!-- Disponible todos los días -->
              <template v-else>
                <span
                  class="inline-flex items-center gap-2 bg-[#06D6A0]/20 text-[#06D6A0] px-4 py-2 rounded-full font-medium shadow">
                  <font-awesome-icon icon="check-circle" />
                  Disponible todos los días
                </span>
              </template>
            </div>

            <!-- Horarios -->
            <div v-if="disponibilidad.start && disponibilidad.end"
              class="mt-4 inline-block px-4 py-2 bg-[#00B4D8]/20 border border-[#00B4D8]/30 text-[#00B4D8] rounded-xl font-medium text-sm">
              Horario: {{ disponibilidad.start }} - {{ disponibilidad.end }}
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
        <div v-else-if="!isLogged" class="col-span-10 lg:col-span-4 flex flex-col items-center justify-center p-8 
         bg-[#1B263B]/70 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 
         text-center order-5 lg:order-3 text-white">
          <font-awesome-icon icon="user-lock" class="text-5xl text-[#00B4D8] mb-4" />

          <h2 class="text-2xl font-bold text-[#06D6A0] mb-2">
            ¡Inicia sesión para reservar!
          </h2>

          <p class="text-gray-300 mb-6 max-w-[260px]">
            Debes estar autenticado para seleccionar un vehículo y completar tu reserva.
          </p>

          <router-link to="/login" class="px-6 py-3 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] 
           rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all font-semibold">
            Iniciar sesión
          </router-link>

          <router-link to="/login" class="mt-3 text-[#00B4D8] underline hover:text-[#06D6A0]">
            ¿No tienes cuenta? Regístrate aquí
          </router-link>
        </div>

        <!-- Descripción -->
        <section class="col-span-10 p-6 rounded-xl text-xl order-6 bg-[#1B263B]/60 backdrop-blur-xl 
         border border-white/10 shadow-xl text-white">
          <p class="font-semibold flex items-center gap-2 text-[#06D6A0]">
            <font-awesome-icon icon="info-circle" class="text-[#00B4D8]" />
            Descripción:
          </p>

          <p class="text-gray-300 font-medium mt-3 leading-relaxed">
            {{ space.description }}
          </p>
        </section>

        <!-- Mapa -->
        <div class="col-span-10 flex flex-col justify-start items-start h-[350px] order-7 p-4 
         rounded-xl bg-[#1B263B]/60 backdrop-blur-xl shadow-xl border border-white/10 
         relative overflow-hidden">
          <p class="px-2 font-semibold mb-2 text-white">Ubicación en el mapa:</p>

          <CustomGoogleMap :center="{ lat: Number(space.latitude), lng: Number(space.longitude) }" :locateUser="false"
            class="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg">
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

  <!-- ===== FOOTER ===== -->
  <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm">

      <!-- Branding -->
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold tracking-wide">HayLugar</span>
        <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
      </div>

      <!-- Links -->
      <div class="flex gap-6">
        <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
          Política de Privacidad
        </router-link>

        <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
          Términos y Condiciones
        </router-link>
      </div>

      <!-- Extra -->
      <div class="text-xs text-[#78909C]">
        Movilidad inteligente
      </div>
    </div>
  </footer>
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
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';

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
    const favorites = await spaceStore.fetchFavoriteSpaces()
    console.log(favorites);
    activedFavouriteIcon.value = await spaceStore.isFavorite(space.id)
  }
  console.log('Es favorito?', activedFavouriteIcon.value);
  console.log(space.images);
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
  await verifyToken();
  if (isSessionInvalid.value) return;

  try {
    const spaceId = space.value.id;
    const isFav = activedFavouriteIcon.value;

    console.log(spaceId, isFav);
    if (!isFav) {
      // AGREGAR
      activedFavouriteIcon.value = true;  // ← cambio instantáneo sin re-render global
      await addFavorite(spaceId);
      showToast("Agregado a mis favoritos", "success");

    } else {
      // ELIMINAR
      activedFavouriteIcon.value = false; // ← cambio instantáneo
      await removeFavorite(spaceId);
      showToast("Eliminado de mis favoritos", "info");
    }

    spaceStore.fetchFavoriteSpaces();

  } catch (err) {
    console.error(err);
    showToast("Error al actualizar favorito", "error");
  }
};

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
