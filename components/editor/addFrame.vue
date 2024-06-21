<template>
    <v-dialog
      v-model="createAnimation"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        title="Create animation"
        width="500"
      >
        <v-container >
            <v-form class="pt-4 px-5">
                <v-row>
                    Type: {{ type }}
                </v-row>
                <v-row>
                    <v-slider
                        v-model="animationLevel"
                        :max="5"
                        :min="1"
                        :step="1"
                        :label="`${type} level`"
                        thumb-label="always"
                    ></v-slider>
                </v-row>
                <v-row>
                    <v-text-field
                        placeholder="Name of the move"
                    ></v-text-field>     
                </v-row>
                
                Frames
                <v-item-group id="frameGroup" class="d-flex mt-2" selected-class="selected">
                    <v-item
                            v-for="(img, index) in frames"
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
                                        @click="getAssetsToDelete(index)">
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
            </v-form>            
        </v-container>

        <v-card-actions>
            <v-btn class="ml-auto" color="secondary" @click="cancelEdit">Cancel</v-btn>
            <v-btn color="primary">Submit</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'

import Sortable from 'sortablejs'

const { tileSize } = storeToRefs(useMainStore())
const { createAnimation } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore() 
const { sortAnimationAssets } = useEditorStore()

const props = defineProps({
    type: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["clearSelectedAnmimation", "setAssetToDelete", "sendNewFrames", "animationToUpdate"])

const hiddenUploader = ref<HTMLInputElement | null>(null)

const frames = ref<string[]>([])

const frameItem = ref<HTMLDivElement | null>(null)

const animationLevel = ref<number>(1)

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
                    // const type = srcArr[5]
                    // const oldFileName = srcArr[srcArr.length - 1]

                    // Pass the new order to the store
                    // await sortAnimationAssets({ oldIndex, newIndex, type, oldFileName })
                }
            })
    }
})

// Get asset file name
const getAssetsToDelete = (index: number) => {
    frames.value.splice(index, 1)
}

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
    selectedIndex.value = index
    // if(v.value){

    // }
}

const cancelEdit = () => {
    toggleDialog("create-animation")
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
        // Display on the screen
        const files = Array.from(target.files)

        for(let i=0; i < files.length; i++){
            const reader = new FileReader()
            reader.onloadend = function(){
                console.log(reader.result)
                frames.value.push(String(reader.result))
            }
            reader.readAsDataURL(files[i])
        }
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
