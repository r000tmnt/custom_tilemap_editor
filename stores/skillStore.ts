import { defineStore } from "pinia";
import { ref } from "vue";
import $api from "~/composables/useCustomFetch";
import type { itemTypeModel, typeResponseModel } from "~/types/item";
import type { skillState, skillResponseModel } from "~/types/skill";

// Define mainStore
const mainStore = useMainStore()

export const useSkillStore = defineStore('skill', () => {
    const skills = ref<skillState>({
        sword: [],
        kneif: [],
        wand: [],
        staff: [],
        axe: [],
        bow: [],
        gun: []
    })

    const skillTypes = ref<itemTypeModel[]>([])

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

    return {
        skills,
        skillTypes,
        getSkillTypes,
        getSkillData
    }
})