<template>
  <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-sm font-semibold">{{ title }}</div>
        <div class="text-xs text-white/70 mt-1">{{ subtitle }}</div>
      </div>

      <span class="text-[11px] px-2 py-1 rounded-full border border-white/15 bg-white/10">
        {{ badgeText }}
      </span>
    </div>

    <div class="mt-4 space-y-2">
      <div class="text-sm">
        <span class="opacity-80">Zona foco:</span>
        <span class="font-medium"> {{ focusCityLabel }}</span>
      </div>

      <div v-if="isPeak" class="text-sm">
        🔴 <span class="font-medium">Horario pico activo</span>
        <span class="text-white/70"> — máxima presión urbana</span>
      </div>
      <div v-else class="text-sm text-white/70">
        🟢 Fuera de pico — explorá igual el estado del tráfico
      </div>

      <div class="pt-2">
        <div class="text-xs text-white/70">Mensaje (HayLugar)</div>
        <div class="mt-1 text-sm leading-relaxed">
          {{ narrative }}
        </div>
      </div>

      <div class="pt-3 flex gap-2">
       
          <button
              class="hidden md:block bg-[#06D6A0] hover:bg-[#00B4D8] 
                    text-[#0D1B2A] font-semibold px-4 py-2 rounded-xl 
                    shadow-lg text-sm transition-all"
              type="button"
              @click="goAddSpace"
            >
              + Publica tu espacio
          </button>

       <button
              class="hidden md:block bg-[#06D6A0] hover:bg-[#00B4D8] 
                    text-[#0D1B2A] font-semibold px-4 py-2 rounded-xl 
                    shadow-lg text-sm transition-all"
              type="button"
              @click="goDashboard"
            >
              Reservar
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goAddSpace() {
  router.push({ path: "/login" });
}
function goDashboard() {
  router.push({ path: "/dashboard" });
}
const props = defineProps<{
  title: string;
  subtitle: string;
  focusCityLabel: string;
  isPeak: boolean;
  trafficEnabled: boolean;
  narrative: string;
  level: "green" | "yellow" | "red";
}>();

defineEmits<{
  (e: "publish"): void;
  (e: "toggleTraffic"): void;
}>();

const badgeText = computed(() => {
  if (props.level === "red") return "Alta presión";
  if (props.level === "yellow") return "Media presión";
  return "Flujo estable";
});
</script>
