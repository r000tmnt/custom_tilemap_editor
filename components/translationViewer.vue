<template>
    <v-dialog
  v-model="translationViewer"
  width="auto"
  persistent
>
  <v-card
    class="pa-2"
    width="1000"
    :title="`${props.type} translation`"
  >

    <v-list-item v-for="item in translationData[props.type as keyof translationDataModel]">
        {{ item }}
    </v-list-item>
    <!--<div class="d-flex">
         en message & zh message 
        <v-data-table></v-data-table>
        <v-data-table></v-data-table>
    </div>-->
    <v-card-actions>
        <v-btn @click="toggleDialog('translation-viewer')">CLOSE</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { translationDataModel } from '~/types/level';

const { translationData } = storeToRefs(useLangStore())
const { translationViewer } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const props = defineProps({
    type: {
        type: String,
        default: "class"
    }
})

</script>
