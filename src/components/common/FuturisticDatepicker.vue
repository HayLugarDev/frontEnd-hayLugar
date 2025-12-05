<template>
    <div>
        <!-- Trigger -->
        <button @click="open = true"
            class="px-4 py-2 rounded-xl bg-[#0DAD83] text-white font-semibold shadow-md hover:opacity-90 transition">
                {{ formattedPreview ?? buttonLabel }} 
        </button>

        <!-- Modal -->
        <transition name="fade">
            <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                @keydown.esc="close">
                <transition name="scale-fade">
                    <div class="w-[92%] max-w-2xl bg-gradient-to-br from-[#08111a] to-[#0f1d2a] border border-white/6 rounded-2xl shadow-[0_10px_40px_rgba(13,173,131,0.08)] p-6"
                        role="dialog" aria-modal="true">
                        <!-- Header -->
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h3 class="text-lg font-semibold text-teal-300">Seleccioná fecha y hora</h3>
                                <p class="text-sm text-gray-400 mt-1">{{ formattedPreview }}</p>
                            </div>
                            <button @click="close" class="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div class="mt-4 grid grid-cols-1 gap-4">
                            <!-- Calendar (left) -->
                            <div v-if="!plazoInicial" class="bg-white/3 rounded-xl p-3">
                                <div class="flex items-center justify-between mb-3">
                                    <button @click="prevMonth" class="p-2 rounded-md hover:bg-white/5">◀</button>
                                    <div class="text-sm font-medium text-gray-200">{{ months[currentMonth] }} {{
                                        currentYear }}</div>
                                    <button @click="nextMonth" class="p-2 rounded-md hover:bg-white/5">▶</button>
                                </div>

                                <div class="grid grid-cols-7 text-xs text-gray-400 mb-2">
                                    <div v-for="d in shortDays" :key="d" class="text-center py-1">{{ d }}</div>
                                </div>

                                <div class="grid grid-cols-7 gap-1">
                                    <div v-for="(cell, idx) in calendarGrid" :key="idx"
                                        class="text-center p-2 rounded-lg select-none transition" :class="{
                                            // fuera del mes → gris apagado
                                            'text-gray-500 opacity-20 cursor-default': !cell.inMonth,

                                            // día deshabilitado por minDateTime
                                            'opacity-20 text-gray-500 cursor-not-allowed': cell.inMonth && cell.date && isDisabledDate(cell.date),

                                            // día seleccionado
                                            'bg-teal-600 text-white shadow cursor-pointer':
                                                cell.inMonth && !isDisabledDate(cell.date) && isSameDay(cell.date, selectedDate),

                                            // hover solo en días válidos
                                            'hover:bg-white/10 cursor-pointer':
                                                cell.inMonth && !isDisabledDate(cell.date) && !isSameDay(cell.date, selectedDate)
                                        }" @click="cell.inMonth && !isDisabledDate(cell.date) && pickDate(cell.date)">

                                        <div class="text-sm font-medium">{{ cell.day }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Timeline & Time controls (right) -->
                            <div v-if="plazo === 'Por hora'" class="bg-white/3 rounded-xl p-3 flex flex-col gap-4">
                                <div class="text-sm text-gray-300">Seleccione hora (arrastrar o click)</div>

                                <!-- Timeline container -->
                                <div ref="timeline" class="relative h-14 bg-white/6 rounded-lg flex items-center px-4"
                                    @mousedown.prevent="onDragStart($event)" @touchstart.prevent="onDragStart($event)">
                                    <!-- track -->
                                    <div class="absolute left-4 right-4 h-1 bg-white/10 rounded" />

                                    <!-- ticks -->
                                    <div
                                        class="absolute left-4 right-4 top-0 bottom-0 flex items-center justify-between">
                                        <div v-for="t in ticks" :key="t" class="w-0.5 h-3 bg-white/20" />
                                    </div>

                                    <!-- selected bar -->
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 h-1.5 bg-teal-400 rounded"
                                        :style="selectedBarStyle" />

                                    <!-- knob -->
                                    <div class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-lg flex items-center justify-center cursor-grab"
                                        :class="{ 'bg-teal-500': true }
                                            " :style="knobStyle" @mousedown.stop.prevent="onKnobMouseDown($event)"
                                        @touchstart.stop.prevent="onKnobTouchStart($event)">
                                        <div class="text-xs text-black font-bold">{{ knobLabel }}</div>
                                    </div>
                                </div>

                                <!-- time display + AM/PM -->
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-3xl font-bold text-teal-300">{{ displayTime }}</div>
                                        <div class="text-xs text-gray-400">Hora seleccionada</div>
                                    </div>

                                    <div class="flex gap-2">
                                        <button
                                            :class="['px-3 py-2 rounded-lg font-medium', amPm === 'AM' ? 'bg-white/10 text-white' : 'bg-white/4 text-gray-300']"
                                            @click="setAmPm('AM')">
                                            AM
                                        </button>
                                        <button
                                            :class="['px-3 py-2 rounded-lg font-medium', amPm === 'PM' ? 'bg-white/10 text-white' : 'bg-white/4 text-gray-300']"
                                            @click="setAmPm('PM')">
                                            PM
                                        </button>
                                    </div>
                                </div>

                                <!-- quick adjust buttons -->
                                <div class="flex gap-2">
                                    <button @click="decreaseHour" class="flex-1 py-2 rounded-lg bg-white/5">-1h</button>
                                    <button @click="increaseHour" class="flex-1 py-2 rounded-lg bg-white/5">+1h</button>
                                    <button @click="decreaseMinute"
                                        class="flex-1 py-2 rounded-lg bg-white/5">-5m</button>
                                    <button @click="increaseMinute"
                                        class="flex-1 py-2 rounded-lg bg-white/5">+5m</button>
                                </div>

                                <!-- footer small note -->
                                <div class="text-xs text-gray-500">Arrastrá el punto para ajustar la hora con precisión.
                                    Los minutos tienen pasos de 5.</div>
                            </div>
                        </div>

                        <!-- actions -->
                        <div class="mt-5 flex justify-end gap-3">
                            <button @click="close"
                                class="px-4 py-2 rounded-lg bg-gray-700/40 text-gray-200">Cancelar</button>
                            <button @click="confirm"
                                class="px-4 py-2 rounded-lg bg-teal-500 text-black font-semibold">Guardar</button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>

    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
    :icon="logo" @close="showErrorModal = false" @confirm="showErrorModal = false" />

</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import StatusModal from '../pages/addSpacePage/StatusModal.vue';
import logo from "../../assets/logo.png";

// Props / Emits
interface Props {
    modelValue?: string | null; // ISO date string (optional initial value)
    buttonLabel?: string;
    disablePast?: boolean; // bloquear fechas pasadas
    minDateTime: Date,
    plazo: 'Por hora' | 'Por dia' | 'Por semana' | 'Por mes';
    plazoInicial: Date
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    buttonLabel: 'Seleccionar fecha y hora',
    disablePast: false,
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// State
const open = ref(false);
const selectedDate = ref<Date | null>(props.modelValue ? new Date(props.modelValue) : null);
const selectedHour = ref<number>(selectedDate.value ? selectedDate.value.getHours() : 12);
const selectedMinute = ref<number>(selectedDate.value ? selectedDate.value.getMinutes() : 0);
const amPm = ref<string>(selectedHour.value >= 12 ? 'PM' : 'AM');

// Calendar helpers
const today = new Date();
const currentYear = ref(selectedDate.value ? selectedDate.value.getFullYear() : today.getFullYear());
const currentMonth = ref(selectedDate.value ? selectedDate.value.getMonth() : today.getMonth());

const shortDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const showErrorModal = ref(false);
const errorMessage = ref('');

function startOfMonth(y: number, m: number) {
    return new Date(y, m, 1);
}

function daysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
}

const calendarGrid = computed(() => {
    const first = startOfMonth(currentYear.value, currentMonth.value);
    const totalDays = daysInMonth(currentYear.value, currentMonth.value);
    const grid: Array<any> = [];

    // JS getDay: 0 Sun ... 6 Sat. Want Monday first: treat 1..7
    const offset = first.getDay() === 0 ? 6 : first.getDay() - 1;

    for (let i = 0; i < offset; i++) {
        grid.push({ inMonth: false, day: '', date: null });
    }

    for (let i = 1; i <= totalDays; i++) {
        grid.push({ inMonth: true, day: i, date: new Date(currentYear.value, currentMonth.value, i) });
    }

    return grid;
});

function prevMonth() {
    currentMonth.value--;
    if (currentMonth.value < 0) {
        currentMonth.value = 11;
        currentYear.value--;
    }
}
function nextMonth() {
    currentMonth.value++;
    if (currentMonth.value > 11) {
        currentMonth.value = 0;
        currentYear.value++;
    }
}

function pickDate(d: Date) {
    const min = props.minDateTime;

    // Comparar solo la parte de fecha (sin hora)
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const minDayStart = new Date(min.getFullYear(), min.getMonth(), min.getDate());

    // ❌ Día anterior al mínimo → bloquear
    if (dayStart < minDayStart) return;

    selectedDate.value = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        selectedHour.value,
        selectedMinute.value
    );

    // Si es el MISMO DÍA → corregir hora mínima
    if (dayStart.getTime() === minDayStart.getTime()) {
        if (selectedDate.value < min) {
            selectedDate.value = new Date(min);
            selectedHour.value = min.getHours();
            selectedMinute.value = min.getMinutes();
            syncTickFromHM();
        }
    }
}

