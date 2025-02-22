<template>
    <div class="flex flex-col min-h-screen bg-secondary p-6">
      <h1 class="text-3xl font-bold text-primary">Mi Perfil</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 class="text-lg font-semibold mb-4">Información Personal</h2>
        <div class="flex items-center gap-4">
          <img :src="usuario.foto" alt="Perfil" class="w-20 h-20 object-cover rounded-full shadow-md" />
          <input type="file" @change="subirFoto" class="hidden" ref="inputFoto" />
          <button @click="cambiarFoto" class="bg-gray-200 px-4 py-2 rounded-md">📷 Cambiar Foto</button>
        </div>
        
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="usuario.nombre" type="text" placeholder="Nombre" class="border p-2 rounded w-full" />
          <input v-model="usuario.apellido" type="text" placeholder="Apellido" class="border p-2 rounded w-full" />
          <input v-model="usuario.email" type="email" placeholder="Correo Electrónico" class="border p-2 rounded w-full" />
          <input v-model="usuario.dni" type="text" placeholder="DNI" class="border p-2 rounded w-full" />
          <input v-model="usuario.direccion" type="text" placeholder="Dirección" class="border p-2 rounded w-full" />
          <input v-model="usuario.telefono" type="text" placeholder="Teléfono" class="border p-2 rounded w-full" />
        </div>
        <button @click="guardarCambios" class="mt-6 w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
          Guardar Cambios
        </button>
      </div>
      
      <!-- Historial de Reservas -->
      <div class="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 class="text-lg font-semibold mb-4">Historial de Reservas</h2>
        <ul v-if="reservas.length">
          <li v-for="(reserva, index) in reservas" :key="index" class="p-4 border-b">
            <p><strong>Ubicación:</strong> {{ reserva.ubicacion }}</p>
            <p><strong>Fecha:</strong> {{ reserva.fecha }}</p>
            <p><strong>Total Pagado:</strong> ${{ reserva.total }}</p>
          </li>
        </ul>
        <p v-else class="text-gray-500">No tienes reservas anteriores.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const usuario = ref({
    foto: "https://source.unsplash.com/100x100/?person,avatar",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juanperez@email.com",
    dni: "12345678",
    direccion: "Av. Principal 123",
    telefono: "+54 9 11 1234 5678"
  });
  
  const reservas = ref([
    { ubicacion: "Calle 123, San Miguel", fecha: "2025-03-10", total: 500 },
    { ubicacion: "Av. Siempre Viva", fecha: "2025-04-01", total: 750 }
  ]);
  
  const cambiarFoto = () => {
    document.querySelector('input[type=file]').click();
  };
  
  const subirFoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      usuario.value.foto = URL.createObjectURL(file);
    }
  };
  
  const guardarCambios = () => {
    alert("Cambios guardados con éxito");
  };
  </script>
  