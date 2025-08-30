<template>
    <div v-for="i in 3" :key="i" class="animate-pulse flex flex-col space-y-2 p-6 bg-gray-100 rounded-xl">
        <div class="h-4 bg-gray-300 rounded w-1/3"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
</template>