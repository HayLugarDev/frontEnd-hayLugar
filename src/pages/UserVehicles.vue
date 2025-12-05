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

        <section class="pt-20 md:pt-24 max-w-4xl mx-auto p-6">

            <!-- Título -->
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                    Vehículos
                    <font-awesome-icon icon="fa-solid fa-car" class="text-primary" />
                </h1>
            </div>

            <p class="text-gray-300 mb-8">
                Gestioná tus vehículos para realizar reservas en HayLugar.
            </p>

            <!-- Loading -->
            <div v-if="cargando" class="space-y-4">
                <ItemSkeleton />
                <ItemSkeleton />
            </div>

            <!-- Acciones -->

            <div class="flex flex-wrap gap-3 justify-end mb-6">

                <button @click="router.push('/add-vehicle')"
                    class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow hover:bg-primary/90 transition-all">
                    <font-awesome-icon :icon="['fas', 'circle-plus']" />
                    Agregar
                </button>

                <button v-if="!modoEdicion" @click="modoEdicion = true"
                    class="flex items-center gap-2 bg-newgreen/50 hover:bg-newgreen/30 text-white px-4 py-2 rounded-xl shadow transition-all">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                    Editar
                </button>

                <button v-else @click="guardarVehiculos"
                    class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition-all">
                    <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                    Guardar
                </button>
            </div>

            <!-- Lista de vehículos -->
            <div v-if="vehiculos.length" class="space-y-4">
                <div v-for="(vehiculo, index) in vehiculos" :key="index"
                    class="rounded-2xl p-5 shadow-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <!-- Vista normal -->
                    <div v-if="!modoEdicion" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div v-for="(item, i) in [
                            { icon: 'car-side', label: 'Tipo', value: vehicleLabel(vehiculo.type) },
                            { icon: 'rectangle-list', label: 'Modelo', value: vehiculo.model || 'No especificado' },
                            { icon: 'palette', label: 'Color', value: vehiculo.color || 'No especificado' },
                            { icon: 'id-card', label: 'Patente', value: vehiculo.license_plate || 'No aplica' }
                        ]" :key="i" class="flex items-center gap-3 p-4 bg-white/10 border-white/10 rounded-xl border">
                            <div class="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                                <font-awesome-icon :icon="item.icon" class="text-newgreen text-md" />
                            </div>

                            <div class="flex flex-col">
                                <span class="text-sm text-gray-200 font-medium">{{ item.label }}</span>
                                <span class="text-base font-semibold text-gray-100">{{ item.value }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Edición -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="flex flex-col">
                            <label class="text-md font-semibold mb-1">Tipo</label>
                            <select v-model="vehiculo.type"
                                class="rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary/50 bg-gray-900">
                                <option disabled value="">Seleccione un tipo</option>
                                <option v-for="option in vehicleTypes" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <FormFieldVehicle v-model="vehiculo.model" label="Modelo" />
                        <FormFieldVehicle v-model="vehiculo.color" label="Color" />
                        <FormFieldVehicle v-model="vehiculo.license_plate" label="Patente" />
                    </div>
                </div>
            </div>

            <!-- Sin vehículos -->
            <div v-else-if="!cargando" class="text-center text-gray-400 mt-10">
                <div class="bg-primary/10 p-4 rounded-full inline-block mb-3">
                    <font-awesome-icon icon="car" class="text-primary text-3xl" />
                </div>
                <p class="text-lg font-medium">No tenés vehículos registrados.</p>

                <button @click="router.push('/add-vehicle')"
                    class="flex items-center gap-2 mx-auto mt-4 text-primary font-semibold bg-white/10 px-4 py-2 rounded-xl shadow hover:bg-white/20 transition-all">
                    <font-awesome-icon :icon="['fas', 'circle-plus']" />
                    ¡Agregá tu primer vehículo!
                </button>
            </div>
        </section>
    </div>

    <StatusModal :visible="showSuccessModal" type="success" title="¡Éxito!"
      message="Cambios guardados correctamente" :icon="logo" @confirm="showSuccessModal = false" />

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllVehicles } from "../services/vehicleService";
import vehicleLabel from "../logic/useVehicleLabel";
import api from "../services/apiService";

import MainHeader from "../components/layout/header/MainHeader.vue";
import MobileButtonNav from "../components/layout/MobileButtonNav.vue";
import BackButton from "../components/common/BackButton.vue";
import FormFieldVehicle from "../components/forms/FormFieldVehicle.vue";
import ItemSkeleton from "../components/layout/skeletons/ItemSkeleton.vue";
import StatusModal from "../components/pages/addSpacePage/StatusModal.vue";

const router = useRouter();

const vehiculos = ref([]);
const cargando = ref(true);
const modoEdicion = ref(false);

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");

const vehicleTypes = [
    { value: "car", label: "Auto" },
    { value: "van", label: "Camioneta" },
    { value: "motorcycle", label: "Moto" },
    { value: "bicycle", label: "Bicicleta" },
];

const fetchVehicles = async () => {
    try {
        const vehicles = await getAllVehicles();
        vehiculos.value = vehicles ?? [];
    } catch (e) {
        console.error(e);
        errorMessage.value = "No se pudieron cargar los vehículos.";
        showErrorModal.value = true;
    } finally {
        cargando.value = false;
    }
};

onMounted(fetchVehicles);

const guardarVehiculos = async () => {
    const invalidos = vehiculos.value.filter((v) => {
        const requierePatente =
            v.type === "car" || v.type === "van" || v.type === "motorcycle";
        return requierePatente && (!v.license_plate || v.license_plate.trim() === "");
    });

    if (invalidos.length) {
        errorMessage.value =
            "Debes registrar la patente si el tipo de vehículo lo requiere.";
        showErrorModal.value = true;
        return;
    }

    try {
        await Promise.all(
            vehiculos.value.map((vehiculo) =>
                api.put(`/vehicles/${vehiculo.id}`, vehiculo, { withCredentials: true })
            )
        );
        modoEdicion.value = false;
        showSuccessModal.value = true;
    } catch (e) {
        console.error(e);
        errorMessage.value = "No se pudo guardar.";
        showErrorModal.value = true;
    }
};

const closeSuccessModal = () => (showSuccessModal.value = false);
const closeErrorModal = () => (showErrorModal.value = false);
</script>

<style scoped>
section {
    animation: fadeIn 0.35s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
