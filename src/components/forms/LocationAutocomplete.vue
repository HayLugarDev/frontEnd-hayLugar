<template>
  <div class="flex flex-col">
    <!-- Input con autocomplete -->
    <div>
      <GMapAutocomplete
        class="input-field"
        @place_changed="handlePlaceChanged"
        placeholder="Ingresá tu dirección"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface LocationData {
  location: string;
  latitude: number | null;
  longitude: number | null;
}

const props = defineProps<{ modelValue: LocationData }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: LocationData): void;
}>();

// Estado interno reactivo
const internalValue = ref<LocationData>({
  location: props.modelValue?.location || "",
  latitude: props.modelValue?.latitude || null,
  longitude: props.modelValue?.longitude || null,
});

// Sincronizar hacia el padre
watch(internalValue, (val) => {
  emit("update:modelValue", val);
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (newVal) internalValue.value = { ...newVal };
}, { deep: true });

const handlePlaceChanged = (place: any) => {
  const components = place.address_components || [];

  const streetNumber = components.find((c: any) => c.types.includes("street_number"))?.long_name || "";
  const route = components.find((c: any) => c.types.includes("route"))?.long_name || "";
  const locality = components.find((c: any) => c.types.includes("locality") || c.types.includes("sublocality"))?.long_name || "";
  const province = components.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name || "";
  const country = components.find((c: any) => c.types.includes("country"))?.long_name || "";

  const street = [route, streetNumber].filter(Boolean).join(" ");
  const parts = [street, locality, province, country].filter(Boolean);

  internalValue.value = {
    ...internalValue.value,
    location: parts.join(", "),
    latitude: place.geometry.location.lat(),
    longitude: place.geometry.location.lng()
  };
};
</script>
