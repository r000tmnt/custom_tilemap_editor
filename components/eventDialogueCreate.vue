<template>
    <v-dialog
      v-model="dialougeCreatedialog"
      width="auto"
      persistent
    >
        <v-card
            class="pa-2"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Create new event"
        >
            <v-row>
                <v-col>
                    <!-- The person to show on the screen -->
                    <v-select title="Person"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font color -->
                    <v-color-picker v-model="newDialogue.style"></v-color-picker>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font size -->
                    <v-select title="Font size"
                        v-model="newDialogue.size"
                        :items="fontSizes"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- content -->
                    <v-textarea label="Content"></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- audio (optional) -->
                    <v-select title="click audio"
                        :items="audioAssets.general"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- option (optional) -->
                    <v-btn>Create option</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex justify-end">
                    <v-btn color="grey" 
                        @click="toggleDialog('scene-dialogue-create')"
                        class="mr-2">CANCEL</v-btn>
                    <v-btn color="primary">CONFIRM</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import type { eventDialogueModel } from '~/types/level'

const { dialougeCreatedialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { audioAssets } = storeToRefs(useEditorStore())

const fontSizes = ref<string[]>([
    "fontSize",
    "fontSize_md",
    "fontSize_sm"
])

const newDialogue = ref<eventDialogueModel>({
    person: "",
    style: "#ffffff",
    size: "",
    content: "",
    audio: [],
    option: []
})
</script>
