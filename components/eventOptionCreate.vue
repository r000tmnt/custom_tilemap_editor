<template>
    <v-dialog
      v-model="optionCreateDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Create event option"
      >
        <v-row>
            <v-col>
                <!-- Value -->
                <v-text-field label="Value" v-model="newOption.value"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- Content -->
                <v-textarea label="Response" v-model="newOption.content"></v-textarea>
            </v-col>
        </v-row>
        <!-- <v-row>
            <v-col>
                <v-select title="click audio"
                        :items="audioAssets.general"></v-select>
            </v-col>
        </v-row> -->
        <v-row>
            <v-col>
                <!-- Effect -->
                <v-btn @click="toggleDialog('option-effect-create')">Add effect</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-end">
                <v-btn color="grey" class=mr-2 @click="toggleDialog('dialogue-option-create')">CANCEL</v-btn>
                <v-btn color="primary">CONFIRM</v-btn>
            </v-col>
        </v-row>      
      </v-card>
    </v-dialog>

    <event-option-effect />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import type { dialogueOptionModle } from '~/types/level'

import eventOptionEffect from './eventOptionEffect.vue';

// const { audioAssets } = storeToRefs(useEditorStore())
const { optionCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const newOption = ref<dialogueOptionModle>({
    value: "",
    style: "#ffffff",
    size: "",
    content: "",
    effect: []
})
</script>
