<template>
    <v-dialog
        v-model="skillEditDialog"
        width="auto"
        persistent>
        <v-card
            class="pa-2"
            width="500"
            title="Edit skill">
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
                                :items="Object.entries(attributes).map(a => a[0])"
                                :rules="selectRules"></v-select>

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
                                v-model="defaultEffectType"
                                @update:model-value="updateEffectType"
                                :rules="selectRules"></v-select>
                            <v-text-field label="Skill range"
                                v-model="newSkill.effect.range"
                                :rules="numberRules"></v-text-field>
                            <v-select label="Skill based attribute"
                                v-model="newSkill.effect.base_on_attribute"
                                :items="Object.entries(attributes).map(a => a[0])"
                                :rules="selectRules"></v-select>
                            <v-select v-if="newSkill.type === 8"
                                label="Skill effect multiply"
                                :items="skillEffectMultiply"
                                v-model="defaultEffectMultiply"
                                :rules="selectRules"></v-select>
                            <v-select v-if="newSkill.type === 8"
                                label="Skill effect status"
                                :items="statusList"
                                v-model="newSkill.effect.status"
                                :rule="selectRules"></v-select>
                            <v-text-field label="Skill effect base number"
                                type="number"
                                v-model="newSkill.effect.base_number"
                                :rules="itemEffectAmountRules"></v-text-field>
                            <v-text-field label="Description"
                                v-model="newSkill.effect.desc"
                                :rules="inputRules"></v-text-field>
                        </v-card>
                    </template>
                </v-stepper>
            </v-form>

            <v-card-actions class="d-flex justify-end">
                <v-btn color="gray" @click="toggleDialog('skill-edit')">CANCEL</v-btn>
                <v-btn color="primary" @click="editSkill">SUBMIT</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
// import type { itemTypeModel } from '~/types/item';

const { skillEditDialog } = storeToRefs(useDialogStore())
const { skillTypes, skillEffectType, skillEffectMultiply } = storeToRefs(useSkillStore())
const { attributes, statusList } = storeToRefs(useCharacterStore())
const { toggleDialog } = useDialogStore()
const { updateSkillData } = useSkillStore()
const { inputRules, numberRules, selectRules, itemEffectAmountRules } = useRuleStore()

const props = defineProps({
    skill: {
        type: Object,
        default: {
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
        }
    },
    index: {
        type: Number,
        default: 0
    }
})

const formRef = ref()

const compateTarget = ref<string[]>([])

const defaultSelect = ref<string>("none")
const defaultEffectType = ref<string>("offence")
const defaultEffectMultiply = ref<string>("solid")

const newSkill = ref<any>({})


const switchSkillType = (v: any) => {
    console.log(v)

    switch(v){
        case "status":
            newSkill.value = {
                ...newSkill.value,
                type: 8,
                effect: {
                    type: skillEffectType.value[newSkill.value.effect.type],
                    range: newSkill.value.effect.range,
                    base_on_attribute: newSkill.value.effect.base_on_attribute,
                    multiplay_as: skillEffectMultiply.value[newSkill.value.effect.multiplay_as],
                    status: newSkill.value.effect.status? newSkill.value.effect.status : "",
                    turn: newSkill.value.effect.turn? newSkill.value.effect.turn : 0,
                    base_number: newSkill.value.effect.base_number,
                    desc: newSkill.value.effect.desc
                }
            }
        break;
        default:
            newSkill.value = {
                ...newSkill.value,
                type: skillTypes.value.findIndex(s => s.category === v),
                effect: {
                    type: skillEffectType.value[newSkill.value.effect.type],
                    range: newSkill.value.effect.range,
                    base_on_attribute: newSkill.value.effect.base_on_attribute,
                    multiplay_as: skillEffectMultiply.value[newSkill.value.effect.multiplay_as],
                    base_number: newSkill.value.effect.base_number,
                    desc: newSkill.value.effect.desc
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

const editSkill = () => {
    formRef.value?.validate().then((response: any) => {
        if(response.valid){
            // Action
            updateSkillData(newSkill.value, skillTypes.value[newSkill.value.type].category, props.index)
            toggleDialog('skill-edit')
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

    newSkill.value = JSON.parse(JSON.stringify(props.skill))
    defaultSelect.value = skillTypes.value[newSkill.value.type].category
    defaultEffectType.value = skillEffectType.value[newSkill.value.effect.type]
    defaultEffectMultiply.value = skillEffectMultiply.value[newSkill.value.effect.multiplay_as]
    switchSkillType(defaultSelect.value)
})
</script>