function isDisabledDate(date: Date) {
    if (!props.minDateTime) return false;

    const min = props.minDateTime;

    // comparar solo la parte de la fecha
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const minD = new Date(min.getFullYear(), min.getMonth(), min.getDate());

    return d < minD; // true → día deshabilitado
}

function isSameDay(a: Date | null, b: Date | null) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Timeline (linear)
const timeline = ref<HTMLElement | null>(null);
const dragging = ref(false);
const ticks = Array.from({ length: 24 * 12 }, (_, i) => i); // ticks every 5 minutes -> 12 per hour

const totalTicks = ticks.length;

const selectedTickIndex = ref<number>((selectedHour.value % 24) * 12 + Math.round(selectedMinute.value / 5));

const knobLabel = computed(() => {
    const hh = Math.floor(selectedTickIndex.value / 12);
    return String(hh).padStart(2, '0');
});

const knobStyle = computed(() => {
    const pct = selectedTickIndex.value / (totalTicks - 1);
    return {
        left: `calc(1rem + ${pct * 100}% - 0.75rem)` // 1rem padding left/right in container
    } as any;
});

const selectedBarStyle = computed(() => {
    const pct = selectedTickIndex.value / (totalTicks - 1);
    return {
        left: '1rem',
        width: `calc(${pct * 100}% - 1rem)`
    } as any;
});

