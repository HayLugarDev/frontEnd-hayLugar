<template>
  <div class="flex flex-col gap-3 ">

    <!-- ===== PROVINCIA ===== -->
    <div class="flex flex-col gap-2 ">
      <label class="text-xs text-white/70">Provincia</label>

      <div class="flex gap-2 items-center">
    <select
  class="w-full bg-[#020617] text-white border border-white/10 
         rounded-xl px-3 py-2 text-sm outline-none 
         focus:ring-2 focus:ring-white/20"
  :value="modelValue"
  @change="onProvinceChange"
>
  <option
    v-for="p in provinces"
    :key="p.id"
    :value="p.id"
    class="bg-[#020617] text-white"
  >
    {{ p.name }}
  </option>
</select>


        <button
          type="button"
          class="shrink-0 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15
                 border border-white/10 text-xs"
          @click="$emit('locate')"
        >
          Ir
        </button>
      </div>
    </div>

    <!-- ===== VISTAS DESTACADAS ===== -->
    <div
      v-if="currentProvince?.views?.length"
      class="flex flex-col gap-2 "
    >
      <label class="text-xs text-white/60">
        Vista destacada
      </label>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="view in currentProvince.views"
          :key="view.id"
          type="button"
          class="px-3 py-1.5 rounded-full text-xs border transition
                 backdrop-blur"
          :class="viewButtonClass(view.id)"
          @click="selectView(view.id)"
        >
          {{ view.name }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type {
  ProvinceConfig,
  ProvinceId,
} from "../../data/arProvinces"

/* ===================== PROPS ===================== */

const props = defineProps<{
  modelValue: ProvinceId
  viewId?: string | null
  provinces: ProvinceConfig[]
}>()

/* ===================== EMITS ===================== */

const emit = defineEmits<{
  (e: "update:modelValue", v: ProvinceId): void
  (e: "update:viewId", v: string | null): void
  (e: "locate"): void
}>()

/* ===================== COMPUTEDS ===================== */

const currentProvince = computed(() =>
  props.provinces.find(p => p.id === props.modelValue)
)

/* ===================== HANDLERS ===================== */

function onProvinceChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as ProvinceId

  emit("update:modelValue", value)

  // 🔄 reset vista al cambiar provincia
  emit("update:viewId", null)
}

function selectView(viewId: string) {
  emit("update:viewId", viewId)
}

function viewButtonClass(id: string) {
  const active = props.viewId === id

  return active
    ? "bg-white/20 border-white/30 text-white"
    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
}
</script>
