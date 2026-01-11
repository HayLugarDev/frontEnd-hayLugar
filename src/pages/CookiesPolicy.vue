<template>
  <div class="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-dark text-white pt-10 md:pt-16">

    <!-- BOTÓN ATRÁS MOBILE -->
    <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
      <BackButton />
    </div>

    <MainHeader />

    <!-- Hero -->
    <section class="py-16 px-6 text-center max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Política de Cookies</h1>
      <p class="text-gray-300 text-base md:text-lg">
        Última actualización: <span class="font-semibold">10/10/2025</span>
      </p>
      <p class="text-gray-400 mt-2 text-sm">
        Esta Política complementa los <RouterLink to="/termsConditions" class="text-accent underline">Términos y
          Condiciones</RouterLink>
        y la <RouterLink to="/PrivacyPolicy" class="text-accent underline">Política de Privacidad</RouterLink> de
        HayLugar.
      </p>
    </section>

    <!-- Contenido -->
    <section class="bg-white text-gray-800 rounded-t-3xl shadow-2xl py-12 px-6 md:px-10">
      <div class="max-w-3xl mx-auto space-y-10 leading-relaxed">
        <p>
          Esta Política explica el uso de cookies y tecnologías similares en el sitio web de
          <strong>HayLugar</strong>, plataforma operada por <strong>FOUNDAR S.A.S.</strong> en la República Argentina.
          Su objetivo es garantizar transparencia sobre los mecanismos que utilizamos para mejorar tu experiencia de
          navegación.
        </p>

        <!-- Sección 1 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">1. Uso de cookies</h2>
          <p>
            El sitio
            <a href="https://haylugar.com.ar" target="_blank"
              class="text-accent font-semibold underline">https://haylugar.com.ar</a>
            utiliza cookies y tecnologías similares para garantizar su correcto funcionamiento, mejorar la seguridad,
            optimizar la navegación y ofrecer una mejor experiencia al usuario.
          </p>
          <p class="mt-3">
            El uso de cookies implica un tratamiento mínimo de datos personales, basado en el
            <strong>consentimiento del usuario</strong> o en el
            <strong>interés legítimo</strong> de la plataforma para las cookies estrictamente necesarias.
          </p>
        </div>

        <!-- Sección 2 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">2. Tipos de cookies utilizadas</h2>
          <ul class="list-disc ml-6 space-y-2">
            <li><strong>Cookies necesarias:</strong> permiten el funcionamiento básico y seguro del sitio.</li>
            <li>
              <strong>Cookies de personalización:</strong> recuerdan ciertas preferencias del usuario (por ejemplo,
              idioma
              o región).
            </li>
            <li>
              <strong>Cookies de terceros:</strong> algunos servicios integrados, como Google Maps o Cloudflare, pueden
              instalar sus propias cookies para brindar funcionalidades o mejorar la seguridad y el rendimiento del
              sitio.
            </li>
            <li>
              <strong>Cookies de análisis (futuras):</strong> se utilizarán exclusivamente para mejorar los servicios,
              previa
              obtención de consentimiento.
            </li>
          </ul>
        </div>

        <!-- Sección 3 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">3. Gestión y duración</h2>
          <p>
            Actualmente, el sitio no dispone de un panel interno para configurar cookies. Podés administrar o eliminar
            las cookies desde la configuración de tu navegador. La desactivación puede afectar el funcionamiento de
            algunas secciones.
          </p>
          <p class="mt-3">
            Las cookies se conservarán por el tiempo necesario para cumplir su finalidad o según las políticas del
            navegador utilizado.
          </p>
          <p class="mt-3">
            En futuras versiones, HayLugar incorporará un sistema de consentimiento que permita aceptar, rechazar o
            configurar categorías opcionales, garantizando una experiencia transparente y personalizada.
          </p>
        </div>

        <!-- Sección 4 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">4. Servicios de terceros</h2>
          <p>
            Algunos contenidos o funciones del sitio pueden provenir de servicios externos. Estos proveedores pueden
            recopilar información de acuerdo con sus propias políticas:
          </p>
          <ul class="list-disc ml-6 mt-2 space-y-1">
            <li>
              <a href="https://policies.google.com/privacy" target="_blank"
                class="text-primary underline font-semibold">Política de privacidad de Google</a>
            </li>
            <li>
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank"
                class="text-primary underline font-semibold">Política de privacidad de Cloudflare</a>
            </li>
            <li>
              <a href="https://www.mercadopago.com.ar/privacidad" target="_blank"
                class="text-primary underline font-semibold">Política de privacidad de Mercado Pago</a>
            </li>
          </ul>
        </div>

        <!-- Sección 5 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">5. Derechos del usuario</h2>
          <p>
            Podés ejercer tus derechos de acceso, rectificación, actualización o supresión de tus datos escribiendo a
            <a href="mailto:apphaylugar@gmail.com"
              class="text-primary font-semibold underline">apphaylugar@gmail.com</a>.
          </p>
          <p class="mt-2">
            La autoridad de aplicación es la
            <a href="https://www.argentina.gob.ar/aaip" target="_blank"
              class="text-primary underline font-semibold">Agencia de Acceso a la Información Pública (AAIP)</a>.
          </p>
        </div>

        <!-- Sección 6 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">6. Actualizaciones de esta Política</h2>
          <p>
            HayLugar podrá modificar esta Política de Cookies cuando se incorporen nuevas herramientas o servicios que
            impliquen el uso de cookies. La versión vigente estará siempre disponible en esta sección, indicando la
            fecha
            de su última actualización.
          </p>
        </div>
      </div>
    </section>

    <!-- Banner de consentimiento -->
    <CookieBanner />
  </div>
</template>

<script setup>
import MainHeader from '../components/layout/header/MainHeader.vue'
import CookieBanner from '../components/common/CookieBanner.vue'
import BackButton from '../components/common/BackButton.vue';
</script>

<style scoped>
a {
  transition: color 0.3s ease;
}

a:hover {
  color: #0ea5e9;
  /* tono más claro del accent */
}
</style>
