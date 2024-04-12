<template>
    <v-dialog
      v-model="eventItemDialog"
      width="auto"
    >
        <v-card
            class="pa-2"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Choose items for the event"
        >
            <v-list>
                <v-list-item
                    v-for="(value, name, index) in item">
                    <v-card :title="name"
                        v-for="(val, pointer) in value">
                            <div @click="selectItem(val)">
                                {{ val }}
                            </div>
                    </v-card>
                </v-list-item>
            </v-list>    
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { materialDataModel, otherDataModel, potionDataModel, armorDataModel, weaponDataModel, keyDataModel } from "~/types/item";


const { item } = storeToRefs(useItemStore())
const { getItemData } = useItemStore()
const { eventItemDialog } = storeToRefs(useDialogStore())

const selectedItem = ref<materialDataModel[] | otherDataModel[] | potionDataModel[] | armorDataModel[] | weaponDataModel[] | keyDataModel[]>([])

const selectItem = (val: any) => {
    const exist = selectedItem.value.findIndex(s => s.id === val.id)
    if(exist >= 0){
        // Cancel selection
        selectedItem.value.splice(exist, 1)
    }else{
        // Add selection
        selectedItem.value.push(val)
    }
}

onBeforeMount(() => {
    getItemData()
})
</script>
