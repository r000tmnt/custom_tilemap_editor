<template>
    <v-dialog
        v-model="itemCreateDialog"
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
                                :items="type.map(t => t.category)"
                                v-model="defaultSelect"
                                @update:model-value="switchItemType"
                                :rules="selectRules">
                            </v-select>
                        </v-card>
                    </template>

                    <template v-slot:item.2>
                        <v-card title="Basic info" flat>
                            <v-text-field label="Name"
                                v-model="newItem.name"
                                :rules="inputRules"></v-text-field>
                            
                            <v-text-field label="Stack limit" 
                                type="number"
                                v-model=newItem.stackLimit
                                :rules="numberRules"></v-text-field>

                            <template v-if="newItem.type === 0">
                                <v-select label="Compare"
                                    :items="conditionList"
                                    v-model="newItem.useCondition.compare"
                                    :rules="selectRules"></v-select>
                                <v-select label="Target"
                                    :items="compateTarget"
                                    v-model="newItem.useCondition.target"
                                    :rules="selectRules"></v-select>
                            </template>

                            <template v-if="newItem.type === 4">
                                <v-select label="Equip position"
                                    :items="itemEquipPosition"
                                    v-model="newItem.position"
                                    :rules="selectRules"></v-select>
                            </template>
                            <!-- <v-select label="Position"></v-select> -->
                        </v-card>
                    </template>

                    <template v-slot:item.3>
                        <v-card title="Define effect" flat>
                            <template v-if="newItem.type === 0 || newItem.type === 2">
                                <v-select label="Rarity"
                                    :items="itemRarity"
                                    v-model="newItem.effect.rare"
                                    :rules="selectRules"></v-select>
                                <v-select label="Effect type"
                                    :items="itemEffectType"
                                    @update:model-value="updateEffectType"
                                    :rules="selectRules"></v-select>
                                <v-text-field label="Effect range"
                                    type="number"
                                    v-model="newItem.effect.range"
                                    :rules="numberRules"></v-text-field>
                                <v-select label="Effect target"
                                    :items="compateTarget"
                                    v-model="newItem.effect.target"
                                    :rules=selectRules></v-select>
                                <v-text-field label="Effect amount"
                                    type="number"
                                    v-model="newItem.effect.amount"
                                    :rules="itemEffectAmountRules"></v-text-field>
                                <v-text-field v-if="newItem.effect.type === 3"
                                    label="Effect rate"
                                    type="number"
                                    v-model="newItem.effect.rate"
                                    :rules="numberRules"></v-text-field>
                            </template>

                            <template v-if="newItem.type === 3 || newItem.type === 4">
                                <v-text-field v-if="newItem.type === 3"
                                    label="Min damage"
                                    type="number"
                                    v-model="newItem.effect.base_damage.min"
                                    :rules="numberRules"></v-text-field>
                                <v-text-field v-if="newItem.type === 3"
                                    label="Max damage"
                                    type="number"
                                    v-model="newItem.effect.base_damage.max"
                                    :rules="numberRules"></v-text-field>
                                <v-select label="Base attribute"
                                    multiple
                                    v-model="newItem.effect.base_attribute"
                                    :items="Object.entries(attributes).map(a => a[0])"
                                    :rules="selectMultipleRules"></v-select>
                                <v-text-field v-for="(attribute, index) in newItem.effect.base_attribute"
                                    :label="attribute"
                                    v-model="newItem.effect.base_attribute_value[index]"
                                    type="number"
                                    :rules="numberRules"></v-text-field>
                            </template>

                            <template v-if="newItem.type === 5">
                                <v-select label="Rarity"
                                    v-model="newItem.effect.rare"
                                    :items="itemRarity"></v-select>
                                <v-select label="Effect type"
                                    :items="itemEffectType"
                                    :value="itemEffectType[newItem.effect.type]"
                                    @update:model-value="updateEffectType"
                                    :rules="selectRules"></v-select>
                                <v-text-field label="Effect range"
                                    type="number"
                                    v-model="newItem.effect.range"
                                    :rules="numberRules"></v-text-field>
                                <v-select label="Effect target"
                                    :items="compateTarget"
                                    v-model="newItem.effect.target"
                                    :rules="selectRules"></v-select>
                                <v-text-field label="Effect amount"
                                    type="number"
                                    v-model="newItem.effect.amount"
                                    :rules="itemEffectAmountRules"></v-text-field>
                                <v-select label="Base attribute"
                                    multiple
                                    v-model="newItem.effect.base_attribute"
                                    :items="Object.entries(attributes).map(a => a[0])"
                                    :rules="selectMultipleRules"></v-select>
                                <v-text-field v-for="(attribute, index) in newItem.effect.base_attribute"
                                    :label="attribute"
                                    v-model="newItem.effect.base_attribute_value[index]"
                                    type="number"
                                    :rules="numberRules"></v-text-field>
                            </template>

                            <template v-if="newItem.type === 6">
                                <v-select label="Rarity"
                                    :items="itemRarity"
                                    v-model="newItem.effect.rare"
                                    :rules="selectRules"></v-select>
                                <v-text-field label="Enemy number"
                                    type="number"
                                    v-model="newItem.effect.enemy_number"
                                    :rules="numberRules"></v-text-field>
                                <v-text-field label="Elite rate"
                                    type="number"
                                    v-model="newItem.effect.elite_rate"
                                    :rules="numberRules"></v-text-field>
                                <v-select label="Item drop modify"
                                    multiple
                                    v-model="newItem.effect.item_drop_modify"></v-select>
                            </template>

                            <v-text-field label="desc"
                                v-model="newItem.effect.desc"
                                :rules="inputRules"></v-text-field>
                        </v-card>
                    </template>
                </v-stepper>
            </v-form>

            <v-card-actions class="d-flex justify-end">
                <v-btn color="gray" @click="toggleDialog('item-create')">CANCEL</v-btn>
                <v-btn color="primary" @click="createItem">SUBMIT</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
