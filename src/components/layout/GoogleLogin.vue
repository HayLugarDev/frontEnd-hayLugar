<template>
    <button @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-2 border border-gray-300 mt-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5" />
        Ingresar con Google
    </button>
</template>

<script setup>
import { apiBaseUrl } from "../../services/apiService";

const loginWithGoogle = () => {
    window.location.href = `${apiBaseUrl}/auth/google`;
};
</script>