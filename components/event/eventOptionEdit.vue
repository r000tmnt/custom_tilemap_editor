<template>
    <v-dialog
      v-model="optionEditDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Edit event option"
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
                <v-row>
                    <v-col>
                        <v-btn prepend-icon="mdi-plus-box" color="primary" @click="appendNewResponse">
                            Create option response
                        </v-btn>
                    </v-col>
                </v-row>
                <v-list>
                    <v-list-group 
                        v-for="(msg, index) in newOption.response" 
                        :key="msg.content"
                        :value="`Response ${index + 1}. ${msg.content}`">
                        <template v-slot:activator="{props}">
                            <v-list-item
                                v-bind="props"
                                :title="`Response ${index + 1}. ${msg.content}`"></v-list-item>
                        </template>

                        <v-list-item>
                            <!-- response -->
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
                        </v-list-item>
                    </v-list-group>
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
                    <v-btn color="grey" class=mr-2 @click="toggleDialog('dialogue-option-edit')">CANCEL</v-btn>
                    <v-btn color="primary" @click="createOption">CONFIRM</v-btn>
                </v-col>
            </v-row>               
        </v-form>
   
      </v-card>
    </v-dialog>

    <event-option-effect @create-option-effect="confirmEffect" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { dialogueOptionModel, optionEffectModel } from '~/types/level'

import eventOptionEffect from './eventOptionEffect.vue';

const { optionConditionType, optionConditionValue } = storeToRefs(useEditorStore())
const { optionEditDialog } = storeToRefs(useDialogStore())
const { type } = storeToRefs(useItemStore())
const { characterList, fontSizes } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()
const { inputRules, selectRules } = useRuleStore()
const { getItemType } = useItemStore()

const props = defineProps({
    option: {
        type: Object as PropType<dialogueOptionModel>,
        default: {
            value: "",
            style: "#ffffff",
            size: "",
            content: "",
            condition: {
                type: "",
                value: ""
            },
            effect: []
        }
    }
})

const emit = defineEmits(["editOption"])

const formRef = ref()

const newOption = ref<dialogueOptionModel>(props.option)

const confirmEffect = (v: optionEffectModel) => {
    newOption.value.effect.push(v)
}

const setConditionValueList = () => {
    console.log(newOption.value.condition.type)
    switch(newOption.value.condition.type){
        case "item":
            getItemType().then(() => {
                optionConditionValue.value = type.value.map(t => t.category)
                newOption.value.condition.possess = false
            })
        break;
        case "status":
            optionConditionValue.value = [
                "hp", 
                "mp", 
                "str", 
                "def", 
                "int",
                "spd", 
                "spi",
                "ap",
                "lck",
                "moveSpeed",
                "sight"
            ]
        break;
    }
}

watch(() => props.option, (newVal, oldVal) => {
    console.log(newVal)
    if(newVal){
        newOption.value = JSON.parse(JSON.stringify(props.option))
    }
}, { deep: true })

const appendNewResponse = () => {
    newOption.value.response.push({
        person: "",
        style: "",
        size: "",
        content: ""
    })
}

const createOption = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.valid){
            emit("editOption", newOption.value)
            toggleDialog("dialogue-option-edit")
        }
    })
}
</script>