// import type { itemTypeModel } from '~/types/item';

const { itemCreateDialog } = storeToRefs(useDialogStore())
const { type, conditionList, itemRarity, itemEffectType, itemEquipPosition } = storeToRefs(useItemStore())
const { attributes, statusList } = storeToRefs(useCharacterStore())
const { toggleDialog } = useDialogStore()
const { updateItemData, getItemType } = useItemStore()
const { inputRules, numberRules, selectRules, selectMultipleRules, itemEffectAmountRules } = useRuleStore()

const formRef = ref()

const compateTarget = ref<string[]>([])

const defaultSelect = ref<string>("potion")

const newItem = ref<any>({
    id: "",
    name: "",
    type: 0,
    stackLimit: 1,
    effect: {
        desc: ""
    },
    prefix: [],
    suffix: []
})

const switchItemType = (v: any) => {
    console.log(v)

    switch(v){
        case 'potion':
            newItem.value = {
                id: "",
                name: "",
                type: 0,
                stackLimit: 0,
                effect: {
                    rare: "",
                    type: 0,
                    range: 1,
                    target: "",
                    amount: 1,
                    desc: ""
                },
                useCondition: {
                    compare: "",
                    target: ""
                },
                prefix: [],
                suffix: []
            }
        break;
        case 'other':
        newItem.value = {
                id: "",
                name: "",
                type: 1,
                stackLimit: 0,
                effect: {
                    desc: ""
                },
                prefix: [],
                suffix: []
            }
        break;
        case 'material':
            newItem.value = {
                id: "",
                name: "",
                type: 2,
                stackLimit: 0,
                effect: {
                    rare: "",
                    type: 0,
                    range: 1,
                    target: "",
                    amount: 1,
                    desc: ""
                },
                prefix: [],
                suffix: []
            }
        break;
        case 'weapon':
            newItem.value = {
                id: "",
                name: "",
                type: 3,
                stackLimit: 0,
                effect: {
                    base_damage: {
                        min: 0,
                        max: 0
                    },
                    base_attribute: [],
                    base_attribute_value: [],
                    desc: ""
                },
                position: "hand",
                prefix: [],
                suffix: []
            }
        break;
        case 'armor':
            newItem.value = {
                id: "",
                name: "",
                type: 4,
                stackLimit: 0,
                effect: {
                    base_attribute: [],
                    base_attribute_value: [],
                    desc: ""
                },
                position: "",
                prefix: [],
                suffix: []
            }
        break;
        case 'accessory':
            newItem.value = {
                id: "",
                name: "",
                type: 5,
                stackLimit: 0,
                effect: {
                    rare: "",
                    type: 0,
                    target: "",
                    amount: 0,
                    base_attribute: [],
                    base_attribute_value: [],
                    desc: ""
                },
                prefix: [],
                suffix: []
            }
        break;
        case 'key':
            newItem.value = {
                id: "",
                name: "",
                type: 6,
                stackLimit: 0,
                effect: {
                    rare: "",
                    enemy_number: 3,
                    elite_rate: 30,
                    item_drop_modify: [],
                    desc: ""
                },
                prefix: [],
                suffix: []
            }
        break;
    }
}

const updateEffectType = (v: any) => {
    const typeIndedx = itemEffectType.value.findIndex(i => i === v)

    if(typeIndedx >= 0){
        newItem.value.effect.type = typeIndedx
    }
}

const createItem = () => {
    formRef.value?.validate().then((response: any) => {
        if(response.valid){
            // Action
            updateItemData(newItem.value, type.value[newItem.value.type].category, -1)
            toggleDialog('item-create')
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

    switchItemType(defaultSelect.value)
})

onBeforeMount(async() => {
    await getItemType()
})
</script>