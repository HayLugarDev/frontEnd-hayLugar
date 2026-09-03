<template>
  <div
    class="app-download-page min-h-screen overflow-x-hidden bg-[#020617] text-white"
  >
    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="download-glow download-glow--top"></div>
      <div class="download-glow download-glow--bottom"></div>
      <div class="download-grid"></div>
    </div>

    <!-- Main -->
    <main class="relative z-10">
      <section class="px-6 pb-20 pt-14 md:pb-28 md:pt-20">
        <div class="mx-auto max-w-5xl">
          <!-- Hero -->
          <div class="text-center">
            <div
              class="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary"
            >
              <span class="h-2 w-2 animate-pulse rounded-full bg-newgreen"></span>
              Versión Android disponible
            </div>

            <h1
              class="mx-auto max-w-3xl font-title text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
            >
              HayLug<span class="text-primary">AR</span>
              <br />
              <span class="text-white/80">ya está en tus manos.</span>
            </h1>

            <p
              class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
            >
              Encontrá estacionamientos, reservá tu lugar y aprovechá mejor
              cada espacio disponible desde tu celular.
            </p>
          </div>

          <!-- Download card -->
          <div
            class="download-card mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-cyan-950/30 backdrop-blur-xl"
          >
            <div class="grid md:grid-cols-[0.9fr_1.1fr]">
              <!-- Left -->
              <div
                class="relative flex min-h-[360px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0D1B2A] to-[#07111f] p-8 md:border-b-0 md:border-r"
              >
                <div class="phone-glow"></div>

                <div class="download-phone">
                  <div class="download-phone__speaker"></div>

                  <div class="download-phone__screen">
                    <div class="download-phone__header">
                      <Logo width="26" />
                      <span>HayLugAR</span>
                    </div>

                    <div class="download-map">
                      <div class="download-map__grid"></div>

                      <div class="download-pin pin-one">
                        <Logo width="11" />
                      </div>

                      <div class="download-pin pin-two">
                        <Logo width="11" />
                      </div>

                      <div class="download-pin pin-three">
                        <Logo width="11" />
                      </div>

                      <div class="download-car">
                        <Logo width="10" />
                      </div>
                    </div>

                    <div class="download-phone__bottom">
                      <div class="mini-line"></div>
                      <div class="mini-line mini-line--short"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right -->
              <div class="p-8 md:p-10">
                <div class="flex items-start gap-4">
                  <div class="download-icon">
                    <span>↓</span>
                  </div>

                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Aplicación oficial
                    </p>

                    <h2 class="mt-1 font-title text-2xl font-bold">
                      Descargar para Android
                    </h2>
                  </div>
                </div>

                <p class="mt-6 text-sm leading-relaxed text-white/60">
                  Descargá la aplicación oficial de HayLugAR directamente
                  desde nuestro sitio mientras completamos su disponibilidad
                  en Google Play.
                </p>

                <!-- Download button -->
                <a
                  :href="APK_URL"
                  download
                  class="download-button mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 font-title text-base font-bold text-[#0D1B2A]"
                >
                  <span class="text-xl">↓</span>
                  Descargar HayLugAR
                </a>

                <div class="mt-4 flex items-center justify-between text-xs text-white/40">
                  <span>Android</span>
                  <span>Versión {{ APP_VERSION }}</span>
                </div>

                <!-- Security notice -->
                <div
                  class="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4"
                >
                  <div class="flex gap-3">
                    <span class="mt-0.5 text-yellow-300">ⓘ</span>

                    <div>
                      <p class="text-sm font-semibold text-white">
                        Sobre la instalación
                      </p>

                      <p class="mt-1 text-xs leading-relaxed text-white/50">
                        Actualmente HayLugAR se distribuye directamente desde
                        nuestro sitio oficial mientras completamos su
                        publicación en Google Play. Android puede mostrar una
                        advertencia al instalar aplicaciones descargadas fuera
                        de Google Play.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- How to install -->
          <div class="mx-auto mt-16 max-w-4xl">
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Instalación
              </p>

              <h2 class="mt-3 font-title text-3xl font-bold">
                Empezá en pocos pasos
              </h2>
            </div>

            <div class="mt-10 grid gap-4 md:grid-cols-3">
              <div class="install-step">
                <span class="step-number">01</span>

                <h3 class="mt-5 font-title text-lg font-semibold">
                  Descargá
                </h3>

                <p class="mt-2 text-sm leading-relaxed text-white/50">
                  Tocá el botón de descarga y guardá el instalador de HayLugAR
                  en tu dispositivo.
                </p>
              </div>

              <div class="install-step">
                <span class="step-number">02</span>

                <h3 class="mt-5 font-title text-lg font-semibold">
                  Instalá
                </h3>

                <p class="mt-2 text-sm leading-relaxed text-white/50">
                  Abrí el archivo descargado y seguí las indicaciones que
                  muestre Android.
                </p>
              </div>

              <div class="install-step">
                <span class="step-number">03</span>

                <h3 class="mt-5 font-title text-lg font-semibold">
                  Disfrutá HayLugAR
                </h3>

                <p class="mt-2 text-sm leading-relaxed text-white/50">
                  Registrate, buscá un lugar y empezá a descubrir una nueva
                  forma de estacionar.
                </p>
              </div>
            </div>
          </div>

          <!-- Trust -->
          <div class="mx-auto mt-12 max-w-3xl">
            <div
              class="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center"
            >
              <p class="text-sm font-semibold text-white">
                Descarga oficial de HayLugAR
              </p>

              <p class="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-white/45">
                Verificá que la descarga provenga de
                <strong class="text-white/70">haylugar.com.ar</strong>.
                No descargues aplicaciones de HayLugAR desde sitios de terceros.
              </p>
            </div>
          </div>

          <!-- Back -->
          <div class="mt-10 text-center">
            <router-link
              to="/"
              class="text-sm font-semibold text-primary transition hover:text-newgreen"
            >
              ← Volver al inicio
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Logo from '../components/layout/Logo.vue';

