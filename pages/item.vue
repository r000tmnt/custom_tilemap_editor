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
                        <v-btn v-for="t in type" :key="t.type" >{{ t.category }}</v-btn>
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
                    v-for="(value, name, index) in item"
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

    <!-- <level-create-dialog @trigger-reload="getLevels" /> -->
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia' 

const { base_url } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()
const { item, type } = storeToRefs(useItemStore())
const { getItemType, getItemData } = useItemStore()

const itemFilter = ref<string>("")

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