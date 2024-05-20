<template>
        <v-dialog
      v-model="assetViewer"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="View assets"
      >
        <v-row v-if="props.type !== 'audio'" class="pl-4">
          <v-col v-for="(img, index) in props.asset"
            :key="String(index)"
            class="d-flex child-flex ma-2"
            cols="4"
            >
            <v-img 
                :width="type === 'bg'? 100: 32" 
                :height="type === 'bg'? 100: 32" 
                :src="String(img)"
                aspect-ratio="1"
                cover></v-img>
          </v-col>
        </v-row>

        <div v-else
          class="d-flex flex-wrap">
          <vuetify-audio
            v-for="(audio, index) in props.asset"
            :file="audio"
            color="success"
          ></vuetify-audio>
        </div>

        <v-card-actions>
            <v-btn @click="toggleDialog('asset-viewer')">CLOSE</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import vuetifyAudio from "vuetify3-audio-player"

const { assetViewer } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const props = defineProps({
    asset: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: "env"
    }
})
</script>
