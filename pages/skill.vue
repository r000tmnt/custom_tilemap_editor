<template>
    <section id="wrapper">
        <div class="d-flex">
            <div class="mr-auto">
                <h3>SKILL</h3>
                <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('skill-create')">
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
                            color="secondary"
                            @click="setEditSkill(val.id, val.type)">
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

    <skill-create v-if="skillCreateDialog" />
    <skill-edit v-if="skillEditDialog"
        :skill="skillToEdit"
        :index="editIndex" />
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'base'
})

import { onBeforeMount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia' 
import type { skillState, skillDataModel } from '~/types/skill'

import skillCreate from '~/components/skill/skillCreate.vue';
import skillEdit from '~/components/skill/skillEdit.vue';

const { base_url } = storeToRefs(useMainStore())
const { skillCreateDialog, skillEditDialog } = storeToRefs(useDialogStore())
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

const filterOutItems = () => {
    if(skillFilter.value !== undefined){
        const index = skillFilter.value

        const itemHolder: any = {}
    
        itemHolder[`${skillTypes.value[index].category}`] = skills.value[skillTypes.value[index].category as keyof skillState]

        setSkillToDisplay(itemHolder)
    }else{
        setSkillToDisplay(JSON.parse(JSON.stringify(skills.value)))
    }
}

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

const setEditSkill = (id: string, type: number) => {
    console.log(id)
    console.log(type)
    
    switch(type){
        case 0:
            editIndex.value = skills.value.none.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.none[editIndex.value]
        break;
        case 1:
            editIndex.value = skills.value.sword.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.sword[editIndex.value]
        break;
        case 2:
            editIndex.value = skills.value.kneif.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.kneif[editIndex.value]
        break;
        case 3:
            editIndex.value = skills.value.wand.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.wand[editIndex.value]
        break;
        case 4:
            editIndex.value = skills.value.staff.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.staff[editIndex.value]
        break;
        case 5:
            editIndex.value = skills.value.axe.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.axe[editIndex.value]
        break;
        case 6:
            editIndex.value = skills.value.bow.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.bow[editIndex.value]
        break;
        case 7:
            editIndex.value = skills.value.gun.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.gun[editIndex.value]
        break;
        case 8:
            editIndex.value = skills.value.status.findIndex(p => p.id === id)
            skillToEdit.value = skills.value.status[editIndex.value]
        break;
    }
    console.log(skillToEdit.value)
    console.log(editIndex.value)
    toggleDialog("skill-edit")
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