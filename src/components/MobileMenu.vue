<template>
    <div class="absolute w-full bottom-0 bg-gray-900 md:hidden text-3xl flex flex-row items-center justify-around p-4 text-gray-300">
        <font-awesome-icon :icon="['fas', 'user']" @click.stop="isLogged" />
        <transition name="icon-fade" mode="out-in">
            <font-awesome-icon @click="$emit('toggle')" :key="isMapShown" :icon="['fas', isMapShown ? 'list' : 'map-location-dot']"
                class="transition-transform duration-300 transform" />
        </transition>
        <font-awesome-icon @click="verifyToken('/add-space')" :icon="['fas', 'plus']" />
    </div>
    <SessionExpired :sessionExpired="isSessionInvalid" />
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from 'vue';
import { useVerifyToken } from '../logic/useVerifyToken';
import SessionExpired from "./SessionExpired.vue";
import { verifyActiveSession } from "../middleware/verifyToken";

const route = useRoute();
const router = useRouter();
const isMapShown = computed(() => props.showMap);

const { verifyToken, isSessionInvalid } = useVerifyToken();

defineEmits(['toggle']);

const props = defineProps({
    showMap: Boolean,
});

const isLogged = async () => {
    const session = await verifyActiveSession();
    if (session) {
        return verifyToken('/profile');
    } else {
        return router.push('/login');
    }
}
</script>