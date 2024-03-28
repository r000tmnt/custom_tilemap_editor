<template>
    <section id="wrapper">
        <h3>LEVELS</h3>
        <v-btn prepend-icon="mdi-plus-box" color="primary" @click="createDialogState = true">
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
                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-file-edit" color="secondary">
                    EDIT
                    </v-btn>

                    <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="danger">
                    DELETE
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>        
    </section>

    <v-dialog
      v-model="createDialogState"
      width="auto"
    >
      <v-card
        class="pa-2"
        width="500"
        title="Create new level"
      >
        <v-form @submit.prevent>
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="formState.codeName"
                        :rules="rules"
                        label="Level id"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.name"
                        :rules="rules"
                        label="Level name"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.width"
                        :rules="rules"
                        type="number"
                        label="Width of the map"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.height"
                        :rules="rules"
                        type="number"
                        label="Height of the map"
                    ></v-text-field>                    
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-btn type="button" @click="createDialogState = false" block>Cancel</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn type="submit" color="primary" block>Submit</v-btn> 
                    </v-col>                 
                </v-row>

            </v-container>
        </v-form>
        <!-- <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="createDialogState = false"
          ></v-btn>
        </template> -->
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onMounted, ref, reactive } from 'vue';
import { type levelDataResponse } from '../modules/levelModules'

const runtimeConfig = useRuntimeConfig()

// console.log(runtimeConfig)

const levels = ref<string[]>([])
const createDialogState = ref<boolean>(false)
const formState = reactive({
    codeName: "",
    name: "",
    width: 9,
    height: 16
})
const rules = [
    (value: String | Number) => {
        if (value) return true

        return 'You must enter a first name.'
    },
]

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