<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '../Logo.vue'

const router = useRouter()

const mobileMenuOpen = ref(false)

const navigate = (path: string) => {
  mobileMenuOpen.value = false
  router.push(path)
}

const scrollToSection = (id: string) => {
  mobileMenuOpen.value = false

  if (router.currentRoute.value.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
    return
  }

  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50
           bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
           border-b border-white/10 shadow-lg"
  >
    <!-- SAFE AREA -->
    <div class="safe-top"></div>

    <div
      class="px-5 py-3 sm:px-6 sm:py-4 xl:px-16
             flex items-center justify-between gap-6 text-white"
    >

      <!-- LOGO -->
      <button
        type="button"
        class="flex items-center gap-3 cursor-pointer"
        @click="navigate('/')"
      >
        <Logo width="12" class="drop-shadow-lg" />

        <span
          class="hidden sm:block font-bold tracking-tight text-lg md:text-xl
                 text-white"
        >
          HayLugar
        </span>
      </button>

      <!-- DESKTOP NAVIGATION -->
      <nav class="hidden lg:flex items-center gap-7">
        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="navigate('/')"
        >
          Inicio
        </button>

        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="scrollToSection('como-funciona')"
        >
          Cómo funciona
        </button>

        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="scrollToSection('conductores')"
        >
          Para conductores
        </button>

        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="scrollToSection('propietarios')"
        >
          Para propietarios
        </button>

        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="navigate('/estacionamiento-medido')"
        >
          Estacionamiento medido
        </button>

        <button
          type="button"
          class="text-sm text-white/80 hover:text-white transition"
          @click="navigate('/FAQView')"
        >
          FAQ
        </button>
      </nav>

      <!-- DESKTOP CTA -->
      <div class="hidden lg:flex items-center">
        <a
          href="https://haylugar.com"
          class="bg-[#06D6A0] hover:bg-[#00B4D8]
                 text-[#0D1B2A] font-semibold
                 px-5 py-2.5 rounded-xl shadow-lg
                 text-sm transition-all"
        >
          Descargar app
        </a>
      </div>

      <!-- MOBILE BUTTON -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center
               w-11 h-11 rounded-xl
               bg-white/10 hover:bg-white/20
               border border-white/10 transition"
        aria-label="Abrir menú"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <font-awesome-icon
          :icon="mobileMenuOpen ? ['fas', 'xmark'] : ['fas', 'bars']"
          class="text-lg"
        />
      </button>
    </div>

    <!-- MOBILE MENU -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden border-t border-white/10
               bg-[#0D1B2A]/98 backdrop-blur-xl"
      >
        <nav class="px-5 py-5 flex flex-col gap-2">

          <button
            type="button"
            class="mobile-nav-item"
            @click="navigate('/')"
          >
            Inicio
          </button>

          <button
            type="button"
            class="mobile-nav-item"
            @click="scrollToSection('como-funciona')"
          >
            Cómo funciona
          </button>

          <button
            type="button"
            class="mobile-nav-item"
            @click="scrollToSection('conductores')"
          >
            Para conductores
          </button>

          <button
            type="button"
            class="mobile-nav-item"
            @click="scrollToSection('propietarios')"
          >
            Para propietarios
          </button>

          <button
            type="button"
            class="mobile-nav-item"
            @click="navigate('/estacionamiento-medido')"
          >
            Estacionamiento medido
          </button>

          <button
            type="button"
            class="mobile-nav-item"
            @click="navigate('/FAQView')"
          >
            Preguntas frecuentes
          </button>

          <button
            type="button"
            class="mt-3 w-full
                   bg-[#06D6A0] hover:bg-[#00B4D8]
                   text-[#0D1B2A] font-semibold
                   px-5 py-3 rounded-xl
                   transition-all"
            @click="navigate('/descargar-app')"
          >
            Descargar HayLugar
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.safe-top {
  height: env(safe-area-inset-top);
}

.mobile-nav-item {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
```
