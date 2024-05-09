<template>
    <v-dialog
        v-model="skillCreateDialog"
        width="auto"
        persistent>
        <v-card
            class="pa-2"
            width="500"
            title="Create new item">
            <v-form ref="formRef" class="pt-4 px-5">

                <v-stepper :items="['Define type', 'Basic info', 'Define effect']">
                    <template v-slot:item.1>
                        <v-card title="Define type" flat>
                            <v-select label="Type"
                                :items="skillTypes.map(t => t.category)"
                                v-model="defaultSelect"
                                @update:model-value="switchSkillType"
                                :rules="selectRules">
                            </v-select>
                        </v-card>
                    </template>

                    <template v-slot:item.2>
                        <v-card title="Basic info" flat>
                            <v-text-field label="Name"
                                v-model="newSkill.name"
                                :rules="inputRules"></v-text-field>
                            
                            <v-select label="Skill cost"
                                v-model="newSkill.cost.attribute"
                                :items="Object.entries(attributes).map(a => a[0])"></v-select>

                            <v-text-field 
                                label="Cost value" 
                                type="number"
                                v-model=newSkill.cost.value
                                :rules="numberRules"></v-text-field>
                        </v-card>
                    </template>

                    <template v-slot:item.3>
                        <v-card title="Define effect" flat>
                            <v-select label="Skill effect type"
                                :items="skillEffectType"
                                @update:model-value="updateEffectType"
                                :rules="selectRules"></v-select>
                            <v-text-field label="Skill range"
                                v-model="newSkill.effect.range"></v-text-field>
                            <v-select label="Skill based attribute"
                                v-model="newSkill.effect.base_on_attribute"
                                :items="Object.entries(attributes).map(a => a[0])"></v-select>
                            <v-text-field label="Description"
                                v-model="newSkill.effect.desc"></v-text-field>
                        </v-card>
                    </template>
                </v-stepper>
            </v-form>

            <v-card-actions class="d-flex justify-end">
                <v-btn color="gray" @click="toggleDialog('skill-create')">CANCEL</v-btn>
                <v-btn color="primary" @click="createSkill">SUBMIT</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
// import type { itemTypeModel } from '~/types/item';

const { skillCreateDialog } = storeToRefs(useDialogStore())
const { skillTypes, skillEffectType, skillEffectMultiply } = storeToRefs(useSkillStore())
const { attributes, statusList } = storeToRefs(useCharacterStore())
const { toggleDialog } = useDialogStore()
const { updateSkillData } = useSkillStore()
const { inputRules, numberRules, selectRules, selectMultipleRules, itemEffectAmountRules } = useRuleStore()

const formRef = ref()

const compateTarget = ref<string[]>([])

const defaultSelect = ref<string>("none")

const newSkill = ref<any>({
    id: "",
    name: "",
    type: 0,
    cost: {
        attribute: "",
        value: 0
    },
    effect: {
        type: 0,
        range: 1,
        base_on_attribute: "",
        multiplay_as: 0,
        base_number: 0,
        desc: ""
    }
})

const switchSkillType = (v: any) => {
    console.log(v)

    switch(v){
        case "status":
            newSkill.value = {
                id: "",
                name: "",
                type: 8,
                cost: {
                    attribute: "",
                    value: 0
                },
                effect: {
                    type: 0,
                    range: 1,
                    base_on_attribute: "",
                    multiplay_as: 0,
                    status: "",
                    turn: 0,
                    base_number: 0,
                    desc: ""
                }
            }
        break;
        default:
            newSkill.value = {
                id: "",
                name: "",
                type: skillTypes.value.findIndex(s => s.category === v),
                cost: {
                    attribute: "",
                    value: 0
                },
                effect: {
                    type: 0,
                    range: 1,
                    base_on_attribute: "",
                    multiplay_as: 0,
                    base_number: 0,
                    desc: ""
                }
            } 
        break;
        // and more...
    }
}

const updateEffectType = (v: any) => {
    const typeIndedx = skillEffectType.value.findIndex(i => i === v)

    if(typeIndedx >= 0){
        newSkill.value.effect.type = typeIndedx
    }
}

const createSkill = () => {
    formRef.value?.validate().then((response: any) => {
        if(response.valid){
            // Action
            updateSkillData(newSkill.value, skillTypes.value[newSkill.value.type].category, -1)
            toggleDialog('skill-create')
        }
    })
}

onMounted(() => {
    for(let [key, value] of Object.entries(attributes.value)){
        compateTarget.value.push(key)
    }
    compateTarget.value = compateTarget.value.concat(statusList.value)
    compateTarget.value.push("status")
    compateTarget.value.push("all")

    switchSkillType(defaultSelect.value)
})
</script>