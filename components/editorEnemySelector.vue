<template>
    <v-select
        label="Select"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
    ></v-select>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const { assets } = storeToRefs(useEditorStore())

onMounted(() => {
    
})
</script>
