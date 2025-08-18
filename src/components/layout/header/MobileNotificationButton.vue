<template>
    <div v-if="userStore.user" class="relative" @click="router.push('/profile')">
        <font-awesome-icon icon="bell" /> Notificaciones
        <span v-if="hasNotifications && !viewNotification"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping">
        </span>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../store/userStore';
import router from '../../../router';
import { useNotifications } from '../../../logic/useNotifications';

const userStore = useUserStore();
const showNotificationBubble = ref(false);
const viewNotification = ref(false);

const notifications = computed(() => userStore.notifications);
const hasNotifications = computed(() => notifications.value.length > 0);

useNotifications();

watch(
    () => userStore.notifications.length,
    (newVal) => {
        if (newVal > 0) {
            showNotificationBubble.value = true;

            setTimeout(() => {
                showNotificationBubble.value = false;
            }, 4000); // Oculta el globo tras 4 segundos
        }
    }
);
</script>