<template>
    <v-dialog
      v-model="optionResponseDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Edit event option response"
      >
        <v-form ref="myForm">
            <v-row>
                <v-col>
                    <!-- The person to show on the screen -->
                    <v-select label="Person"
                        v-model="msgToEdit.person"
                        :items="characterList"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font color -->
                    <p>Font color</p>
                    <v-color-picker v-model="msgToEdit.style"
                        :rules="inputRules"
                        hide-canvas></v-color-picker>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font size -->
                    <v-select label="Font size"
                        v-model="msgToEdit.size"
                        :items="fontSizes"
                        :rules="selectRules"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- content -->
                    <v-textarea label="Content"
                        v-model="msgToEdit.content"
                        :rules="inputRules"></v-textarea>
                </v-col>
            </v-row>            
        </v-form>
        <v-card-actions>
            <v-btn @click="toggleDialog('option-response')">CANCEL</v-btn>
            <v-btn color="primary" @click="confirmResponse">CONFIRM</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import type { eventDialogueModel } from '~/types/level';

const { optionResponseDialog } = storeToRefs(useDialogStore())
const { characterList, fontSizes } = storeToRefs(useEditorStore())
const { inputRules, selectRules } = useRuleStore()
const { toggleDialog } = useDialogStore()

const props = defineProps({
    msg: {
        type: Object as PropType<eventDialogueModel>,
        default: {
            person: "",
            style: "",
            size: "",
            content: ""
        } 
    }
})

const emit = defineEmits(["confirmResponse"])

const myForm = ref<HTMLFormElement | null>(null)

const msgToEdit = ref<eventDialogueModel>({
            person: "",
            style: "#ffffff",
            size: "fontSize_md",
            content: ""
        } )

watch(() => props.msg, (newMsg, oldMsg) => {
    if(newMsg){
        msgToEdit.value = JSON.parse(JSON.stringify(props.msg))
    }
})

const confirmResponse = () => {
    myForm.value?.validate().then((result: any) => {
        if(result.valid){
            emit("confirmResponse", msgToEdit.value)
            toggleDialog("option-response")
        }
    })
}
</script>
