<template>
    <v-dialog
        v-model="itemEditDialog"
        width="auto"
        persistent>
        <v-card
            class="pa-2"
            width="500"
            title="Edit item">
            <v-form v-if="Object.entries(newItem).length" 
                ref="formRef" 
                class="pt-4 px-5">

                <v-stepper :items="['Define type', 'Basic info', 'Define effect']">
                    <template v-slot:item.1>
                        <v-card title="Define type" flat>
                            <v-select label="Type"
                                :items="type.map(t => t.category)"
                                :value="type[newItem.type].category"
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
                                    :rules="selectRules"></v-select>
                                <v-text-field label="Effect amount"
                                    type="number"
                                    :rules="numberRules"></v-text-field>
                                <v-text-field v-if="newItem.effect.type === 3"
                                    label="Effect rate"
                                    type="number"
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

                            <template v-if="newItem.type === 6">
                                <v-select label="Rarity"
                                    v-model="newItem.effect.rare"
                                    :items="itemRarity"
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
                                    v-model="newItem.effect.item_drop_modify"
                                    :rules="selectMultipleRules"></v-select>
                            </template>

                            <v-text-field label="desc"
                                v-model="newItem.effect.desc"
                                :rules="inputRules"></v-text-field>
                        </v-card>
                    </template>
                </v-stepper>
            </v-form>

            <v-card-actions class="d-flex justify-end">
                <v-btn color="gray" @click="toggleDialog('item-edit')">CANCEL</v-btn>
                <v-btn color="primary" @click="editItem">SUBMIT</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
// import type { itemTypeModel } from '~/types/item';

const { itemEditDialog } = storeToRefs(useDialogStore())
const { type, conditionList, itemRarity, itemEffectType, itemEquipPosition } = storeToRefs(useItemStore())
const { attributes, statusList } = storeToRefs(useCharacterStore())
const { toggleDialog } = useDialogStore()
const { updateItemData, getItemType } = useItemStore()
const { inputRules, numberRules, selectRules, selectMultipleRules } = useRuleStore()

const props = defineProps({
    item: {
        type: Object,
        default: {}
    },
    index: {
        type: Number,
        default: 0,
    }
})

const formRef = ref()

const compateTarget = ref<string[]>([])

const newItem = ref<any>({})

const switchItemType = (v: any) => {
    console.log(v)

    switch(v){
        case 'potion':
            newItem.value.type = 0

            newItem.value["useCondition"] = newItem.value.useCondition? newItem.value.useCondition : {
                compare: "",
                target: ""
            }

            newItem.value.effect = {
                rare: newItem.value.effect.rare? newItem.value.effect.rare : "",
                type: newItem.value.effect.type? newItem.value.effect.type : 0,
                range: newItem.value.effect.range? newItem.value.effect.range : 1,
                target: newItem.value.effect.target? newItem.value.effect.target : "",
                amount: newItem.value.effect.amount? newItem.value.effect.amount : 0,
                desc: newItem.value.effect.desc
            }
        break;
        case 'other':
            newItem.value.type = 1

            newItem.value.effect = {
                desc: newItem.value.effect.desc
            }
        break;
        case 'material':
            newItem.value.type = 2

            newItem.value.effect = {
                rare: newItem.value.effect.rare? newItem.value.effect.rare : "",
                type: newItem.value.effect.type? newItem.value.effect.type : 0,
                range: newItem.value.effect.range? newItem.value.effect.range : 1,
                target: newItem.value.effect.target? newItem.value.effect.target : "",
                amount: newItem.value.effect.amount? newItem.value.effect.amount : 0,
                desc: newItem.value.effect.desc
            }
        break;
        case 'weapon':
            newItem.value.type = 3

            newItem.value.position = "hand"

            newItem.value.effect = {
                base_damage: newItem.value.effect.base_damage? newItem.value.effect.base_damage : {
                    min: 0,
                    max: 0
                },
                base_attribute: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[0]) : [],
                base_attribute_value: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[1]) : [],
                desc: newItem.value.effect.desc
            }
        break;
        case 'armor':
            newItem.value.type = 4

            newItem.value.position = newItem.value.position? newItem.value.position : ""

            newItem.value.effect = {
                base_attribute: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[0]) : [],
                base_attribute_value: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[1]) : [],
                desc: newItem.value.effect.desc
            }
        break;
        case 'accessory':
            newItem.value.type = 5

            newItem.value.effect = {
                rare: newItem.value.effect.rare? newItem.value.effect.rare : "",
                type: newItem.value.effect.type? newItem.value.effect.type : 0,
                target: newItem.value.effect.target? newItem.value.effect.target : "",
                amount: newItem.value.effect.amount? newItem.value.effect.amount : 0,
                base_attribute: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[0]) : [],
                base_attribute_value: newItem.value.effect.base_attribute? 
                    Object.entries(newItem.value.effect.base_attribute).map(e => e[1]) : [],
                desc: newItem.value.effect.desc
            }
        break;
        case 'key':
            newItem.value.type = 6

            newItem.value.effect = {
                rare: newItem.value.effect.rare? newItem.value.effect.rare : "",
                enemy_number: newItem.value.effect.enemy_number? newItem.value.effect.enemy_number : 3,
                elite_rate:  newItem.value.effect.elite_rate? newItem.value.effect.elite_rate : 30,
                item_drop_modify:  newItem.value.effect.item_drop_modify? newItem.value.effect.item_drop_modify : "",
                desc: newItem.value.effect.desc
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

const editItem = () => {
    formRef.value?.validate().then((response: any) => {
        if(response.valid){
            // Action
            updateItemData(newItem.value, type.value[newItem.value.type].category, props.index)
            toggleDialog('item-edit')
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

    console.log("onMounted :>>>", props.item)

    newItem.value = JSON.parse(JSON.stringify(props.item))
        switchItemType(type.value[newItem.value.type].category)
})

onBeforeMount(async() => {
    await getItemType()
})
</script>