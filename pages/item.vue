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
            <tr
                v-for="(map, index) in levels"
                :key="map"
            >
                <td>{{ map }}</td>
                <td class="d-flex justify-end">
                    <!-- <NuxtLink :to="`/level/${map}`">
                        <v-btn class="mx-2 mt-2" prepend-icon="mdi-file-edit" color="secondary">
                            EDIT
                        </v-btn>                            
                    </NuxtLink>

                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="danger" @click="deleteLevel(map, index)">
                        DELETE
                    </v-btn> -->
                </td>
            </tr>
            </tbody>
        </v-table>        
    </section>

    <level-create-dialog @trigger-reload="getLevels" />
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia' 

const { base_url } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()

console.log(base_url)

const levels = ref<string[]>([])

onMounted(async() => {
    await getLevels()
})


</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>