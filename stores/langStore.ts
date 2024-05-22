import { defineStore } from "pinia";
import { ref } from "vue";
import type { levelList, translationDataModel } from '~/types/level';

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

    const getTranslationData = async(type: string) => {
        const tranlationRequest : levelList = await $fetch(`${mainStore.base_url}api/lang/${type}`)

        console.log(tranlationRequest)

        if(tranlationRequest.status === 200){
            translationData.value[`${type as keyof translationDataModel}`] = tranlationRequest.files
        }
    }

    return {
        translateTargets,
        translationData,
        getTranslationData
    }
})