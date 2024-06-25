import { defineStore } from "pinia";
import { ref } from "vue";
import type { classDataModel, classResponseModel, mobDataModel, mobResponseModel } from "~/types/character";
import type { baseAttributeModel } from "~/types/item";

export const useCharacterStore = defineStore('character', () => {
    const classes = ref<classDataModel[]>([])

    const mobs = ref<mobDataModel[]>([])

    const mainStore = useMainStore()

    const attributes = ref<baseAttributeModel>({
        hp: 0,
        mp: 0,
        ap: 0,
        str: 0,
        def: 0,
        int: 0,
        spd: 0,
        spi: 0,
        lck: 0,
        maxHp: 0,
        maxMp: 0,
        maxAp: 0,
        moveSpeed: 0,
        sight: 0,
    })

    const statusList = ref<string[]>([
        "Burn", "Poison", "Freeze", "Stone", "Sleep", "Bleed"
    ])

    const getClassData = async() => {
        try {
            const classRequest: classResponseModel = await $fetch(`${mainStore.base_url}api/class/data`)

            if(classRequest.status === 200){
                classes.value = classRequest.data
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getMobData = async() => {
        try {
            const mobRequest: mobResponseModel = await $fetch(`${mainStore.base_url}api/mob/data`)

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
        attributes,
        statusList,
        getMobData,
        getClassData
    }
})