/**
 * IMPORTANTE:
 *
 * El APK NO se guarda dentro del repositorio.
 *
 * La URL se configura mediante:
 *
 * VITE_ANDROID_APK_URL
 *
 * Ejemplo:
 *
 * VITE_ANDROID_APK_URL=https://haylugar.com.ar/downloads/HayLugar-1.0.0.apk
 */
const APK_URL =
  import.meta.env.VITE_ANDROID_APK_URL ||
  '/downloads/HayLugar-1.0.0.apk';

const APP_VERSION =
  import.meta.env.VITE_APP_VERSION ||
  '1.0.0';

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.app-download-page {
  position: relative;
}

.download-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 9999px;
  filter: blur(100px);
  pointer-events: none;
}

.download-glow--top {
  right: -180px;
  top: -180px;
  background: rgba(21, 153, 208, 0.16);
}

.download-glow--bottom {
  left: -180px;
  bottom: -220px;
  background: rgba(6, 214, 160, 0.10);
}

.download-grid {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px
    );
  background-size: 48px 48px;
}

.logo-wrapper {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
}

.download-card {
  position: relative;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}

.download-card:hover {
  transform: translateY(-3px);
  border-color: rgba(21, 153, 208, 0.28);
}

.phone-glow {
  position: absolute;
  width: 230px;
  height: 230px;
  border-radius: 9999px;
  background: rgba(21, 153, 208, 0.18);
  filter: blur(60px);
}

.download-phone {
  position: relative;
  z-index: 2;
  width: 180px;
  height: 340px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 32px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.14),
    rgba(255, 255, 255, 0.035)
  );
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 0 50px rgba(21, 153, 208, 0.12);
  transform: rotate(-5deg);
}

.download-phone__speaker {
  position: absolute;
  z-index: 5;
  top: 13px;
  left: 50%;
  width: 42px;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(-50%);
}

.download-phone__screen {
  height: 100%;
  overflow: hidden;
  border-radius: 25px;
  background: #020617;
}

.download-phone__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 22px 12px 12px;
  font-size: 11px;
  font-weight: 700;
}

.download-map {
  position: relative;
  height: 215px;
  overflow: hidden;
  background: #081827;
}

.download-map__grid {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image:
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.07) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.07) 1px,
      transparent 1px
    );
  background-size: 28px 28px;
}

.download-pin {
  position: absolute;
  display: flex;
  width: 25px;
  height: 25px;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(8, 24, 39, 0.9);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20px rgba(21, 153, 208, 0.5);
}

.pin-one {
  top: 35px;
  left: 30px;
}

.pin-two {
  top: 100px;
  right: 28px;
}

.pin-three {
  bottom: 35px;
  left: 72px;
}

.download-car {
  position: absolute;
  top: 72px;
  left: 54px;
  display: flex;
  width: 23px;
  height: 23px;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 9999px;
  background: #1599d0;
  box-shadow: 0 0 20px rgba(21, 153, 208, 0.8);
  animation: carFloat 4s ease-in-out infinite;
}

.download-phone__bottom {
  padding: 13px;
}

.mini-line {
  width: 100%;
  height: 7px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.10);
}

.mini-line--short {
  width: 62%;
  margin-top: 7px;
}

.download-icon {
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(21, 153, 208, 0.25);
  border-radius: 15px;
  background: rgba(21, 153, 208, 0.10);
  color: #1599d0;
  font-size: 24px;
}

.download-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #1599d0, #06d6a0);
  box-shadow: 0 15px 40px rgba(21, 153, 208, 0.18);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 50px rgba(21, 153, 208, 0.28);
}

.install-step {
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.035);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.install-step:hover {
  transform: translateY(-3px);
  border-color: rgba(21, 153, 208, 0.3);
}

.step-number {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: rgba(21, 153, 208, 0.10);
  color: #1599d0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
}

@keyframes carFloat {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(45px, 25px);
  }
}

@media (max-width: 767px) {
  .download-phone {
    transform: rotate(-3deg) scale(0.92);
  }
}

@media (prefers-reduced-motion: reduce) {
  .download-phone,
  .download-car,
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>