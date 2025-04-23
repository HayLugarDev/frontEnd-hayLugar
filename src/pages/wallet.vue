<template>
    <div class="min-h-screen bg-secondary p-6" v-if="!loading">
      <section class="bg-white p-6 rounded-lg shadow-lg mb-8">
        <!-- Header -->
        <h2 class="text-2xl font-semibold text-primary mb-4 flex items-center">
          <font-awesome-icon icon="wallet" class="mr-2" />
          Mi Billetera
        </h2>
  
        <!-- Saldo -->
        <div class="mb-6">
          <span class="block text-gray-500">Saldo actual</span>
          <span class="text-4xl font-bold text-green-600">${{ balance.toFixed(2) }}</span>
        </div>
  
        <!-- Botón Retirar fondos -->
        <div class="mb-6">
          <button
            @click="withdrawFunds"
            class="flex items-center bg-accent text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <font-awesome-icon icon="arrow-down" class="mr-2" />
            Retirar fondos
          </button>
        </div>
  
        <!-- Historial de Transacciones -->
        <div>
          <h3 class="text-xl font-semibold text-primary mb-2">Últimas Transacciones</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="p-2">Fecha</th>
                  <th class="p-2">Tipo</th>
                  <th class="p-2">Monto</th>
                  <th class="p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="tx in transactions"
                  :key="tx.id"
                  class="border-b"
                >
                  <td class="p-2">{{ formatDate(tx.created_at) }}</td>
                  <td class="p-2 capitalize">{{ tx.transaction_type }}</td>
                  <td
                    class="p-2"
                    :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ tx.amount >= 0 ? '+' : '-' }}${{ Math.abs(tx.amount).toFixed(2) }}
                  </td>
                  <td class="p-2 capitalize">{{ tx.status }}</td>
                </tr>
                <tr v-if="transactions.length === 0">
                  <td colspan="4" class="p-4 text-center text-gray-500">
                    Sin movimientos recientes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  
    <!-- Loader mientras carga el usuario y la wallet -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <img :src="loadIcon" alt="Cargando..." class="w-16 h-16 animate-spin" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useUserStore } from '../store/userStore'
  import api from '../services/apiService'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import loadIcon from '../assets/load-icon_primary.svg'
  
  const userStore = useUserStore()
  
  // Estado local
  const balance = ref<number>(0)
  const transactions = ref<Array<{
    id: number
    transaction_type: string
    amount: number
    status: string
    created_at: string
  }>>([])
  
  const loading = computed(() => userStore.loading)
  
  // Formatea la fecha
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString()
  }
  
  // Carga balance y transacciones
  async function loadWallet() {
    if (!userStore.user) {
      await userStore.fetchUser()
    }
    const userId = userStore.user?.id
    if (!userId) {
      console.error('Usuario no autenticado')
      return
    }
  
    try {
      // Obtener balance
      const resBal = await api.get(`/wallet/${userId}/balance`)
      balance.value = resBal.data.balance
  
      // Obtener últimas transacciones
      const resTx = await api.get(`/wallet/${userId}/transactions?limit=5`)
      transactions.value = resTx.data
    } catch (e) {
      console.error('Error al cargar billetera:', e)
    }
  }
  
  // Acción de retirar fondos
  async function withdrawFunds() {
    // Aquí puedes abrir un modal o navegar a la ruta de retiro
    alert('Función de retirar fondos pendiente de implementación')
  }
  
  onMounted(loadWallet)
  </script>
  
  <style scoped>
  /* Todo el estilo está en Tailwind; no se requieren ajustes extra */
  </style>
  