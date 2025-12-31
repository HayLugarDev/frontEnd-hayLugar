<template>

  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">

    <!-- SAFE AREA -->
    <div class="safe-top"></div>

    <!-- CONTENIDO REAL -->
    <div class="px-6 py-3 sm:py-4 xl:px-16
           flex items-center justify-between gap-6 text-white">

      <BackButton />
    </div>
  </div>

  <div class="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-dark text-white pt-10 md:pt-16">
    <!-- Header -->
    <section class="py-16 px-6 text-center max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones de Uso</h1>
      <p class="text-gray-300">Última actualización: <span class="font-semibold">10/10/2025</span></p>
      <p class="text-gray-300 mt-2 text-sm">
        Este documento forma parte integral de la
        <RouterLink to="/PrivacyPolicy" class="text-accent underline">Política de Privacidad</RouterLink>
        y la
        <RouterLink to="/cookies" class="text-accent underline">Política de Cookies</RouterLink>
        de HayLugar.
      </p>
    </section>

    <!-- Contenido -->
    <section class="bg-white text-gray-800 rounded-t-3xl shadow-2xl py-12 px-6 md:px-10">
      <div class="max-w-4xl mx-auto space-y-10 leading-relaxed">

        <p>
          <strong>HayLugar</strong> es una plataforma operada por <strong>FOUNDAR S.A.S.</strong>
          (CUIT <em>30-71910647-8</em>, domicilio legal <em>[Congreso 851 Piso 11, San Miguel de Tucumán,
            Argentina]</em>).
          Al acceder o utilizar la plataforma, el usuario acepta plenamente estos Términos.
        </p>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">1. Definiciones</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li><strong>Plataforma:</strong> HayLugar, sitio web y app que conecta Usuarios y Anfitriones.</li>
            <li><strong>Empresa:</strong> FOUNDAR S.A.S., titular de la Plataforma.</li>
            <li><strong>Anfitrión:</strong> quien ofrece un espacio de estacionamiento.</li>
            <li><strong>Usuario:</strong> quien busca o reserva un espacio.</li>
            <li><strong>Servicio:</strong> intermediación tecnológica y procesamiento de pagos.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">2. Objeto y Alcance</h2>
          <p>
            La Plataforma conecta Usuarios con Anfitriones. HayLugar no es propietaria ni responsable de los espacios
            ofrecidos
            y no garantiza disponibilidad, condiciones ni seguridad. El contrato se celebra directamente entre Usuario y
            Anfitrión.
          </p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">3. Registro y Cuentas</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li>Solo mayores de 18 años y con plena capacidad legal pueden registrarse.</li>
            <li>El usuario debe aportar información veraz y mantener la confidencialidad de sus credenciales.</li>
            <li>HayLugar podrá suspender cuentas ante incumplimientos o fraudes.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">4. Rol de HayLugar</h2>
          <p>Actúa únicamente como intermediario tecnológico entre Usuarios y Anfitriones. No administra los espacios ni
            garantiza su calidad, seguridad o legalidad.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">5. Condiciones Económicas</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li>Registro y publicación gratuitos.</li>
            <li>Comisión de servicio: <strong>20 %</strong> del Precio del Anfitrión.</li>
            <li>Pagos procesados por <strong>Mercado Pago</strong>; HayLugar no almacena datos de tarjeta.</li>
            <li>FOUNDAR S.A.S. emite comprobante fiscal por el cargo de servicio.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">6. Reservas y Pagos</h2>
          <p>Las reservas se efectúan exclusivamente en la Plataforma. Se confirman una vez aprobado el pago por Mercado
            Pago.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">7. Cancelaciones y Reembolsos</h2>
          <p>Cancelaciones con más de 12 h de anticipación → reembolso total. Dentro de las 12 h previas → puede
            aplicarse penalidad según política del anuncio.</p>
          <p>Si el Anfitrión cancela, el Usuario recibe reembolso completo.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">8. Responsabilidad</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li>El Anfitrión garantiza condiciones y disponibilidad de su espacio.</li>
            <li>El Usuario usa el espacio bajo su exclusiva responsabilidad.</li>
            <li>HayLugar no es responsable por daños o incumplimientos derivados del uso del espacio.</li>
            <li>No se incluyen seguros ni coberturas automáticas.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">9. Opiniones y Calificaciones</h2>
          <p>Los usuarios pueden opinar con respeto y veracidad. HayLugar podrá eliminar contenido ofensivo, falso o
            difamatorio.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">10. No Discriminación y Conducta</h2>
          <p>Prohibida cualquier forma de discriminación, abuso, fraude o uso ilícito de la Plataforma.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">11. Propiedad Intelectual</h2>
          <p>Todo el software, marcas y logotipos son propiedad de FOUNDAR S.A.S. Los contenidos generados por usuarios
            otorgan una licencia no exclusiva a la Plataforma.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">12. Privacidad y Cookies</h2>
          <p>El tratamiento de datos personales se rige por la <RouterLink to="/PrivacyPolicy"
              class="text-primary underline">Política de Privacidad</RouterLink> y la <RouterLink to="/cookies"
              class="text-primary underline">Política de Cookies</RouterLink>.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">13. Responsabilidad, Exenciones e Indemnidad</h2>
          <p>La Plataforma se ofrece “tal cual”. El Usuario exime a HayLugar de responsabilidad por daños derivados del
            uso de los espacios o la aplicación.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">14. Legislación y Jurisdicción</h2>
          <p>Regido por las leyes de la República Argentina. Jurisdicción: Tribunales de San Miguel de Tucumán.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">15. Autoridades y Contacto</h2>
          <ul class="list-disc space-y-1 flex-wrap">
            <li>Soporte: <a href="mailto:apphaylugar@gmail.com"
                class="text-primary underline font-semibold">soportehaylugar@gmail.com</a></li>
            <li>Defensa del Consumidor: <a href="https://www.argentina.gob.ar/defensadelconsumidor" target="_blank"
                class="text-primary underline font-semibold">https://www.argentina.gob.ar/defensadelconsumidor</a></li>
          </ul>
        </div>

        <p class="border-t pt-6 text-sm text-gray-500 text-center">
          © {{ currentYear }} HayLugar — Tecnología tucumana con impacto global
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from '../components/common/BackButton.vue';
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
a {
  transition: color .2s ease
}

a:hover {
  color: #0ea5e9
}
</style>
