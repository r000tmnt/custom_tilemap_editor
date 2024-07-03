<template>
    <v-dialog
      v-model="dialogueEditDialog"
      width="auto"
      persistent
    >
        <v-card
            class="pa-2"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Edit event dialogue"
        >
            <v-form ref="formRef" class="pt-4 px-5">
                <v-row>
                    <v-col>
                        <!-- The person to show on the screen -->
                        <v-select label="Person"
                            v-model="newDialogue.person"
                            :items="characterList"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- font color -->
                        <p>Font color</p>
                        <v-color-picker v-model="newDialogue.style"
                            :rules="inputRules"></v-color-picker>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- font size -->
                        <v-select label="Font size"
                            v-model="newDialogue.size"
                            :items="fontSizes"
                            :rules="selectRules"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- content -->
                        <v-textarea label="Content"
                            v-model="newDialogue.content"
                            :rules="inputRules"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <!-- audio (optional) -->
                        <v-select label="click audio (optional)"
                            :items="audioAssets.general"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <v-btn color="grey" 
                            @click="toggleDialog('scene-dialogue-edit')"
                            class="mr-2">CANCEL</v-btn>
                        <v-btn color="primary" @click="editDialogue">CONFIRM</v-btn>
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

const { dialogueEditDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { audioAssets, characterList, fontSizes } = storeToRefs(useEditorStore())
const { selectRules, inputRules } = useRuleStore()

const props = defineProps({
    dialogue: {
        type: Object,
        default: {
            person: "",
            style: "#ffffff",
            size: "fontSize_md",
            content: "",
            audio: []
        }
    }
})

const emit = defineEmits(["editDialogue"])

const newDialogue = ref<eventDialogueModel>(JSON.parse(JSON.stringify(props.dialogue)))

const formRef = ref()

const editDialogue = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.valid){
            emit("editDialogue", newDialogue.value)
            toggleDialog("scene-dialogue-edit")
        }
    })
}
</script>
