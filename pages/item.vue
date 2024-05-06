<template>
    <section id="wrapper">
        <div class="d-flex">
            <div class="mr-auto">
                <h3>ITEM</h3>
                <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('item-create')">
                    CREATE
                </v-btn>
            </div>

            <div>
                <p>FILTER</p>
                <div class="d-flex flex-column">
                    <v-btn-toggle
                    v-model="itemFilter"
                    variant="outlined"
                    divided
                    >
                        <v-btn v-for="t in type" 
                            :key="t.type"
                            @click="filterOutItems" >
                            {{ t.category }}
                        </v-btn>
                    </v-btn-toggle>
                </div>
            </div>
        </div>

        <v-table id="dataTable">
            <thead>
            <tr>
                <th class="text-left">
                    Id
                </th>
                <th class="text-left">
                    Name
                </th>
                <th>
                    Desc
                </th>
                <th>

                </th>
            </tr>
            </thead>
            <tbody>
                <template
                    v-for="(value, name, index) in itemToDispaly"
                    :key="name"
                >
                    <tr
                        v-for="(val, pointer) in value"
                                :key="pointer"
                    >
                        <td>{{ val.id }}</td>
                        <td>{{ val.name }}</td>
                        <td>{{ val?.effect?.desc }}</td>    
                        <td class="d-flex justify-end" >
                            <v-btn class="mx-2 mt-2" prepend-icon="mdi-file-edit" color="secondary">
                                EDIT
                            </v-btn>   

                            <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="danger" >
                                DELETE
                            </v-btn>
                        </td>   
                    </tr>
                </template>
            </tbody>
        </v-table>        
    </section>

    <item-create v-if="itemCreateDialog" />
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onBeforeMount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia' 
import type { itemState } from '~/types/item';

import itemCreate from '~/components/item/itemCreate.vue';

const { itemCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { item, type } = storeToRefs(useItemStore())
const { getItemType, getItemData } = useItemStore()

const itemToDispaly = ref()

const itemFilter = ref<number>()

watch(() => item, (newItem) => {
    if(newItem){
        itemToDispaly.value = JSON.parse(JSON.stringify(item.value))
    }
}, { deep: true })

const filterOutItems = () => {
    if(itemFilter.value !== undefined){
        const index = itemFilter.value

        const itemHolder: any = {}
    
        itemHolder[`${type.value[index].category}`] = item.value[type.value[index].category as keyof itemState]

        itemToDispaly.value = itemHolder
        console.log(itemToDispaly.value) 
    }else{
        itemToDispaly.value = JSON.parse(JSON.stringify(item.value))
    }
}

onBeforeMount(async() => {
    await getItemType()
    await getItemData()
})
</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>