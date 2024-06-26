<template>
    <v-dialog
      v-model="outputMessage"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2 text-center"
        :class="{'text-red': buildMessage.includes('Failed')}"
        title="Packing up project"
        width="500"
      >
        <v-progress-circular class="mx-auto my-4" :model-value="value" :rotate="360" :size="100" :width="15" color="teal">
            <template v-slot:default> {{ value }} % </template>
        </v-progress-circular>

        {{ buildMessage }}
        <v-card-actions>
            <v-btn class="mx-auto" 
                color="primary" 
                :disabled="!buildMessage.includes('Failed') && !buildMessage.includes('Done')"
                @click="toggleDialog('output-message')">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeUnmount } from 'vue';

const { outputMessage } = storeToRefs(useDialogStore())
const { buildMessage } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()

const value = ref<number>(0)

watch(() => buildMessage.value, (newMsg, oldMsg) => {
    if(newMsg.length && !newMsg.includes("Failed")){
        if(newMsg.includes("Done")){
            value.value = 100
        }else{
            value.value += Math.floor(100/7)
        }
    }
})

// Reset progress value when closing dialog
onBeforeUnmount(() => {
    console.log("outputmessagewindow onBeforeUnmount")
    value.value = 0
})
</script>
