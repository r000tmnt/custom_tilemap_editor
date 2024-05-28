<template>
    <section id="wrapper">
        <div class="mr-auto">
            <h3>ASSETS</h3>
        </div>
        
        <div class="d-flex flex-wrap p-2 w-75 mx-auto">
            <v-row>
                <v-col v-for="type in assetType"
                    :key="type"
                    cols="4">
                    <v-card :title="type">
                        <template v-slot:actions>
                            <v-btn color="secondary" 
                                text="VIEW"
                                @click="() => {
                                    selectType(type);
                                    toggleDialog('asset-viewer');
                                }"></v-btn>
                        </template>
                    </v-card>
                </v-col>                
            </v-row>
        </div> 
        
        <assets-viewer v-if="assetViewer"
            :asset="assetToDisplay"
            :type="selectedType"
            @get-new-assets="selectType" />
    </section>
</template>

<script setup lang="ts" >
definePageMeta({
    layout: 'base'
})

import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, onMounted } from 'vue'
import type { levelAssetModel } from '~/types/level';

import assetsViewer from  '~/components/assetsViewer.vue'

const { assets, audioAssets } = storeToRefs(useEditorStore())
const { assetViewer } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { getImagesAssets, getAudioAssets, getBattleAudioAsset } = useEditorStore()

const assetType = ref(Object.entries(assets.value).map(a => a[0]))

const assetToDisplay = ref<any[]>([])
const selectedType = ref<string>("")

const selectType = (type: string) => {
    selectedType.value = type

    if(type === 'audio'){
        assetToDisplay.value = Object.entries(audioAssets.value).map(au => au[1])
        assetToDisplay.value = assetToDisplay.value.flat()
    }else{
        assetToDisplay.value = assets.value[type as keyof levelAssetModel]
    }
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