function updateFromTick(idx: number) {
    if (idx < 0) idx = 0;
    if (idx > totalTicks - 1) idx = totalTicks - 1;

    selectedTickIndex.value = idx;

    const h = Math.floor(idx / 12);
    const m = (idx % 12) * 5;

    let tempDate = null;
    if (selectedDate.value) {
        tempDate = new Date(
            selectedDate.value.getFullYear(),
            selectedDate.value.getMonth(),
            selectedDate.value.getDate(),
            h, m
        );
    }

    // BLOQUEAR hora bajo minDateTime si estamos en el mismo día
    if (tempDate && props.minDateTime) {
        const sameDay =
            tempDate.getFullYear() === props.minDateTime.getFullYear() &&
            tempDate.getMonth() === props.minDateTime.getMonth() &&
            tempDate.getDate() === props.minDateTime.getDate();

        if (sameDay && tempDate < props.minDateTime) {
            tempDate = new Date(props.minDateTime);
            selectedHour.value = tempDate.getHours();
            selectedMinute.value = tempDate.getMinutes();
            selectedTickIndex.value =
                selectedHour.value * 12 + Math.round(selectedMinute.value / 5);
        } else {
            selectedHour.value = h;
            selectedMinute.value = m;
        }
    } else {
        selectedHour.value = h;
        selectedMinute.value = m;
    }

    // Actualizamos AM/PM
    amPm.value = selectedHour.value >= 12 ? 'PM' : 'AM';

    // Actualizar selectedDate
    if (selectedDate.value) {
        selectedDate.value.setHours(selectedHour.value, selectedMinute.value, 0, 0);
    }
}


function pageX(e: MouseEvent | TouchEvent) {
    if ((e as TouchEvent).changedTouches) return (e as TouchEvent).changedTouches[0].pageX;
    return (e as MouseEvent).pageX;
}

function onDragStart(e: MouseEvent | TouchEvent) {
    dragging.value = true;
    window.addEventListener('mousemove', onDragging as any);
    window.addEventListener('mouseup', onDragEnd as any);
    window.addEventListener('touchmove', onDragging as any, { passive: false } as any);
    window.addEventListener('touchend', onDragEnd as any);
    onDragging(e as any);
}

function onDragging(e: MouseEvent | TouchEvent) {
    if (!dragging.value || !timeline.value) return;
    const rect = timeline.value.getBoundingClientRect();
    const x = pageX(e) - rect.left - 16; // 16px padding left
    const usable = rect.width - 32; // padding both sides
    let pct = x / usable;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    const idx = Math.round(pct * (totalTicks - 1));
    updateFromTick(idx);
}

