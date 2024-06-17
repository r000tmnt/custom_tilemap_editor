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
        <v-item-group class="d-flex mt-2" selected-class="selected">
            <v-item
                v-for="(img, index) in props.frames"
                :key="img" 
                v-slot="{ isSelected, selectedClass, toggle }"
                @group:selected="(v: any) => selectTile(v, index)">
                    <v-card
                    :class="['d-flex align-center bg-grey', selectedClass]"
                    :height="tileSize"
                    :width="tileSize"
                    dark
                    :rounded="0"
                    @click="toggle"
                    >
                        <!-- <div
                            class="flex-grow-1 text-center"
                        >
                            {{ isSelected ? 'Selected' : 'Click Me!' }}
                        </div> -->
                        <v-img 
                            width="32" 
                            height="32" 
                            alt="tile"
                            :src="img">
                        </v-img>
                    </v-card>
            </v-item>
            <v-item>
                <v-btn density="compact" icon="mdi-plus" class="ml-2" @click="activeHiddenUploader"></v-btn>
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
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue';
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

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
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
})
</script>

<style scoped>
.selected{
    border: 1px solid yellow;
}
</style>
