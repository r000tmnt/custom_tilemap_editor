<template>
    <v-dialog
      v-model="editFrameDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        title="Edit frame"
        width="500"
      >
        <v-item-group id="frameGroup" class="d-flex mt-2" selected-class="selected">
            <v-item
                v-for="(img, index) in props.frames"
                :key="img" 
                v-slot="{ isSelected, selectedClass, toggle }"
                @group:selected="(v: any) => selectTile(v, index)"
                ref="frameItem">
                    <v-card
                    class="ma-2"
                    :class="['d-flex align-center bg-grey', selectedClass]"
                    dark
                    :rounded="0"
                    @click="toggle"
                    >
                        <v-img 
                            :width="tileSize" 
                            :height="tileSize" 
                            alt="tile"
                            :src="img"
                            @click="getAssetsToDelete(String(img))">
                        </v-img>
                    </v-card>
            </v-item>
            <v-item>
                <v-btn icon="mdi-plus" class="ml-2" @click="activeHiddenUploader"></v-btn>
                <!-- <v-btn icon="mdi-trash-can" class="ml-auto" color="danger" @drop="deleteFrame"></v-btn> -->
                <input accept="image/png"
                    class="opacity-0 w-0 h-0"
                    type="file"
                    ref="hiddenUploader"
                    multiple
                    @change="getFile"></input>
            </v-item>
        </v-item-group>  
        <v-card-actions>
            <v-btn class="ml-auto" color="secondary" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import type { PropType } from 'vue';

import Sortable from 'sortablejs'

const { tileSize } = storeToRefs(useMainStore())
const { editFrameDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore() 
const { sortAnimationAssets } = useEditorStore()

const props = defineProps({
    frames: {
        type: Array as PropType<string[]>,
        default: [] as string[]
    },
    type: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["clearSelectedAnmimation", "setAssetToDelete", "sendNewFrames", "animationToUpdate"])

const hiddenUploader = ref<HTMLInputElement | null>(null)

const frameItem = ref<HTMLDivElement | null>(null)

const selectedIndex = ref<number>(-1)

// Create sortable elements when images are loaded
watch(() => frameItem.value, (newVal, oldVal) => {
    console.log(newVal)
    if(newVal){
        const frameGroup = document.getElementById("frameGroup")
        if(frameGroup !== null)
            // Create sortable elements with options
            Sortable.create(frameGroup, {
                // Fire an event on image order changes
                onUpdate: async function (e: any) {
                    console.log("sorting update :>>>", e)
                    // Inform backend to change file orders
                    const { oldIndex, newIndex, explicitOriginalTarget } = e
                    console.log("oldIndex :>>>", oldIndex)
                    console.log("newIndex :>>>", newIndex)
                    const { currentSrc } = explicitOriginalTarget
                    const srcArr = currentSrc.split("/")
                    console.log("scrArr", srcArr)
                    const type = srcArr[5]
                    const oldFileName = srcArr[srcArr.length - 1]

                    // Pass the new order to the store
                    await sortAnimationAssets({ oldIndex, newIndex, type, oldFileName })
                }
            })
    }
})

// Get asset file name
const getAssetsToDelete = (asset: string) => {
  console.log("asset:>>> ", asset)
  const assetPathArray = asset.split("/")
  emit("setAssetToDelete", assetPathArray[assetPathArray.length - 1])
  toggleDialog("assets-delete")
}

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
    selectedIndex.value = index
    // if(v.value){

    // }
}

const cancelEdit = () => {
    toggleDialog("edit-frame")
}

const activeHiddenUploader = () => {
    if(hiddenUploader.value){
        hiddenUploader.value.click()
    }
}

const getFile = (e: Event) => {
    console.log("getFile :>>>", e)
    const target = e.target as HTMLInputElement

    if(target.files?.length){
        const animationTypeArr = props.frames[0].split("_")
        const name = `${props.type.split("-")[1]}_${animationTypeArr[1]}_${animationTypeArr[2]}_${animationTypeArr[3]}`
        emit("sendNewFrames", { files: Array.from(target.files), name })
    }
}

// const deleteFrame = (e: Event) => {
//     console.log("deleteFrame :>>>", e)
// }

onMounted(() => {
    console.log(hiddenUploader.value)
    console.log(frameItem.value)
    console.log(props.type)
})
</script>

<style scoped>
.selected{
    border: 1px solid yellow;
}
</style>
