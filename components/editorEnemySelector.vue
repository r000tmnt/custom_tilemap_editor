<template>
    <v-select
        label="Select"
        :items="mobs.map((m: mobDataModel) => m.id)"
    ></v-select>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import type { mobDataModel } from '~/types/character';

const { assets } = storeToRefs(useEditorStore())
const { mobs } = storeToRefs(useCharacterStore())
</script>
