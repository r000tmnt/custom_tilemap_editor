<template>
    <v-dialog
      v-model="dialougeCreateDialog"
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
            <v-form ref="formRef">
                <v-row>
                    <v-col>
                        <!-- The person to show on the screen -->
                        <v-select title="Person"
                            :rules="selectRules"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- font color -->
                        <v-color-picker v-model="newDialogue.style"
                            :rules="inputRules"></v-color-picker>
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
                        <v-textarea label="Content"
                            :rules="selectRules"></v-textarea>
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
                    <v-col class="d-flex justify-end">
                        <v-btn color="grey" 
                            @click="toggleDialog('scene-dialogue-create')"
                            class="mr-2">CANCEL</v-btn>
                        <v-btn color="primary" @click="createDialog">CONFIRM</v-btn>
                    </v-col>
                </v-row>                
            </v-form>

        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import type { eventDialogueModel } from '~/types/level'

const { dialougeCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { audioAssets } = storeToRefs(useEditorStore())
const { selectRules, inputRules } = storeToRefs(useRuleStore())

const emit = defineEmits(["createDialogue"])

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
    audio: []
})

const formRef = ref()

const createDialog = () => {
    formRef.value?.validate((result: any) => {
        if(result.valid){
            emit("createDialogue", newDialogue)
            toggleDialog("scene-dialogue-create")
        }
    })
}
</script>
