<template>
    <v-dialog
      v-model="bgAssetsGalleryDialog"
      width="auto"
      persistent
    >
        <v-card
            class="pa-2"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Background images"
        >
            <v-row>
                <v-col v-for="path in assets.bg" :key="path" 
                cols="4">
                    <v-img :src="path"
                        :width="300"
                        :max-height="300"
                        cover
                        @click="selectBackground(path)"></v-img>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-btn class="mx-auto" @click="toggleDialog('scene-bg')">CANCEL</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
const { assets } = storeToRefs(useEditorStore())
const { bgAssetsGalleryDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const emit = defineEmits(["setSceneBackGround"])

const selectBackground = (path: string) => {
    emit("setSceneBackGround", path)
    toggleDialog("scene-bg")
}
</script>

