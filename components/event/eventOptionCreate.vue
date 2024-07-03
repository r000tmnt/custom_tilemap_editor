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
        <v-form ref="formRef" class="pt-4 px-5">
            <v-row>
                <v-col>
                    <!-- Value -->
                    <v-text-field label="Option value" 
                        v-model="newOption.value"
                        :rules="inputRules"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn prepend-icon="mdi-plus-box" color="primary" @click="appendNewResponse">
                        Create option response
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-list>
                    <v-list-item  v-for="(msg, index) in newOption.response" 
                        :key="msg.content"
                        @click="editResponse(index)">
                        {{ `Response ${index + 1}. ${msg.content.length? msg.content.substring(0, 4) +'...' : 'blank'}` }}

                        <v-icon icon="mdi-trash-can" 
                        color="danger"
                        class="ml-2" 
                        @click.stop="deleteResponse(index)"></v-icon>
                    </v-list-item>
                </v-list>
            </v-row>
            <v-row>
                <v-col>
                    <v-select label="Option condition type"
                        :items="optionConditionType"
                        v-model="newOption.condition.type"
                        @update:model-value="setConditionValueList"></v-select>
                    <v-select label="Option condition value"
                        :disabled="!newOption.condition.type.length"
                        :items="optionConditionValue"
                        v-model="newOption.condition.value"></v-select>
                    <v-checkbox v-if="newOption.condition.type === 'item'" 
                        label="In possession?"
                        v-model="newOption.condition.possess"></v-checkbox>
                    <v-checkbox v-if="newOption.condition.type === 'status'"
                        label="Greater than"
                        v-model="newOption.condition.greater"></v-checkbox>
                    <v-text-field v-if="newOption.condition.type === 'status'"
                        type="number"
                        placeholder="In percentage"
                        v-model="newOption.condition.percentage"></v-text-field>
                    <v-checkbox v-if="newOption.condition.type === 'player' || newOption.condition.type === 'enemy'"
                        lable="If the player or the enemy is on the field"
                        v-model="newOption.condition.down"></v-checkbox>
                    <v-checkbox v-if="newOption.condition.type === 'option'"
                        label="If the option is selected"
                        v-model="newOption.condition.required"></v-checkbox>    
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- Effect -->
                    <v-btn @click="toggleDialog('option-effect-create')">Add effect</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex justify-end">
                    <v-btn color="grey" class=mr-2 @click="toggleDialog('dialogue-option-create')">CANCEL</v-btn>
                    <v-btn color="primary" @click="createOption">CONFIRM</v-btn>
                </v-col>
            </v-row>               
        </v-form>
   
      </v-card>
    </v-dialog>

    <event-option-effect @create-option-effect="confirmEffect" />
    <event-option-response :msg="msg" @confirm-response="createResponse" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import type { dialogueOptionModel, optionEffectModel, eventDialogueModel } from '~/types/level'

import eventOptionEffect from './eventOptionEffect.vue';
import eventOptionResponse from './eventOptionResponse.vue';

const { optionConditionType, optionConditionValue } = storeToRefs(useEditorStore())
const { optionCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { inputRules } = useRuleStore()
const { setConditionValueList } = useEditorStore()

const emit = defineEmits(["createOption"])

const formRef = ref()

const editIndex = ref<number>(0)

const msg = ref<eventDialogueModel>()

const newOption = ref<dialogueOptionModel>({
    value: "",
    style: "#ffffff",
    size: "",
    response: [],
    condition: {
        type: "",
        value: ""
    },
    effect: [],
})

const confirmEffect = (v: optionEffectModel) => {
    newOption.value.effect.push(v)
}

const appendNewResponse = () => {
    newOption.value.response.push({
        person: "",
        style: "",
        size: "",
        content: ""
    })
}

const editResponse = (index: number) => {
    editIndex.value = index
    msg.value = newOption.value.response[index]
    toggleDialog("option-response")
}

const createResponse = (v: eventDialogueModel) => {
    newOption.value.response[editIndex.value] = v
}

const deleteResponse = (index: number) => {
    newOption.value.response.splice(index, 1)
}

const createOption = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.valid){
            emit("createOption", newOption.value)
            toggleDialog("dialogue-option-create")
        }
    })
}
</script>
