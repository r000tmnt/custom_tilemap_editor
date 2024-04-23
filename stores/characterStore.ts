import { defineStore } from "pinia";
import { ref } from "vue";
import type { classDataModel, mobDataModel, mobResponseModel } from "~/types/character";

export const useCharacterStore = defineStore('character', () => {
    const classes = ref<classDataModel[]>([])

    const mobs = ref<mobDataModel[]>([])

    const mainStore = useMainStore()

    const getMobData = async() => {
        try {
            const mobRequest: mobResponseModel = await $fetch(`${mainStore.base_url}api/mob`)

            if(mobRequest.status === 200){
                mobs.value = mobRequest.data
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {
        classes,
        mobs,
        getMobData
    }
})