<template>
    <section id="wrapper">
        <h3>LEVELS</h3>
        <v-btn prepend-icon="mdi-plus-box">
            CREATE
        </v-btn>
        <v-table id="dataTable">
            <thead>
            <tr>
                <th class="text-left">
                Name
                </th>
                <th class="text-left">
                
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
                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-file-edit" color="#009688">
                    EDIT
                    </v-btn>

                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="#F44336">
                    DELETE
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>        
    </section>

</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onMounted, ref } from 'vue';
import { type levelDataResponse } from '../modules/levelModules'

const runtimeConfig = useRuntimeConfig()

// console.log(runtimeConfig)

const levels = ref<string[]>([])

onMounted(async() => {
    const request : levelDataResponse = await $fetch(`${runtimeConfig.public.URL}api/data?folder=database/level`)
    
    console.log(request)

    if(request.status === 200){
        request.files.forEach(f => {
            levels.value.push(f.split('.')[0])
        })
    }
})


</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>