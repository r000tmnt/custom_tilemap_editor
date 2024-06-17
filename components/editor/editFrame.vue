<template>
    <v-dialog
      v-model="editFrameDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        title="Edit frame"
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
        </v-item-group>  
        <v-card-actions>
            <v-btn color="secondary" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
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

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
    // if(v.value){

    // }
}

const cancelEdit = () => {
    toggleDialog("edit-frame")
}
</script>

<style scoped>
.selected{
    border: 1px solid yellow;
}
</style>
