<template>
    <section id="wrapper">
        <div class="d-flex">
            <div class="mr-auto">
                <h3>SKILL</h3>
                <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('item-create')">
                    CREATE
                </v-btn>
            </div>

            <div>
                <p>FILTER</p>
                <div class="d-flex flex-column">
                    <v-btn-toggle
                    v-model="skillFilter"
                    variant="outlined"
                    divided
                    >
                        <v-btn v-for="t in skillTypes" 
                            :key="t.type" >
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
                <tr
                    v-for="(val, index) in skillsToDisplay"
                            :key="index"
                            :style="`display:${index >= pageLimit.start && index <= pageLimit.end? 'blcok' : 'none'}`"
                >
                    <td>{{ val.id }}</td>
                    <td>{{ val.name }}</td>
                    <td>{{ val?.effect?.desc }}</td>    
                    <td class="d-flex justify-end" >
                        <v-btn class="mx-2 mt-2" 
                            prepend-icon="mdi-file-edit" 
                            color="secondary">
                            EDIT
                        </v-btn>   

                        <v-btn class="mx-2 mt-2" prepend-icon="mdi-delete" color="danger" >
                            DELETE
                        </v-btn>
                    </td>   
                </tr>
            </tbody>
        </v-table>      
        
        <v-pagination :length="totalPage"
            v-model="currentPage"></v-pagination>
    </section>

    <!-- <level-create-dialog @trigger-reload="getLevels" /> -->
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onBeforeMount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia' 
import type { skillState, skillDataModel } from '~/types/skill'

const { base_url } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()
const { skills, skillTypes } = storeToRefs(useSkillStore())
const { getSkillTypes, getSkillData } = useSkillStore()

console.log(base_url)

const skillsToDisplay = ref<skillDataModel[]>([])

const skillFilter = ref<number>()

const skillToEdit = ref<any>()
const editIndex = ref<number>(0)

const currentPage = ref<number>(1)
const pageLimit = ref({
    start: 0,
    end: 9
})
const totalPage = ref<number>(1)

const setSkillToDisplay = (copy: skillState) => {
    skillsToDisplay.value.splice(0)

    let skillCount = 0

    for(let [key, value] of Object.entries(copy)){
        for(let i=0; i < value.length; i++){
            skillsToDisplay.value[skillCount] = value[i]
            skillCount += 1
        }
    }

    if(Math.floor(skillCount % 10) > 0){
        totalPage.value = Math.floor(skillCount / 10) + 1
    }else{
        totalPage.value = Math.floor(skillCount / 10)
    }
}

watch(() => skills.value, (newSkill) => {
    if(newSkill){
        setSkillToDisplay(JSON.parse(JSON.stringify(skills.value)))
    }
}, { deep: true })

watch(() => currentPage.value, (newPage, oldPage) => {
    console.log(newPage)
    if(newPage > oldPage){
        const distance = (10 * (newPage - oldPage))
        pageLimit.value.start +=  distance
        pageLimit.value.end += distance 
    }else{
        const distance = (10 * (oldPage - newPage))
        pageLimit.value.start -=  distance
        pageLimit.value.end -= distance 
    }
})

onBeforeMount(async() => {
    await getSkillTypes()
    await getSkillData()
})
</script>

<style scoped>
#dataTable{
    margin: 5% auto;
}
</style>