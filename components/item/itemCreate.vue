<template>
    <v-dialog
        v-model="itemCreateDialog"
        width="auto"
        persistent>
        <v-card
            class="pa-2"
            width="500"
            title="Create new level">
            <v-form ref="formRef" class="pt-4 px-5">

                <v-stepper :items="['Define type', 'Basic info', 'Define effect']">
                    <template v-slot:item.1>
                        <v-card title="Define type" flat>
                            <v-select label="Type"
                                :items="type.map(t => t.category)"
                                v-model="newItem.type"
                                @update:model-value="switchItemType">
                            </v-select>
                        </v-card>
                    </template>

                    <template v-slot:item.2>
                        <v-card title="Basic info" flat>
                            <v-text-field label="Name"
                                v-model="newItem.name"></v-text-field>
                            
                            <v-text-field label="Stack limit" 
                                type="number"
                                v-model=newItem.stackLimit></v-text-field>

                            <template v-if="newItem.type === 'potion'">
                                <v-select label="Compare"
                                    :items="conditionList"
                                    v-model="newItem.useCondition.compare"></v-select>
                                <v-select label="Target"
                                    :items="compateTarget"
                                    v-model="newItem.useCondition.target"></v-select>
                            </template>
                            <!-- <v-select label="Position"></v-select> -->
                        </v-card>
                    </template>

                    <template v-slot:item.3>
                        <v-card title="Define effect" flat>
                            <template v-if="newItem.type === 'potion'">
                                <v-select label="Rarity"
                                    :items="itemRarity"></v-select>
                                <v-select label="Effect type"
                                    :items="itemEffectType"></v-select>
                                <v-text-field label="Effect range"
                                    type="number"></v-text-field>
                                <v-select label="Effect target"
                                    :item="compateTarget"></v-select>
                                <v-text-field label="Effect amount"
                                    type="number"></v-text-field>
                            </template>

                            <v-text-field label="desc"
                                v-model="newItem.effect.desc"></v-text-field>
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
const { type, conditionList, itemRarity, itemEffectType } = storeToRefs(useItemStore())
const { toggleDialog } = useDialogStore()
const { updateItemData, getItemType } = useItemStore()
const { attributes, statusList } = storeToRefs(useCharacterStore())

const formRef = ref()

const compateTarget = ref<string[]>([])

const newItem = ref<any>({
    id: "",
    name: "",
    type: "",
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
            newItem.value["useCondition"] = {
                compare: "",
                target: ""
            }

            newItem.value.effect = {
                rare: "",
                type: 0,
                Range: 1,
                target: "",
                amount: 0,
                desc: newItem.value.effect.desc
            }
        break;
    }
}

const createItem = () => {
    formRef.value?.vailadate().then((response: any) => {
        if(response.vaild){
            // Action
            updateItemData(newItem.value, newItem.value.type, -1)
            toggleDialog('item-create')
        }
    })
}

onMounted(() => {
    for(let [key, value] of Object.entries(attributes.value)){
        compateTarget.value.push(key)
    }

    compateTarget.value.push("status")

    compateTarget.value = compateTarget.value.concat(statusList.value)
})

onBeforeMount(async() => {
    await getItemType()
})
</script>