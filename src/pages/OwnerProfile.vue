<template>

    <MainHeader />

    <!-- BOTÓN ATRÁS MOBILE -->
    <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
        <BackButton />
    </div>

    <!-- MENÚ INFERIOR MOBILE -->
    <MobileButtonNav @navigate="(p) => router.push(p)" class="md:hidden" :showMap="false" />

    <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] 
              text-white p-6 md:p-10">

        <section class="pt-20 md:pt-24 max-w-4xl mx-auto p-6 md:p-10">

            <!-- TÍTULO -->
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3">
                Perfil Anfitrión
            </h1>

            <!-- HEADER: FOTO + ESTADÍSTICAS -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">

                <!-- Foto -->
                <div class="relative group">
                    <img :src="user.profile_picture || defaultProfilePicture"
                        class="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-blue-200" />
                </div>

                <!-- Datos -->
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-200">
                        {{ user.name }} {{ user.last_name }}
                    </h2>

                    <div class="flex items-center gap-2 mt-2 text-gray-300">
                        <font-awesome-icon icon="fa-solid fa-star" class="text-yellow-400" />
                        <span class="text-white text-lg font-semibold">
                            {{ user.owner_rating?.toFixed(1) || '5.0' }}
                        </span>
                        <span class="text-gray-400 text-sm">/ 5</span>
                    </div>

                    <p class="text-gray-400 text-sm mt-1">
                        Anfitrión desde {{ formatDate(user.created_at) }}
                    </p>
                </div>

            </div>

            <!-- MÉTRICAS -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

                <div class="bg-white/5 rounded-xl border border-white/10 p-4 text-center shadow">
                    <p class="text-gray-300 text-sm">Reservas recibidas</p>
                    <h3 class="text-3xl font-bold text-newgreen mt-1">{{ metrics.reservas }}</h3>
                </div>

                <div class="bg-white/5 rounded-xl border border-white/10 p-4 text-center shadow">
                    <p class="text-gray-300 text-sm">Publicaciones activas</p>
                    <h3 class="text-3xl font-bold text-newgreen mt-1">{{ metrics.publicaciones }}</h3>
                </div>

                <div class="bg-white/5 rounded-xl border border-white/10 p-4 text-center shadow">
                    <p class="text-gray-300 text-sm">Ingresos totales</p>
                    <h3 class="text-3xl font-bold text-newgreen mt-1">${{ metrics.ingresos }}</h3>
                </div>

                <div class="bg-white/5 rounded-xl border border-white/10 p-4 text-center shadow">
                    <p class="text-gray-300 text-sm">Reseñas</p>
                    <h3 class="text-3xl font-bold text-newgreen mt-1">{{ metrics.reviews }}</h3>
                </div>

            </div>

            <!-- ATAJOS / ACCESOS RÁPIDOS -->
            <h2 class="mt-10 mb-4 text-xl font-semibold">Accesos rápidos</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div @click="goTo('owner/mypublications')" class="group cursor-pointer bg-white/5 p-5 rounded-xl border border-white/10
                 hover:bg-white/10 transition flex items-center gap-4 shadow-lg">
                    <font-awesome-icon icon="fa-solid fa-layer-group"
                        class="text-newgreen text-2xl group-hover:scale-110 transition" />
                    <div>
                        <p class="font-semibold text-white">Publicaciones activas</p>
                        <p class="text-gray-400 text-sm">Ver o editar tus espacios publicados</p>
                    </div>
                </div>

                <div @click="goTo('owner/reservation-incoming')" class="group cursor-pointer bg-white/5 p-5 rounded-xl border border-white/10
                 hover:bg-white/10 transition flex items-center gap-4 shadow-lg">
                    <font-awesome-icon icon="fa-solid fa-calendar-check"
                        class="text-newgreen text-2xl group-hover:scale-110 transition" />
                    <div>
                        <p class="font-semibold text-white">Reservas entrantes</p>
                        <p class="text-gray-400 text-sm">Confirma, rechaza o revisa próximas reservas</p>
                    </div>
                </div>

            </div>

            <!-- EXPERIENCIA / RESEÑAS -->
            <h2 class="mt-10 mb-4 text-xl font-semibold flex items-center gap-2">
                Experiencia como anfitrión
                <font-awesome-icon icon="fa-solid fa-comments" class="text-newgreen" />
            </h2>

            <UserReviews :reviews="hostReviews" />

        </section>

    </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';

import MainHeader from '../components/layout/header/MainHeader.vue';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import BackButton from '../components/common/BackButton.vue';
import UserReviews from '../components/pages/profilePage/UserReviews.vue';

import defaultProfilePicture from '../assets/user_icon_primary.png';
import api from '../services/apiService';
import { getReviewsByUser } from '../services/reviewService';
import { WalletApi } from '../services/walletApi';

const router = useRouter();
const userStore = useUserStore();

const user = computed(() => userStore.user);

const metrics = ref({
    reservas: 0,
    publicaciones: 0,
    ingresos: 0,
    reviews: 0
});

const hostReviews = ref([]);

const goTo = (section) => {
    router.push(`/${section}`);
};

const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

onMounted(async () => {
    try {
        const id = user.value.id;

        const [reserv, pubs, rev, wall] = await Promise.all([
            api.get(`/reservations/incoming/${id}`),
            api.get('/spaces/myspaces'),
            await getReviewsByUser(id),
            await WalletApi.summary(id)
        ]);

        console.log(wall);

        metrics.value = {
            reservas: reserv.data.length ?? 0,
            publicaciones: pubs.data.length ?? 0,
            reviews: rev.length ?? 0,
            ingresos: wall.data.balance ?? 0
        };

        hostReviews.value = rev ?? [];
    } catch (e) {
        console.error("Error cargando datos del host:", e);
    }
});
</script>
