<template>
    <transition name="fade">
        <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
                <div class="flex flex-col items-center">
                    <img v-if="icon" :src="icon" alt="icono" class="w-20 h-20 mb-4" />
                    <h2 :class="['text-3xl font-bold mb-2', type === 'error' ? 'text-red-600' : 'text-primary']">
                        {{ title }}
                    </h2>
                    <p class="text-lg text-gray-700 text-center mb-6">{{ message }}</p>
                    <button @click="$emit('close')"
                        class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        {{ buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    visible: Boolean,
    type: {
        type: String,
        default: 'success', // success | error | info
    },
    title: String,
    message: String,
    icon: String,
    buttonText: {
        type: String,
        default: 'Aceptar',
    },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
