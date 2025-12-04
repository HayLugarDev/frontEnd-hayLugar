<template>
  <div class="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-dark text-white">

    <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
      <BackButton />
    </div>

    <MainHeader />

    <!-- Hero -->
    <section class="py-16 px-6 text-center max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes (FAQ)</h1>
      <p class="text-gray-300 text-base md:text-lg">
        Todo lo que necesitás saber sobre <span class="font-semibold">HayLugar</span> —
        cómo funciona, cómo ganar dinero con tu espacio y cómo moverte mejor por la ciudad.
      </p>
    </section>

    <!-- Sección FAQ -->
    <section class="bg-white text-gray-800 rounded-t-3xl shadow-2xl py-10 px-6 md:px-10">
      <div class="max-w-3xl mx-auto divide-y divide-gray-200">
        <!-- Categorías -->
        <div v-for="(category, i) in faqs" :key="i" class="py-8">
          <h2 class="text-xl font-bold text-primary flex items-center gap-2 mb-4">
            <span>{{ category.icon }}</span> {{ category.title }}
          </h2>

          <div class="space-y-4">
            <div v-for="(item, j) in category.items" :key="j"
              class="border border-gray-200 rounded-xl shadow-sm bg-gray-50 overflow-hidden">
              <button @click="toggle(category.title + j)"
                class="w-full flex justify-between items-center p-4 text-left focus:outline-none">
                <span class="font-medium">{{ item.q }}</span>
                <svg :class="[
                  'w-5 h-5 transform transition-transform duration-300',
                  opened === category.title + j ? 'rotate-180 text-accent' : 'rotate-0 text-gray-400'
                ]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <transition name="fade">
                <div v-if="opened === category.title + j" class="px-5 pb-4 text-gray-700 text-sm leading-relaxed">
                  <p v-html="item.a"></p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MainHeader from '../components/layout/header/MainHeader.vue'
import BackButton from '../components/common/BackButton.vue'

const opened = ref(null)
const toggle = (key) => (opened.value = opened.value === key ? null : key)

