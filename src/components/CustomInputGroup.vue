<template>
    <div
        :class="`relative grid grid-cols-${columns} col-span-10 col-start-2 col-end-10 lg:col-span-8 lg:col-start-3 lg:col-end-10 xl:col-span-6 xl:col-start-3 xl:col-end-10 items-center justify-between rounded-full shadow-xl h-14`">

        <div v-for="(input, index) in inputs" :key="index"
            :class="`bg-${input.background} col-span-${columnSpan} relative flex items-center shadow-sm h-full ${index === 0 ? 'border-r rounded-l-full' : index === inputs.length - 1 ? 'border-none rounded-r-full' : 'border-r'}`">
            <label class="absolute top-1 left-6 px-2 text-sm text-gray-600">{{ input.label }}</label>
            <input :placeholder="input.placeholder" :value="getValue(input)"
                @input="(e) => setValue(input, e.target.value)"
                class="text-md border-none w-full h-full rounded-full hover:bg-gray-100 px-8 text-gray-800" />
        </div>

        <div class="absolute p-0.5 h-full right-0.5">
            <button @click="onSearch"
                class="z-1 col-span-1 p-2 h-full w-14 text-white hover:bg-primary bg-slate-700 text-xl rounded-full">
                <font-awesome-icon icon="search" />
            </button>
        </div>

    </div>
</template>

<script setup>
import { isRef } from 'vue';

const props = defineProps({
    inputs: {
        type: Array,
        required: true,
    },
    columns: {
        type: Number,
        default: 6,
    },
    columnSpan: {
        type: Number,
        default: 2,
    },
    onSearch: {
        type: Function,
        required: true,
    },
});

function getValue(input) {
    return isRef(input.modelValue) ? input.modelValue.value : input.modelValue;
}

function setValue(input, value) {
    if (isRef(input.modelValue)) {
        input.modelValue.value = value;
    } else {
        input.modelValue = value;
    }
}
</script>