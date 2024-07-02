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
                        v-model="msg.person"
                        :items="characterList"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font color -->
                    <p>Font color</p>
                    <v-color-picker v-model="msg.style"
                        :rules="inputRules"
                        hide-canvas></v-color-picker>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- font size -->
                    <v-select label="Font size"
                        v-model="msg.size"
                        :items="fontSizes"
                        :rules="selectRules"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- content -->
                    <v-textarea label="Content"
                        v-model="msg.content"
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
import { ref } from 'vue';
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

const confirmResponse = () => {
    myForm.value?.validate().tehn((result: any) => {
        if(result.valid){
            emit("confirmResponse", props.msg)
        }
    })
}
</script>
