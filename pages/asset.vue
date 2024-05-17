<template>
    <v-list>
        <v-list-item v-for="type in assetType"
            @click="selectType(type)">
            {{ type }}
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts" >
import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, onMounted } from 'vue'
import type { levelAssetModel } from '~/types/level';

const { assets } = storeToRefs(useEditorStore())
const { getImagesAssets, getAudioAssets, getBattleAudioAsset } = useEditorStore()

const assetType = ref(Object.entries(assets).map(a => a[0]))

const assetToDisplay = ref<any[]>([])

const selectType = (type: string) => {
    assetToDisplay.value = assets.value[type as keyof levelAssetModel]
}

onMounted(() => {
    assetType.value.push('audio')
}) 

onBeforeMount(() => {
    getImagesAssets()
    getAudioAssets()
    getBattleAudioAsset()
})
</script>
