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
                            :src="img">
                        </v-img>
                    </v-card>
            </v-item>
            <v-item>
                <v-btn icon="mdi-plus" class="ml-2" @click="activeHiddenUploader"></v-btn>
                <input accept="image/png"
                    class="opacity-0 w-0 h-0"
                    type="file"
                    ref="hiddenUploader"
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

const { tileSize, base_url } = storeToRefs(useMainStore())
const { editFrameDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const props = defineProps({
    frames: {
        type: Array as PropType<string[]>,
        default: [] as string[]
    }
})

const emit = defineEmits(["clearSelectedAnmimation"])

const hiddenUploader = ref<HTMLInputElement | null>(null)

const frameItem = ref<HTMLDivElement | null>(null)

const selectedIndex = ref<number>(-1)

watch(() => frameItem.value, (newVal, oldVal) => {
    console.log(newVal)
    if(newVal){
        const frameGroup = document.getElementById("frameGroup")
        Sortable.create(frameGroup)
    }
})

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
}

onMounted(() => {
    console.log(hiddenUploader.value)
    console.log(frameItem.value)
})
</script>

<style scoped>
.selected{
    border: 1px solid yellow;
}
</style>
