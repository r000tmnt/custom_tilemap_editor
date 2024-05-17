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
        <div class="d-flex">
            <v-img v-for="(img, index) in props.asset" 
                :key="img" 
                :width="type === 'bg'? 100: 32" 
                :height="type === 'bg'? 100: 32" 
                :src="img"></v-img>
        </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const { assetViewer } = storeToRefs(useDialogStore())

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
