<template>
    <section id="wrapper">
        <div class="mr-auto">
            <h3>ASSETS</h3>
        </div>
        
        <div class="d-flex flex-wrap p-2 w-75 mx-auto mt-4">
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

const { assets, audioAssets, animationAssets } = storeToRefs(useEditorStore())
const { assetViewer } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { getImagesAssets, getAudioAssets, getBattleAudioAsset, getAnimationAssets } = useEditorStore()

const assetType = ref(Object.entries(assets.value).map(a => a[0]))

const assetToDisplay = ref<any[]>([])
const selectedType = ref<string>("")

const selectType = (type: string) => {
    selectedType.value = type

    switch(type){
        case 'audio-general':
            assetToDisplay.value = audioAssets.value.general.flat()
        break;
        case 'audio-battle':
            assetToDisplay.value = audioAssets.value.battle.flat()
        break;
        case 'animation-class':
            assetToDisplay.value = animationAssets.value.class.flat()
        break;
        case 'animation-mob':
            assetToDisplay.value = animationAssets.value.mob.flat()
        break;
        default:
            assetToDisplay.value = assets.value[type as keyof levelAssetModel]
        break;
    }
}

onMounted(() => {
    assetType.value.push('audio-general')
    assetType.value.push('audio-battle')
    assetType.value.push('animation-class')
    assetType.value.push('animation-mob')
}) 

onBeforeMount(() => {
    getImagesAssets()
    getAudioAssets()
    getBattleAudioAsset()
    getAnimationAssets()
})
</script>
