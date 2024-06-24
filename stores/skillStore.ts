import { defineStore } from "pinia";
import { ref } from "vue";
import $api from "~/composables/useCustomFetch";
import type { itemTypeModel, typeResponseModel } from "~/types/item";
import type responseModel from "~/types/serverResponse";
import type { skillState, skillResponseModel } from "~/types/skill";

// Define mainStore
const mainStore = useMainStore()

export const useSkillStore = defineStore('skill', () => {
    const skills = ref<skillState>({
        none: [],
        sword: [],
        knife: [],
        wand: [],
        staff: [],
        axe: [],
        bow: [],
        gun: [],
        status: []
    })

    const skillTypes = ref<itemTypeModel[]>([])

    const skillEffectType = ref<string[]>([
        "offence", "defence"
    ])

    const skillEffectMultiply = ref<string[]>([
        "solid", "percentage"
    ])

    const getSkillTypes = async() => {
        const { data } = await $api(`${mainStore.base_url}api/skill/type`)

        const request : typeResponseModel = data.value as typeResponseModel

        request.data.forEach((value, index) => {
            skillTypes.value[index] = value
        });
    }

    const getSkillData = async() => {
        // Get the data of skill for various types
        for(let i=0; i < skillTypes.value.length; i++){

            const data = await $fetch(`${mainStore.base_url}api/skill/${skillTypes.value[i].category}`)

            const requestSkill = data as skillResponseModel

            if(requestSkill.status === 200){
                skills.value[skillTypes.value[i].category as keyof skillState] = requestSkill.data
            }
        }
    }

    const updateSkillData = async(SkillToEdit: any, type: string, index:number) => {
        let tempSkillData: any = []

        //Check if id exist
        if(!SkillToEdit.id.length){
            const skillsofTheType : any = skills.value[type as keyof skillState]

            SkillToEdit.id = `${type}_${SkillToEdit.name.split(" ")[0].toLowerCase()}_${skillsofTheType.length + 1}`

            tempSkillData = [...skills.value[type as keyof skillState], {...SkillToEdit}]
        }else{
            tempSkillData = [...skills.value[type as keyof skillState]]
            tempSkillData[index] = SkillToEdit
        }

        const updateRequest: responseModel = await $fetch(`${mainStore.base_url}api/skill/${type}`, { method: 'POST', body: { skill: JSON.stringify(tempSkillData), type } })

        console.log(updateRequest)

        if(updateRequest.status == 200){
            // If edit the existing item
            if(index >= 0){
                skills.value[type as keyof skillState][index] = SkillToEdit
            }else{
                // Push item to the array if update success
                skills.value[type as keyof skillState].push(SkillToEdit)
            }
        }
    }

    return {
        skills,
        skillTypes,
        skillEffectType,
        skillEffectMultiply,
        getSkillTypes,
        getSkillData,
        updateSkillData
    }
})