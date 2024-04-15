<template>
    <v-dialog
      v-model="eventItemDialog"
      width="auto"
      persistent
    >
        <v-card
            class="pa-4"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Choose items for the event"
        >
            <v-item-group selected-class="bg-light-blue-lighten-5" :multiple="true">
                <v-item v-for="(value, name, index) in item" 
                    :key="name"
                    class="mt-4"
                    v-slot="{ isSelected, selectedClass, toggle }">
                    <span>{{ name }}</span>
                    <v-card v-for="(val, pointer) in value"
                        :key="pointer"
                        class="mb-4"
                        :class="[selectedClass]"
                        @click="selectItem(val)">
                            <div class="px-4 my-4 d-flex justify-space-between" @click="toggle">
                                <span>{{ val.name }}</span>

                                <div class="d-flex w-25" v-if="isSelected">
                                <!-- <v-icon icon="mdi-minus"></v-icon> -->
                                <v-text-field
                                    type="number" 
                                    label="Quantity" 
                                    bg-color="white" 
                                    @click.stop=""
                                    @input="(e: any) => setItemAmount(e, val.id)"></v-text-field>
                                <!-- <v-icon icon="mdi-plus"></v-icon> -->
                                </div>
                            </div>
                    </v-card>
                </v-item>
            </v-item-group>    
            
            <div class="d-flex justify-end">
                <v-btn class="mr-2 bg-grey" @click="toggleDialog('event-item')">Cancel</v-btn>
                <v-btn color="primary" @click="updateEvent">Confirm</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { materialDataModel, otherDataModel, potionDataModel, armorDataModel, weaponDataModel, keyDataModel } from "~/types/item";
import type { eventItemModel } from "~/types/level"


const { item } = storeToRefs(useItemStore())
const { getItemData } = useItemStore()
const { eventItemDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const emit = defineEmits(["eventItemUpdate"])

const selectedItem = ref<eventItemModel[]>([])

const selectItem = (val: materialDataModel | otherDataModel | potionDataModel | armorDataModel | weaponDataModel | keyDataModel) => {
    console.log(val)

    const exist = selectedItem.value.findIndex(s => s.id === val.id)
    if(exist >= 0){
        // Cancel selection
        selectedItem.value.splice(exist, 1)
    }else{
        // Add selection
        selectedItem.value.push({
            amount: 1,
            id: val.id,
            type: val.type
        })
    }
}

const setItemAmount = (e: any, id:string) => {
    console.log(e, id)

    const exist = selectedItem.value.findIndex(s => s.id === id)
    if(exist >= 0){
        // Update selected item
        selectedItem.value[exist].amount = Number(e.target.value)
    }
}

const updateEvent = () => {
    console.log(selectedItem.value)
    emit("eventItemUpdate", selectedItem.value)
    toggleDialog("event-item")
}

onBeforeMount(() => {
    getItemData()
})
</script>

<!-- <style scoped>

</style> -->
