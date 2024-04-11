<template>
    <section id="wrapper">
        <h3>ITEM</h3>
        <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('item-create')">
            CREATE
        </v-btn>
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

import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia' 

const { base_url } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()
const { item } = storeToRefs(useItemStore())
const { getItemData } = useItemStore()

console.log(base_url)

onMounted(async() => {
    await getItemData()
})


</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>