const faqs = [
  {
    title: 'Sobre HayLugar',
    icon: 'ℹ️',
    items: [
      {
        q: '¿Qué es HayLugar?',
        a: 'HayLugar es una plataforma que conecta a personas que buscan estacionamiento con quienes tienen espacios disponibles —cocheras, garajes, playas o estacionamientos institucionales— para facilitar el estacionamiento urbano, reducir el tiempo de búsqueda y generar ingresos para los propietarios.',
      },
      {
        q: '¿Dónde está disponible?',
        a: 'Actualmente HayLugar puede ser utilizado en toda la Argentina a través de su sitio web oficial: <a href="https://haylugar.com.ar" target="_blank" class="text-primary font-semibold underline">haylugar.com.ar</a>. La app está en desarrollo y se lanzará próximamente.',
      },
      {
        q: '¿Qué necesito para usarla?',
        a: 'Solo debés crear una cuenta y elegir si querés buscar un lugar para estacionar o publicar tu espacio disponible. En el futuro, las mismas funciones estarán disponibles en la app móvil.',
      },
    ],
  },
  {
    title: '🚗 Conductores (Usuarios que buscan estacionamiento)',
    icon: '🚗',
    items: [
      { q: '¿Cómo busco un lugar para estacionar?', a: 'Desde la web, ingresá al mapa, seleccioná la zona donde querés estacionar y verás los espacios disponibles en tiempo real. Podés reservar y pagar directamente desde la plataforma.' },
      { q: '¿Puedo reservar con anticipación?', a: 'Sí. En algunos espacios se puede reservar con anticipación; en otros, solo se muestran los lugares disponibles en tiempo real.' },
      { q: '¿Cómo se realiza el pago?', a: 'Actualmente, el pago se realiza a través de MercadoPago, utilizando tarjetas de débito o crédito directamente desde la plataforma.' },
      { q: '¿Qué pasa si tengo un problema con la reserva o el lugar?', a: 'Podés reportar cualquier inconveniente desde la plataforma web. Nuestro equipo revisará el caso y te dará una respuesta o gestión de reembolso según corresponda.' },
    ],
  },
  {
    title: '🏠 Anfitriones (Usuarios que ofrecen espacios)',
    icon: '🏠',
    items: [
      { q: '¿Cómo publico mi cochera o espacio?', a: 'Desde tu perfil, seleccioná “Publicar espacio”. Completá los datos (dirección, horario, precio y disponibilidad). Una vez validado, tu lugar quedará visible para los conductores.' },
      { q: '¿Cuánto puedo ganar alquilando mi espacio?', a: 'Vos definís el precio por hora, día o periodo. Los ingresos se acreditan en tu cuenta y podrás retirarlos según las condiciones establecidas.' },
      { q: '¿Puedo pausar o eliminar mi publicación?', a: 'Sí. En cualquier momento podés editar, pausar o eliminar tu espacio desde tu panel de anfitrión.' },
      { q: '¿Hay comisiones?', a: 'HayLugar aplica una comisión por transacción (porcentaje sobre el monto cobrado al conductor), que se informa antes de cada operación. Este cargo cubre los costos de operación y servicio de la plataforma.' },
    ],
  },
  {
    title: '🅿️ Estacionamientos institucionales y medido',
    icon: '🅿️',
    items: [
      { q: '¿Puedo usar HayLugar en estacionamientos públicos o de instituciones?', a: 'Sí. Algunas instituciones (como universidades, empresas o municipios) utilizan HayLugar para administrar sus estacionamientos. En esos casos, la app permite el ingreso y control digital de usuarios habilitados.' },
      { q: '¿Cómo funciona en zonas de estacionamiento medido?', a: 'La web muestra las zonas habilitadas y su disponibilidad estimada. Podés pagar el estacionamiento desde la app y ver el tiempo restante de tu estadía.' },
    ],
  },
  {
    title: '🔒 Seguridad y soporte',
    icon: '🔒',
    items: [
      { q: '¿HayLugar verifica los espacios publicados?', a: 'Sí. Todos los anfitriones deben validar su identidad y los datos del espacio antes de que la publicación se active. Además, los usuarios pueden dejar valoraciones que ayudan a mantener la calidad del servicio.' },
      { q: '¿Qué medidas de seguridad tiene la app?', a: 'Usamos tecnología segura para procesar pagos y proteger tus datos. Además, trabajamos con protocolos de encriptación y políticas de privacidad conforme a la legislación vigente.' },
      { q: '¿Qué pasa con mis datos personales?', a: 'Tus datos se usan exclusivamente para brindarte el servicio. Podés consultar nuestra <a href="#" class="text-primary font-semibold underline">Política de Privacidad</a> y <a href="#" class="text-primary font-semibold underline">Política de Cookies</a> en el sitio web.' },
    ],
  },
  {
    title: '⚙️ Cuenta y soporte',
    icon: '⚙️',
    items: [
      { q: '¿Cómo elimino mi cuenta?', a: 'Podés solicitar la eliminación de tu cuenta desde el perfil o escribiendo a <a href="mailto:apphaylugar@gmail.com" class="text-primary font-semibold">apphaylugar@gmail.com</a>. Una vez procesada la solicitud, tus datos se eliminarán según la Política de Privacidad.' },
      { q: '¿A dónde puedo comunicarme si tengo dudas o necesito ayuda?', a: 'Podés escribirnos a <a href="mailto:apphaylugar@gmail.com" class="text-primary font-semibold">apphaylugar@gmail.com</a> o contactarnos a través del formulario de ayuda disponible en la web.' },
    ],
  },
  {
    title: '🧾 Términos, cambios y actualizaciones',
    icon: '🧾',
    items: [
      { q: '¿Pueden cambiar los Términos y Condiciones?', a: 'Sí. HayLugar puede actualizar los Términos y Condiciones. Los usuarios nuevos deben aceptarlos al registrarse, y los existentes serán notificados al iniciar sesión; si no los aceptan, no podrán operar hasta hacerlo.' },
    ],
  },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
