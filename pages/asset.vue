<template>
    <section id="wrapper">
        <div class="mr-auto">
            <h3>ASSETS</h3>
        </div>
        
        <div class="d-flex flex-wrap p-2 w-75 mx-auto">
            <v-row>
                <v-col v-for="type in assetType"
                    @click="selectType(type)"
                    cols="4">
                    <v-card :title="type">
                        <template v-slot:actions>
                            <v-btn color="secondary" text="VIEW"></v-btn>
                        </template>
                    </v-card>
                </v-col>                
            </v-row>

        </div>        
    </section>
</template>

<script setup lang="ts" >
definePageMeta({
    layout: 'base'
})

import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, onMounted } from 'vue'
import type { levelAssetModel } from '~/types/level';

const { assets } = storeToRefs(useEditorStore())
const { getImagesAssets, getAudioAssets, getBattleAudioAsset } = useEditorStore()

const assetType = ref(Object.entries(assets.value).map(a => a[0]))

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
