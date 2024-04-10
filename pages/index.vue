<template>
    <section id="wrapper">
        <h3>LEVELS</h3>
        <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('level-create')">
            CREATE
        </v-btn>
        <v-table id="dataTable">
            <thead>
            <tr>
                <th class="text-left">
                Id
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
                    <NuxtLink :to="`/level/${map}`">
                        <v-btn class="mx-2 mt-2" prepend-icon="mdi-file-edit" color="secondary">
                            EDIT
                        </v-btn>                            
                    </NuxtLink>

                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="danger" @click="deleteLevel(map, index)">
                        DELETE
                    </v-btn>
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
import type { levelList } from '~/types/level';
import { storeToRefs } from 'pinia' 

const { base_url } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()

console.log(base_url)

const levels = ref<string[]>([])

// 取已經建立的關卡檔名
const getLevels = async() => {
    const request : levelList = await $fetch(`${base_url.value}api/data`)
    
    console.log(request)

    if(request.status === 200){
        request.files.forEach((f, index) => {
            levels.value[index] = f.split('.')[0]
        })
    }
}

// 刪除關卡檔案
const deleteLevel = async(id: string, index: number) => {
    const request : any = await $fetch(`${base_url.value}api/data`, { method: "DELETE", body: { id }})

    console.log(request)

    if(request.status === 200){
        levels.value.splice(index, 1)
    }
}

onMounted(async() => {
    await getLevels()
})


</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>