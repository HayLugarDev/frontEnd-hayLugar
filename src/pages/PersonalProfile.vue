<template>
    
    <MainHeader />

    <div class="w-full flex justify-end p-4 sm:hidden absolute top-0 left-0 z-50">
        <BackButton />
    </div>

    <!-- MENÚ INFERIOR MOBILE -->
    <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

    <div
        class="min-h-screen bg-gradient-to-br py-10 sm:p-8 from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] pt-16 md:px-6 md:py-10 text-white">
        
        <section class="pt-10 md:pt-16 max-w-4xl mx-auto p-6">

            <!-- Título -->
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3">
                Perfil
            </h1>

            <!-- Información del Usuario -->
            <div class="space-y-6">
                <div class="flex flex-col items-center text-center gap-4">

                    <!-- Foto de perfil -->
                    <div class="relative group">
                        <img :src="user.profile_picture || defaultProfilePicture" alt="Foto de perfil"
                            class="w-32 h-32 md:w-32 md:h-32 object-cover rounded-full shadow-lg ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all cursor-pointer"
                            @click="changePhoto" />
                        <button @click="changePhoto"
                            class="absolute -bottom-2 right-2 bg-primary bg-opacity-80 text-white p-2 rounded-full shadow-md hover:bg-newgreen transition"
                            title="Cambiar foto">
                            <font-awesome-icon icon="camera" />
                        </button>
                    </div>
                    <span class="
                        text-gray-100 text-sm border-4 border-newgreen
                        bg-[#2b4941c2] px-10 p-3 rounded-full mt-1 flex flex-row gap-2 items-center">
                        <div class="flex flex-row gap-2 items-center font-normal text-base">
                            <h1 v-if="user.role === 'admin'">{{ capitalizeFirst(user.role) }}</h1>
                            <h1 v-else>Usuario</h1>
                            <h1>|</h1>
                            <h1>Cuenta n° {{ user.id }}</h1>
                        </div>
                    </span>
                </div>

                <!-- DATOS DEL PERFIL -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <ProfileField label="Nombre" :value="`${user.name} ${user.last_name ?? ''}`" :editable="false" />

                    <ProfileField label="Correo" :value="user.email ?? 'No registrado'" :editable="false" />

                    <ProfileField label="N° de documento" :value="user.dni ?? 'No registrado'" icon="fa-solid fa-plus"
                        :editable="false" @action="openEditModal" />

                    <ProfileField label="Teléfono" :value="user.phone ?? 'No registrado'" icon="fa-solid fa-phone"
                        :showPlus="!user.phone" :editable="true" @action="openEditModal" />

                    <ProfileField label="Domicilio" :value="user.address" icon="fa-solid fa-plus" :editable="true"
                        @action="openEditModal" />

                    <div class="bg-white/5 p-4 rounded-xl border border-white/10" v-if="user.renter_rating">
                        <p class="text-sm text-gray-300">Calificación como Usuario</p>
                        <p class="text-yellow-400 font-semibold text-lg">
                            ⭐ <span class="text-white">{{ user.renter_rating.toFixed(1) }}</span>
                        </p>
                    </div>

                </div>

                <!-- RATING (si es owner o renter) -->
                <!-- <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                    <div class="bg-white/5 p-4 rounded-xl border border-white/10" v-if="user.owner_rating">
                        <p class="text-sm text-gray-300">Calificación como Anfitrión</p>
                        <p class="text-yellow-400 font-semibold text-lg">
                            ⭐ <span class="text-white">{{ user.owner_rating.toFixed(1) }}</span>
                        </p>
                    </div>

                    <div class="bg-white/5 p-4 rounded-xl border border-white/10" v-if="user.renter_rating">
                        <p class="text-sm text-gray-300">Calificación como Usuario</p>
                        <p class="text-yellow-400 font-semibold text-lg">
                            ⭐ <span class="text-white">{{ user.renter_rating.toFixed(1) }}</span>
                        </p>
                    </div>

                </div> -->

                <!-- FECHAS DE CREACIÓN Y ACTUALIZACIÓN -->
                <div class="bg-white/5 p-4 rounded-xl border border-white/10 mt-6 text-sm text-gray-300">
                    <p>Usuario desde: <span class="font-medium text-white">{{ formatDate(user.created_at) }}</span></p>
                    <p>Última actualización: <span class="font-medium text-white">{{ formatDate(user.updated_at)
                    }}</span></p>
                </div>
            </div>
        </section>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />

    <!-- MODAL DE EDICIÓN -->
    <TextInputModal v-model:modelValue="showEditModal" v-model:model="newValue" :title="`Editar ${fieldToEdit}`"
        :placeholder="`Ingrese nuevo ${fieldToEdit.toLowerCase()}`" @save="saveField" />

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../store/userStore';
import { capitalizeFirst } from '../utils/capitalizeFirstCharAt';
import MainHeader from '../components/layout/header/MainHeader.vue';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import BackButton from '../components/common/BackButton.vue';
import defaultProfilePicture from '../assets/user_icon_primary.png';
import { updateAuthenticatedUser, updateUserPhoto } from '../services/userService';
import { showToast } from '../utils/toast';
import ProfileField from '../components/pages/profilePage/UI/ProfileField.vue';
import TextInputModal from '../components/common/TextInputModal.vue';

const router = useRouter();
const route = useRoute();

// Simulación - este objeto vendría de Vuex/Pinia o del backend
const userStore = useUserStore();

const user = computed(() => userStore.user || {
    id: "",
    profile_picture: defaultProfilePicture,
    name: "",
    last_name: "",
    email: "",
    dni: "",
    address: "",
    phone: "",
    role: "",
    owner_rating: 0,
    renter_rating: 0,
    created_at: null,
    updated_at: null,
});

const showEditModal = ref(false);
const fieldToEdit = ref("");
const newValue = ref("");

const openEditModal = (label) => {
    fieldToEdit.value = label;
    newValue.value = "";
    showEditModal.value = true;
};

const saveField = async () => {
    try {
        const fieldMap = {
            "Teléfono": "phone",
            "N° de documento": "dni",
            "Domicilio": "address"
        };

        const field = fieldMap[fieldToEdit.value];

        if (!field) return;

        const updatedUser = await updateAuthenticatedUser({
            id: user.value.id,
            [field]: newValue.value
        });

        userStore.setUser(updatedUser); // Actualizamos Pinia

        showToast(`${fieldToEdit.value} actualizado.`, "success");
    } catch (err) {
        console.error(err);
        showToast("Error al actualizar.", "error");
    }

    showEditModal.value = false;
};

const fileInput = ref(null);

const changePhoto = () => {
    fileInput.value.click();
};

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const updatedUser = await updateUserPhoto(user.id, file);
        userStore.setUser(updatedUser);
        showToast("Foto de perfil actualizada con éxito.", "success");
    } catch (error) {
        console.error("Error al cambiar la foto de perfil:", error);
        showToast("Error al cambiar la foto de perfil. Por favor, intenta nuevamente.", "error");
    }
};

onMounted(() => {
    console.log(user.value);
});


const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>
