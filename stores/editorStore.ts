import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { levleDataModle, levelDataResponse, levelAssetModle } from '~/types/index'

export const useEditorStore = defineStore('editor', () => {
    const levelData = ref<levleDataModle>({
        id: "",
        name: "",
        map: [],
        event: [],
        phase: [],
        enemy: [],
        objective: {},
        audio: "",
        assets: [],
        difficulty: 0
    })
    const assets = ref<levelAssetModle>({
        env: [],
        class: [],
        mob: []
    })
    const steps = ref<Array<number[][]>>([]) // Steps to reverse

    const initEditor = async(id: string) => {
        const mainStore = useMainStore()
        const request : levelDataResponse = await $fetch(`${mainStore.base_url}api/${id}`)
        const request_assets : any = await $fetch(`${mainStore.base_url}api/asset?type=env`)

        console.log("request:>>> ", request)
        console.log("request:>>> ", request_assets)

        if(request.status === 200){
            levelData.value = request.data
        }  
        
        if(request_assets.status === 200){
            assets.value.env = request_assets.assets
        }  
    }

    const storeSteps = (step: number[][]) => {
        steps.value.push(step)
    }

    const previousStep = () => {
        if(steps.value.length){
            steps.value.splice(steps.value.length - 1, 1)
            levelData.value.map = steps.value[steps.value.length - 1]            
        }else{
            console.log('no more steps')
        }
    }

    const saveLevelData = async() => {
        try {
            const mainStore = useMainStore()
            await $fetch(`${mainStore.base_url}api/${levelData.value}`, { method: 'PATCH', body: levelData.value })
        } catch (error) {
            console.error("saveLevelData error :>>>", error)
        }
    }

    const clearSteps = () => {
        steps.value.splice(0)
    }

    return {
        levelData,
        assets,
        steps,
        initEditor,
        storeSteps,
        previousStep,
        clearSteps,
        saveLevelData
    }
})