import { defineStore } from "pinia";
import { ref } from "vue";
import type { levelList, translationDataModel, levelDataResponse } from '~/types/level';

// Define mainStore
const mainStore = useMainStore()

export const useLangStore = defineStore('lang', () => {
    const translateTargets = ref<string[]>([
        "class",
        "item",
        "level",
        "skill",
        // "ui"
    ])

    const translationData = ref<translationDataModel>({
        class: [""],
        item: [""],
        level: [""],
        skill: [""]
    })

    const translationDetail = ref<any>({})

    const getTranslationList = async(type: string) => {
        const tranlationRequest : levelList = await $fetch(`${mainStore.base_url}api/lang/${type}`)

        console.log(tranlationRequest)

        if(tranlationRequest.status === 200){
            translationData.value[`${type as keyof translationDataModel}`] = tranlationRequest.files
        }
    }

    const getTranslationData = async(target: string, type: string) => {
        const tranlationRequest : levelDataResponse = await $fetch(`${mainStore.base_url}api/lang/data?type=${type}&name=${target}`)

        console.log(tranlationRequest)

        if(tranlationRequest.status === 200){
            translationDetail.value = tranlationRequest.data
        }
    }

    return {
        translateTargets,
        translationData,
        translationDetail,
        getTranslationList,
        getTranslationData
    }
})