<template>
  <div
    class="landing-shell min-h-screen overflow-x-hidden bg-[#020617] text-white selection:bg-[#00B4D8]/30 selection:text-white"
  >
    <!-- ============================ HEADER ============================ -->
    <header
      class="fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-[#020617]/85 backdrop-blur-xl"
    >
      <div
        class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div class="logo-lock logo-lock--header">
            <Logo width="28" />
          </div>

          <div class="min-w-0 leading-tight">
            <p class="truncate text-sm font-bold text-white">
              HayLugAR
            </p>

            <p class="hidden text-xs text-white/50 sm:block">
              Smart parking urbano
            </p>
          </div>
        </div>

        <nav class="hidden items-center gap-6 text-sm text-white/65 md:flex">
          <a href="#app" class="transition hover:text-white">
            La app
          </a>

          <a href="#red" class="transition hover:text-white">
            Red urbana
          </a>

          <a href="#monetizar" class="transition hover:text-white">
            Monetizar
          </a>
        </nav>

        <!-- DESCARGAR APP -->
        <router-link
          to="/download-app-test"
          class="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-[#0D1B2A]
                 sm:px-5 sm:text-sm
                 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                 shadow-lg shadow-cyan-900/30
                 hover:from-[#06D6A0] hover:to-[#00B4D8]
                 transition-all duration-300"
        >
          Descargar app
        </router-link>
      </div>
    </header>

    <!-- ============================ HERO ============================ -->
    <section
      class="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24
             bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#020617]"
    >
      <div class="pointer-events-none absolute inset-0">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>

      <div
        class="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6
               lg:grid-cols-[1.05fr_0.95fr] lg:px-8"
      >
        <!-- COPY -->
        <div class="text-center lg:text-left">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5
                   px-3 py-1 text-xs font-medium text-white/70"
          >
            <span
              class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
            ></span>

            Disponible desde la app · Hecha en Argentina
          </div>

          <h1
            class="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.03] tracking-tight
                   md:text-5xl xl:text-6xl lg:mx-0"
          >
            Estacioná mejor. Hacé rendir tu espacio.
          </h1>

          <p
            class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/78 md:text-lg lg:mx-0"
          >
            HayLugAR conecta conductores con cocheras, playas y espacios disponibles.
            Una forma más simple de moverse por la ciudad y una oportunidad concreta
            para quienes tienen un lugar sin usar.
          </p>

          <!-- ÚNICO CTA DE APP -->
          <div
            class="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <router-link
              to="/download-app-test"
              class="rounded-xl px-7 py-4 text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/30
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300"
            >
              Probar HayLugAR
            </router-link>
          </div>

          <p class="mt-4 text-xs text-white/55">
            Encontrá espacios, publicá el tuyo y descubrí una nueva forma de estacionar.
          </p>
        </div>

        <!-- ANIMATED PHONE -->
        <div class="phone-perspective relative mx-auto w-full max-w-[390px]">
          <div
            class="absolute inset-0 rounded-full bg-[#00B4D8]/20 blur-3xl"
          ></div>

          <div
            class="phone-shell-3d relative rounded-[2rem] border border-white/10 bg-white/5 p-4
                   shadow-2xl shadow-cyan-950/40 backdrop-blur-xl"
          >
            <div
              class="phone-screen overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#020617]"
            >
              <div class="border-b border-white/10 p-5">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-xs text-white/45">
                      HayLugAR App
                    </p>

                    <p class="text-lg font-semibold">
                      Lugares cerca tuyo
                    </p>
                  </div>

                  <span
                    class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300"
                  >
                    En vivo
                  </span>
                </div>
              </div>

              <div
                class="map-3d relative h-60 overflow-hidden bg-[#081827]"
              >
                <div class="absolute inset-0 app-grid opacity-40"></div>
                <div class="scan-line"></div>

                <div class="route route-a"></div>
                <div class="route route-b"></div>
                <div class="route route-c"></div>

                <div class="hl-marker pin-a">
                  <Logo width="13" />
                </div>

                <div class="hl-marker pin-b">
                  <Logo width="13" />
                </div>

                <div class="hl-marker hl-marker--active pin-c">
                  <Logo width="13" />
                </div>

                <div class="hl-marker hl-marker--busy pin-d">
                  <Logo width="13" />
                </div>

                <div class="car-dot">
                  <div class="car-core">
                    <Logo width="10" />
                  </div>
                </div>

                <div
                  class="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10
                         bg-[#020617]/82 p-3 backdrop-blur"
                >
                  <p class="text-xs text-white/50">
                    Zona con demanda activa
                  </p>

                  <p class="mt-1 text-sm font-semibold">
                    Lugares disponibles cerca del destino
                  </p>
                </div>
              </div>

              <div class="space-y-3 p-4">
                <div class="app-row">
                  <div>
                    <p class="font-semibold">
                      Cochera privada
                    </p>

                    <p class="text-xs text-white/45">
                      Lista para recibir reservas
                    </p>
                  </div>

                  <span class="app-pill bg-emerald-400/15 text-emerald-300">
                    Activa
                  </span>
                </div>

                <div class="app-row">
                  <div>
                    <p class="font-semibold">
                      Playa de estacionamiento
                    </p>

                    <p class="text-xs text-white/45">
                      Capacidad visible desde la app
                    </p>
                  </div>

                  <span class="app-pill bg-cyan-400/15 text-cyan-200">
                    Red
                  </span>
                </div>

                <div class="app-row">
                  <div>
                    <p class="font-semibold">
                      Espacio institucional
                    </p>

                    <p class="text-xs text-white/45">
                      Accesos más ordenados
                    </p>
                  </div>

                  <span class="app-pill bg-[#FFC72C]/15 text-[#FFC72C]">
                    Smart
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END PHONE -->
      </div>
    </section>

    <!-- ============================ APP ENTRY CTA ============================ -->
    <section
      id="download"
      class="border-y border-white/10 bg-[#020617] py-8"
    >
      <div class="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          class="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10
                 bg-white/5 p-5 md:flex-row"
        >
          <div class="text-center md:text-left">
            <p class="font-semibold">
              Todo empieza en HayLugAR.
            </p>

            <p class="mt-1 text-sm text-white/55">
              Conocé la experiencia y probá nuestra nueva plataforma.
            </p>
          </div>

          <router-link
            to="/download-app-test"
            class="rounded-xl px-6 py-3 text-sm font-semibold text-[#0D1B2A]
                   bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                   shadow-lg shadow-cyan-900/30
                   hover:from-[#06D6A0] hover:to-[#00B4D8]
                   transition-all duration-300"
          >
            Conocer la app
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============================ APP VALUE ============================ -->
    <section
      id="app"
      class="border-b border-white/10 bg-gradient-to-b from-[#020617] to-[#0B1220] py-20"
    >
      <div class="mx-auto max-w-6xl px-6 text-center lg:px-8">
        <h2 class="mb-4 text-3xl font-bold md:text-4xl">
          Una solución simple para un problema de todos los días.
        </h2>

        <p class="mx-auto mb-12 max-w-2xl text-white/70">
          HayLugAR ordena la conexión entre quienes buscan estacionar y quienes tienen
          un espacio disponible para ofrecer.
        </p>

        <div class="grid gap-6 md:grid-cols-3">
          <div class="landing-card">
            <span class="step-pill">01</span>

            <h3 class="mt-6 mb-3 text-xl font-semibold">
              Encontrar lugar
            </h3>

            <p class="leading-relaxed text-white/70">
              El conductor puede resolver su estacionamiento desde el celular,
              sin depender de recorridos innecesarios ni llamadas.
            </p>
          </div>

          <div class="landing-card">
            <span class="step-pill">02</span>

            <h3 class="mt-6 mb-3 text-xl font-semibold">
              Publicar un espacio
            </h3>

            <p class="leading-relaxed text-white/70">
              Una cochera, una playa o un espacio disponible puede transformarse
              en una nueva fuente de ingresos.
            </p>
          </div>

          <div class="landing-card">
            <span class="step-pill">03</span>

            <h3 class="mt-6 mb-3 text-xl font-semibold">
              Mover mejor la ciudad
            </h3>

            <p class="leading-relaxed text-white/70">
              Menos vueltas para estacionar, mejor uso del espacio existente
              y una red preparada para crecer por zonas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ RED URBANA ============================ -->
    <section
      id="red"
      class="border-b border-white/10 bg-[#020617] py-20"
    >
      <div class="mx-auto max-w-6xl px-6 lg:px-8">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div
              class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5
                     px-3 py-1 text-xs text-white/70"
            >
              <span class="h-2 w-2 rounded-full bg-[#FFC72C]"></span>
              Red urbana
            </div>

            <h2 class="mb-4 text-3xl font-bold md:text-4xl">
              Una misma red para distintos tipos de espacios.
            </h2>

            <p class="leading-relaxed text-white/70">
              HayLugAR puede crecer con cocheras particulares, playas comerciales,
              instituciones, empresas y futuras soluciones vinculadas a la gestión urbana.
              El objetivo es claro: que encontrar un lugar sea cada vez más fácil.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="network-card">
              <p class="text-sm text-white/50">
                Privado
              </p>

              <p class="mt-2 font-semibold">
                Cocheras particulares
              </p>
            </div>

            <div class="network-card">
              <p class="text-sm text-white/50">
                Comercial
              </p>

              <p class="mt-2 font-semibold">
                Playas de estacionamiento
              </p>
            </div>

            <div class="network-card">
              <p class="text-sm text-white/50">
                Institucional
              </p>

              <p class="mt-2 font-semibold">
                Universidades y empresas
              </p>
            </div>

            <div class="network-card">
              <p class="text-sm text-white/50">
                Urbano
              </p>

              <p class="mt-2 font-semibold">
                Municipios y vía pública
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ MONETIZACION ============================ -->
    <section
      id="monetizar"
      class="border-b border-white/10 bg-gradient-to-b from-[#020617] to-[#0B1220] py-20"
    >
      <div class="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 md:p-10"
        >
          <div class="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 class="mb-4 text-3xl font-bold md:text-4xl">
                Tu espacio puede trabajar por vos.
              </h2>

              <p class="leading-relaxed text-white/70">
                Hay lugares que pasan horas vacíos mientras otra persona busca dónde estacionar.
                HayLugAR conecta esas dos necesidades en una experiencia simple, segura y pensada
                para operar desde el celular.
              </p>

              <!-- CTA APP -->
              <router-link
                to="/download-app-test"
                class="mt-8 inline-flex rounded-full px-8 py-4 text-[#0D1B2A] font-semibold
                       bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                       shadow-lg shadow-cyan-900/30
                       hover:from-[#06D6A0] hover:to-[#00B4D8]
                       transition-all duration-300"
              >
                Sumar mi espacio
              </router-link>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-[#020617]/70 p-5"
            >
              <div class="space-y-4">
                <div class="metric-row">
                  <span>Espacios</span>

                  <strong>
                    Cocheras, playas e instituciones
                  </strong>
                </div>

                <div class="metric-row">
                  <span>Uso</span>

                  <strong>
                    Por hora, día o necesidad puntual
                  </strong>
                </div>

                <div class="metric-row">
                  <span>Gestión</span>

                  <strong>
                    Desde la app
                  </strong>
                </div>

                <div
                  class="rounded-xl bg-[#FFC72C] p-4 text-[#0D1B2A]"
                >
                  <p class="text-sm font-semibold opacity-70">
                    Propósito
                  </p>

                  <p class="mt-1 font-bold">
                    Hacer visible el espacio disponible y convertirlo en valor para la ciudad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ FINAL CTA ============================ -->
    <section class="bg-[#020617] py-20">
      <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 class="mb-4 text-3xl font-bold md:text-4xl">
          La ciudad ya tiene lugares. HayLugAR los conecta.
        </h2>

        <p class="mx-auto mb-8 max-w-2xl text-white/70">
          Descubrí una nueva manera de estacionar, publicar
          y aprovechar mejor cada espacio.
        </p>

        <router-link
          to="/download-app-test"
          class="inline-flex rounded-xl px-8 py-4 text-[#0D1B2A] font-semibold
                 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                 shadow-lg shadow-cyan-900/30
                 hover:from-[#06D6A0] hover:to-[#00B4D8]
                 transition-all duration-300"
        >
          Probar HayLugAR
        </router-link>

        <button
          type="button"
          @click="sendWhatsAppLead"
          class="mt-6 block mx-auto text-sm font-semibold text-[#00B4D8] hover:underline"
        >
          Avisame cuando HayLugAR llegue a mi ciudad
        </button>
      </div>
    </section>

    <!-- ============================ FOOTER ============================ -->
    <section
      class="bg-gradient-to-b from-[#020617] via-[#020617] to-[#0EA5E9]/10 px-4 pt-8 pb-8"
    >
      <footer
        class="mx-auto max-w-6xl rounded-[28px] bg-white px-6 py-8 text-[#0F172A]
               shadow-[0_-10px_40px_rgba(15,23,42,0.25)] md:px-10"
      >
        <div class="mb-8 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="logo-lock logo-lock--footer">
              <Logo width="20" />
            </div>

            <div>
              <p class="font-semibold leading-tight">
                HayLugAR
              </p>

              <p class="text-xs text-[#64748B]">
                Smart parking urbano
              </p>
            </div>
          </div>

          <div class="h-px bg-[#E2E8F0]"></div>
        </div>

        <div class="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <h4 class="mb-3 text-base font-semibold text-[#0F172A]">
              HayLugAR
            </h4>

            <p class="max-w-sm text-sm leading-relaxed text-[#475569]">
              Una app para estacionar mejor y hacer rendir espacios disponibles en la ciudad.
            </p>
          </div>

          <div>
            <h4 class="mb-3 text-base font-semibold text-[#0F172A]">
              Empresa
            </h4>

            <ul class="space-y-2 text-sm text-[#475569]">
              <li>
                <router-link
                  to="/termsConditions"
                  class="hover:text-[#00B4D8]"
                >
                  Términos y condiciones
                </router-link>
              </li>

              <li>
                <router-link
                  to="/PrivacyPolicy"
                  class="hover:text-[#00B4D8]"
                >
                  Política de privacidad
                </router-link>
              </li>

              <li>
                <a
                  :href="whatsappLink('Hola! Quiero contactarme con HayLugAR.')"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 hover:text-[#00B4D8]"
                >
                  Contacto

                  <img
                    src="../../assets/wp-logo.png"
                    alt="WhatsApp"
                    class="h-6 w-6 object-contain"
                  />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-3 text-base font-semibold text-[#0F172A]">
              País
            </h4>

            <ul class="space-y-2 text-sm text-[#475569]">
              <li class="flex items-center gap-2">
                Argentina

                <span
                  class="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]"
                >
                  Inicio
                </span>
              </li>

              <li class="text-xs text-[#94A3B8]">
                Crecimiento progresivo por zonas.
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-3 text-base font-semibold text-[#0F172A]">
              Seguinos
            </h4>

            <div class="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/hay-lugar/"
                target="_blank"
                rel="noopener"
                class="transition-transform hover:scale-110"
                aria-label="LinkedIn HayLugAR"
              >
                <img
                  src="../../assets/linkedin.png"
                  alt="LinkedIn"
                  class="h-7 w-7 object-contain"
                />
              </a>

              <a
                href="https://www.instagram.com/haylugarok"
                target="_blank"
                rel="noopener"
                class="transition-transform hover:scale-110"
                aria-label="Instagram HayLugAR"
              >
                <img
                  src="../../assets/instagram.png"
                  alt="Instagram"
                  class="h-7 w-7 object-contain"
                />
              </a>

              <a
                href="https://www.tiktok.com/@apphaylugar"
                target="_blank"
                rel="noopener"
                class="transition-transform hover:scale-110"
                aria-label="TikTok HayLugAR"
              >
                <img
                  src="../../assets/tiktok.png"
                  alt="TikTok"
                  class="h-7 w-7 object-contain"
                />
              </a>
            </div>

            <p class="mt-4 text-xs leading-relaxed text-[#94A3B8]">
              Lanzamientos, novedades y nuevas zonas disponibles.
            </p>
          </div>
        </div>

        <div class="mt-8 h-px bg-[#E2E8F0]"></div>

        <div
          class="mt-6 flex flex-col items-center justify-between gap-5 md:flex-row"
        >
          <!--
            APP STORE / GOOGLE PLAY
            ---------------------------------
            Se ocultan temporalmente hasta definir
            la distribución oficial de la aplicación.
          -->

          <router-link
            to="/download-app-test"
            class="inline-flex rounded-full border border-[#CBD5E1] px-5 py-2.5
                   text-sm font-semibold text-[#0F172A]
                   transition hover:border-[#00B4D8] hover:text-[#00B4D8]"
          >
            Conocer la app
          </router-link>

          <div class="text-center text-xs text-[#94A3B8]">
            © {{ currentYear }} · HayLugAR · Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Logo from '../components/layout/Logo.vue'

const currentYear = computed(() => new Date().getFullYear())

const WHATSAPP_PHONE = '5493813022017'

const whatsappLink = (message: string): string => {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

const openExternal = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const sendWhatsAppLead = (): void => {
  openExternal(
    whatsappLink(
      'Hola! Quiero que HayLugAR llegue a mi ciudad y descargar la app cuando esté disponible.'
    )
  )
}
</script>

<style scoped>
.landing-shell {
  font-family:
    "Be Vietnam Pro",
    Raleway,
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.landing-shell h1,
.landing-shell h2,
.landing-shell h3,
.landing-shell p,
.landing-shell a,
.landing-shell button,
.landing-shell span,
.landing-shell strong {
  letter-spacing: -0.01em;
}

.logo-lock {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-lock--header {
  width: 34px;
  height: 34px;
}

.logo-lock--footer {
  width: 24px;
  height: 24px;
}

.logo-lock :deep(svg),
.logo-lock :deep(img) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
}

.halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.65;
  animation: float 14s ease-in-out infinite;
}

.halo--lg {
  right: -10rem;
  top: -8rem;
  width: 24rem;
  height: 24rem;
  background: rgba(59, 130, 246, 0.35);
}

.halo--sm {
  left: -8rem;
  bottom: -10rem;
  width: 23rem;
  height: 23rem;
  background: rgba(45, 212, 191, 0.42);
}

.phone-perspective {
  perspective: 1100px;
}

.phone-shell-3d {
  transform: rotateY(-7deg) rotateX(4deg);
  transform-style: preserve-3d;
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.42),
    0 0 80px rgba(0, 180, 216, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: phoneSoftFloat 7s ease-in-out infinite;
}

.phone-screen {
  position: relative;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 24px 60px rgba(0, 180, 216, 0.06);
}

.map-3d {
  transform-style: preserve-3d;
  box-shadow:
    inset 0 30px 80px rgba(0, 180, 216, 0.08),
    inset 0 -30px 90px rgba(2, 6, 23, 0.85);
}

.app-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}

.scan-line {
  position: absolute;
  top: -40%;
  left: 0;
  right: 0;
  z-index: 2;
  height: 42%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 180, 216, 0.14),
    transparent
  );
  animation: scan 4.8s ease-in-out infinite;
}

.route {
  position: absolute;
  z-index: 1;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 18px rgba(0, 180, 216, 0.08);
}

.route-a {
  top: 64px;
  left: -20px;
  width: 240px;
  transform: rotate(18deg);
}

.route-b {
  top: 132px;
  right: -18px;
  width: 230px;
  transform: rotate(-16deg);
}

.route-c {
  top: 22px;
  left: 148px;
  width: 190px;
  transform: rotate(78deg);
}

.hl-marker {
  position: absolute;
  z-index: 4;
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(8, 24, 39, 0.95);
  border-radius: 9999px;
  background:
    radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.78));
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 24px rgba(0, 180, 216, 0.55);
  animation: markerPulse 2.8s ease-in-out infinite;
}

.hl-marker :deep(svg),
.hl-marker :deep(img) {
  display: block !important;
  width: 15px !important;
  height: 15px !important;
  max-width: 15px !important;
  max-height: 15px !important;
  object-fit: contain !important;
}

.hl-marker--active {
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 26px rgba(255, 199, 44, 0.72);
}

.hl-marker--busy {
  opacity: 0.78;
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 22px rgba(239, 68, 68, 0.48);
}

.pin-a {
  top: 22%;
  left: 20%;
}

.pin-b {
  top: 36%;
  right: 22%;
  animation-delay: 0.4s;
}

.pin-c {
  bottom: 26%;
  left: 42%;
  animation-delay: 0.8s;
}

.pin-d {
  bottom: 20%;
  right: 17%;
  animation-delay: 1.2s;
}

.car-dot {
  position: absolute;
  z-index: 5;
  top: 74px;
  left: 38px;
  width: 24px;
  height: 24px;
  animation: carMove 6s ease-in-out infinite;
}

.car-core {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 9999px;
  background: #00B4D8;
  box-shadow:
    0 0 24px rgba(0, 180, 216, 0.85),
    0 10px 24px rgba(0, 0, 0, 0.35);
}

.car-core :deep(svg),
.car-core :deep(img) {
  display: block !important;
  width: 12px !important;
  height: 12px !important;
  max-width: 12px !important;
  max-height: 12px !important;
  object-fit: contain !important;
}

.app-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.055);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
}

.app-pill {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
}

.landing-card {
  position: relative;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.25s ease;
}

.landing-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 180, 216, 0.65);
  background: rgba(255, 255, 255, 0.07);
}

.step-pill {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #00B4D8;
  color: #0D1B2A;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 10px 28px rgba(0, 180, 216, 0.25);
}

.network-card {
  min-height: 130px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.25s ease;
}

.network-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 180, 216, 0.6);
  background: rgba(255, 255, 255, 0.07);
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.055);
}

.metric-row span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
}

.metric-row strong {
  text-align: right;
  font-size: 13px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(12px);
  }
}

@keyframes phoneSoftFloat {
  0%,
  100% {
    transform: rotateY(-7deg) rotateX(4deg) translateY(0);
  }

  50% {
    transform: rotateY(-4deg) rotateX(3deg) translateY(-8px);
  }
}

@keyframes markerPulse {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.04);
  }
}

@keyframes scan {
  0% {
    transform: translateY(0);
    opacity: 0;
  }

  18% {
    opacity: 1;
  }

  65% {
    opacity: 1;
  }

  100% {
    transform: translateY(360%);
    opacity: 0;
  }
}

@keyframes carMove {
  0% {
    transform: translate(0, 0);
  }

  35% {
    transform: translate(118px, 38px);
  }

  70% {
    transform: translate(214px, 108px);
  }

  100% {
    transform: translate(0, 0);
  }
}

@media (max-width: 768px) {
  .phone-shell-3d {
    transform: none;
    animation: none;
  }
}

@media (max-width: 640px) {
  .metric-row {
    flex-direction: column;
    gap: 4px;
  }

  .metric-row strong {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .halo,
  .phone-shell-3d,
  .scan-line,
  .hl-marker,
  .car-dot,
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
