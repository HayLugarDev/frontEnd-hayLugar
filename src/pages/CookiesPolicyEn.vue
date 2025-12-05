<template>
  <div class="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-dark text-white pt-10 md:pt-16">

    <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
      <BackButton />
    </div>

    <MainHeader />

    <!-- Hero -->
    <section class="py-16 px-6 text-center max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Cookies Policy</h1>
      <p class="text-gray-300 text-base md:text-lg">
        Last updated: <span class="font-semibold">October 10, 2025</span>
      </p>
      <p class="text-gray-400 mt-2 text-sm">
        This policy complements the
        <RouterLink to="/en/terms" class="text-accent underline">Terms and Conditions</RouterLink>
        and the
        <RouterLink to="/en/privacy" class="text-accent underline">Privacy Policy</RouterLink>
        of HayLugar.
      </p>
    </section>

    <!-- Content -->
    <section class="bg-white text-gray-800 rounded-t-3xl shadow-2xl py-12 px-6 md:px-10">
      <div class="max-w-3xl mx-auto space-y-10 leading-relaxed">
        <p>
          This Cookies Policy explains the use of cookies and similar technologies on the
          <strong>HayLugar</strong> website, operated by <strong>FOUNDAR S.A.S.</strong> in the Republic of Argentina.
          Its purpose is to ensure transparency about how we enhance your browsing experience.
        </p>

        <!-- Section 1 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">1. Use of cookies</h2>
          <p>
            The website
            <a href="https://haylugar.com.ar" target="_blank"
              class="text-accent font-semibold underline">https://haylugar.com.ar</a>
            uses cookies and similar technologies to ensure proper functionality, improve security, optimize navigation,
            and deliver a better user experience.
          </p>
          <p class="mt-3">
            The use of cookies may involve minimal processing of personal data, based on the
            <strong>user’s consent</strong> or on the platform’s
            <strong>legitimate interest</strong> for strictly necessary cookies.
          </p>
        </div>

        <!-- Section 2 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">2. Types of cookies used</h2>
          <ul class="list-disc ml-6 space-y-2">
            <li><strong>Necessary cookies:</strong> enable the basic and secure operation of the site.</li>
            <li>
              <strong>Personalization cookies:</strong> store user preferences (for example, language or region).
            </li>
            <li>
              <strong>Third-party cookies:</strong> integrated services such as Google Maps or Cloudflare may install
              their own cookies to provide functionalities or improve security and performance.
            </li>
            <li>
              <strong>Analytics cookies (future use):</strong> will be used exclusively to improve our services, subject
              to prior user consent.
            </li>
          </ul>
        </div>

        <!-- Section 3 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">3. Management and duration</h2>
          <p>
            Currently, the website does not have an internal panel to configure or reject cookies. You can manage or
            delete cookies directly from your browser settings. Disabling cookies may affect the proper operation of
            certain sections of the website.
          </p>
          <p class="mt-3">
            Cookies will be stored for as long as necessary to fulfill their purpose or according to your browser’s
            configuration.
          </p>
          <p class="mt-3">
            In future versions, HayLugar will incorporate a consent management system allowing users to accept, reject,
            or configure optional cookie categories, ensuring a transparent and personalized experience.
          </p>
        </div>

        <!-- Section 4 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">4. Third-party services</h2>
          <p>
            Some website features may rely on third-party services. These providers may collect information according to
            their own privacy policies:
          </p>
          <ul class="list-disc ml-6 mt-2 space-y-1">
            <li>
              <a href="https://policies.google.com/privacy" target="_blank"
                class="text-primary underline font-semibold">Google Privacy Policy</a>
            </li>
            <li>
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank"
                class="text-primary underline font-semibold">Cloudflare Privacy Policy</a>
            </li>
            <li>
              <a href="https://www.mercadopago.com.ar/privacidad" target="_blank"
                class="text-primary underline font-semibold">Mercado Pago Privacy Policy</a>
            </li>
          </ul>
        </div>

        <!-- Section 5 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">5. User rights</h2>
          <p>
            You may exercise your rights to access, update, correct, or delete your personal data by contacting us at
            <a href="mailto:apphaylugar@gmail.com"
              class="text-primary font-semibold underline">apphaylugar@gmail.com</a>.
          </p>
          <p class="mt-2">
            The supervisory authority is the
            <a href="https://www.argentina.gob.ar/aaip" target="_blank"
              class="text-primary underline font-semibold">Argentine Agency for Access to Public Information (AAIP)</a>.
          </p>
        </div>

        <!-- Section 6 -->
        <div>
          <h2 class="text-xl font-bold text-primary mb-2">6. Updates to this Policy</h2>
          <p>
            HayLugar may update this Cookies Policy when new tools or services involving cookies are implemented. The
            current version will always be available in this section, indicating the date of its last update.
          </p>
        </div>
      </div>
    </section>

    <CookieBannerEn />
  </div>
</template>

<script setup>
import MainHeader from '../components/layout/header/MainHeader.vue'
import CookieBannerEn from '../components/common/CookieBannerEn.vue'
import BackButton from '../components/common/BackButton.vue';
</script>

<style scoped>
a {
  transition: color 0.3s ease;
}

a:hover {
  color: #0ea5e9;
}
</style>