function onDragEnd() {
    dragging.value = false;
    window.removeEventListener('mousemove', onDragging as any);
    window.removeEventListener('mouseup', onDragEnd as any);
    window.removeEventListener('touchmove', onDragging as any);
    window.removeEventListener('touchend', onDragEnd as any);
}

function onKnobMouseDown(e: MouseEvent) {
    e.stopPropagation();
    onDragStart(e);
}
function onKnobTouchStart(e: TouchEvent) {
    e.stopPropagation();
    onDragStart(e);
}

// small controls
function increaseHour() { selectedHour.value = (selectedHour.value + 1) % 24; syncTickFromHM(); }
function decreaseHour() { selectedHour.value = (selectedHour.value + 23) % 24; syncTickFromHM(); }
function increaseMinute() { selectedMinute.value = (selectedMinute.value + 5) % 60; syncTickFromHM(); }
function decreaseMinute() { selectedMinute.value = (selectedMinute.value + 55) % 60; syncTickFromHM(); }

function syncTickFromHM() {
    const idx = selectedHour.value * 12 + Math.round(selectedMinute.value / 5);
    updateFromTick(idx);
}

function setAmPm(val: string) {
    amPm.value = val;
    if (!selectedDate.value) return;
    let h = selectedHour.value % 12;
    if (val === 'PM') h = (h + 12) % 24;
    selectedHour.value = h;
    syncTickFromHM();
}

// Display helpers
const displayTime = computed(() => {
    const h = selectedHour.value % 24;
    const displayH = ((h % 12) === 0) ? 12 : (h % 12);
    return `${String(displayH).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')} ${amPm.value}`;
});

const formattedPreview = computed(() => {
    if (!selectedDate.value) return 'Sin fecha seleccionada';

    const dt = new Date(selectedDate.value);
    dt.setHours(selectedHour.value, selectedMinute.value, 0, 0);

    const day = dt.getDate().toString().padStart(2, '0');
    const month = (dt.getMonth() + 1).toString().padStart(2, '0');
    const year = dt.getFullYear();

    let h = dt.getHours();
    const m = dt.getMinutes().toString().padStart(2, '0');
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    return `${day}/${month}/${year} - ${h.toString().padStart(2, '0')}:${m} ${suffix}`;
});

// Actions
function confirm() {
    const hour = new Date();
    if (!selectedHour.value && !selectedMinute.value) {
        showErrorModal.value = true;
        errorMessage.value = 'Por favor, seleccioná una hora válida.';
        selectedDate.value = null;
        return;
    }
    if (selectedHour.value < props.plazoInicial.getHours() && isSameDay(selectedDate.value, props.plazoInicial)) {
        showErrorModal.value = true;
        errorMessage.value = 'La hora de salida no puede ser inferior a la hora de entrada.';
        selectedDate.value = null;
        return;
    }
    if (selectedHour.value < hour.getHours() && isSameDay(selectedDate.value, today)) {
        showErrorModal.value = true;
        errorMessage.value = 'La hora seleccionada ya pasó. Por favor, elegí una hora futura.';
        return;
    }
    if (!selectedDate.value) {
        // if not chosen, pick today
        const t = new Date();
        selectedDate.value = new Date(t.getFullYear(), t.getMonth(), t.getDate(), selectedHour.value, selectedMinute.value);
    } else {
        selectedDate.value.setHours(selectedHour.value, selectedMinute.value, 0, 0);
    }
    const iso = selectedDate.value.toISOString();
    emit('update:modelValue', iso);
    emit('confirm', iso);
    open.value = false;
}

function close() {
    open.value = false;
}

// init event listeners cleanup
onMounted(() => {
    // if modelValue exists, sync
    if (props.modelValue) {
        const d = new Date(props.modelValue);
        selectedDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        selectedHour.value = d.getHours();
        selectedMinute.value = d.getMinutes();
        syncTickFromHM();
    }
});

onBeforeUnmount(() => {
    onDragEnd();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-fade-enter-active {
    animation: scaleIn .18s ease both;
}

@keyframes scaleIn {
    from {
        transform: scale(.96);
        opacity: 0
    }

    to {
        transform: scale(1);
        opacity: 1
    }
}

/* small visual polish to match futurist neon */
.bg-white\/3 {
    background-color: rgba(255, 255, 255, 0.03);
}

.bg-white\/4 {
    background-color: rgba(255, 255, 255, 0.04);
}

.bg-white\/5 {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>
