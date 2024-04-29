import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { levleDataModle, levelDataResponse, levelAssetModle, levelAssetResponseModel, tileInfoModel, responseModel, levelEventModle } from '~/types/level'
import $api from '~/composables/useCustomFetch'

export const useEditorStore = defineStore('editor', () => {
    // Default template for levelData
    const levelData = ref<levleDataModle>({
        id: "",
        name: "",
        map: [],
        event: [],
        phase: [],
        enemy: [],
        player: [],
        objective: {},
        audio: "",
        assets: [],
        difficulty: 0
    })

    // Image assets
    const assets = ref<levelAssetModle>({
        bg: [],
        env: [],
        class: [],
        mob: [],
        portrait: []
    })

    // Animation assets
    // const animationAssets = ref({
    //     class: [] as string[],
    //     mob: [] as string[]
    // })

    // Audio assets
    const audioAssets = ref({
        general: [] as string[],
        battle: [] as string[]
    })

    // Steps to reverse
    const steps = ref<Array<number[][]>>([])

    // Current mode
    // nav - View / Drag a tile on canvas?
    // draw - Draw a tile on the canvas
    // erase - Remove a tile on the canvas
    // layer - switch canvas layer
    // config - Manage other parts of levelData
    const mode = ref<string>('nav')

    // Tiles on the map
    const tiles = ref<HTMLImageElement[]>([])
    // Selected tile
    const selectedTile = ref<HTMLImageElement|null>(null)
    // Details about the tile
    const tileInfo = ref<tileInfoModel>({
        x: 0,
        y: 0,
        events: []
    })

    // Canvas layers
    const layers = ref<any[]>([
        { name: 'map', active: true },
        { name: 'grid', active: true },
        { name: 'player', active: true },
        { name: 'event', active: true },
    ])

    // Config options
    const configOptions = ref<string[]>([
        "Edit level name", 
        "Edit conversation phase",
        "Edit battle phase BGM",
        "Edit level objective",
        "Editor theme", 
        "Language", 
    ])

    //
    const editEventIndex = ref<number>(0)

    const mainStore = useMainStore()
    
    /**
     * Get all the events asigned to the tile
     * @param x - The x axis of the tile
     * @param y - The y axis of the tile
     * @returns The array of events
     */
    const getEventsonTile = (x: number, y: number) => {
        const events: levelEventModle[] = []
    
        for(let i=0, levelEvent = levelData.value.event; i < levelEvent.length; i++){
            const eventPosition = levelEvent[i].position
            if(eventPosition.x === x && eventPosition.y === y){
                    events.push(levelEvent[i])
            }
        }
    
        return events
    }

    /**
     * Initialize the editor
     * @param id - The identifier of the levelData to find
     */
    const initEditor = async(id: string) => {
        // const { data } = await useAsyncData('getLevelData', () => $fetch(`${mainStore.base_url}api/level/${id}`))  

        const { data }= await $api(`${mainStore.base_url}api/level/${id}`)

        const request : levelDataResponse = data.value as levelDataResponse

        // Get image assets
        for(let [key, value] of Object.entries(assets.value)){
            // const { data } = await useAsyncData(`getImagetype${key}`, () => $fetch(`${mainStore.base_url}api/asset/image?type=${key}`))

            const request_assets : levelAssetResponseModel = await $fetch(`${mainStore.base_url}api/asset/image?type=${key}`)
            console.log("request:>>> ", request_assets)
            if(request_assets.status === 200){
                assets.value[key as keyof levelAssetModle] = request_assets.assets
            }  
        }

        console.log("request:>>> ", request)
        
        if(request.status === 200){
            levelData.value = request.data
        }  
    }

    // Get audio assets
    const getAudioAssets = async() => {
        // const { data } = await useAsyncData('getAudioAsset', () => $fetch(`${mainStore.base_url}api/asset/audio?type=general`))

        if(process.client){
            const audioRequest : levelAssetResponseModel = await $fetch(`${mainStore.base_url}api/asset/audio?type=general`)

            console.log(audioRequest)
    
            if(audioRequest.status === 200){
              audioAssets.value.general = audioRequest.assets  
            }
        }
    }

    const getBattleAudioAsset = async() => {
        // const { data } = await useAsyncData('getBattleAudioAsset', () => $fetch(`${mainStore.base_url}api/asset/audio?type=battle`))

        if(process.client){
            const audioRequest : levelAssetResponseModel = await $fetch(`${mainStore.base_url}api/asset/audio?type=battle`)

            console.log(audioRequest)

            if(audioRequest.status === 200){
            audioAssets.value.battle = audioRequest.assets  
            }            
        }
    }

    // Get animation assets
    // const getAnimationAssets = (type: string) => {

    // }

    /**
     * Push a new step to keep tracking
     * @param step - A two dimentional array of number represend the tileMap
     */
    const storeSteps = (step: number[][]) => {
        steps.value.push(step)
    }

    /**
     * Set the state of tileMap one step back
     */
    const previousStep = () => {
        if(steps.value.length){
            steps.value.splice(steps.value.length - 1, 1)
            levelData.value.map = steps.value[steps.value.length - 1]            
        }else{
            console.log('no more steps')
        }
    }

    /**
     * Save image assets to folder
     * @param files - An array of image files
     * @param type - The type, the folder to store the asset
     */
    const saveAsset = async(files: File[], type: string) => {
        const formData = new FormData()

        files.forEach((file, index) => formData.append(String(index), file))

        formData.append("type", type)

        // const { data } = await useAsyncData('saveAsset', () => $fetch(`${mainStore.base_url}api/asset/image`, { method: "POST", body: formData }))

        const { data } = await $api(`${mainStore.base_url}api/asset/image`, { method: "POST", body: formData })

        const uploadResult : responseModel = data.value as responseModel

        console.log(uploadResult)

        if(uploadResult.status === 200){
            // Update the asset listed in the store
            // const { data } = await useAsyncData(`getImageType${type}`, () => $fetch(`${mainStore.base_url}api/asset/image?type=${type}`))

            const { data } = await $api(`${mainStore.base_url}api/asset/image?type=${type}`)

            const request_assets : levelAssetResponseModel = data.value as levelAssetResponseModel
            console.log("request:>>> ", request_assets)
            console.log("request:>>> ", request_assets)
            if(request_assets.status === 200){
                assets.value[type as keyof levelAssetModle] = request_assets.assets
            } 
        }
    }

    /**
     * Save the latest changes of levelData
     */
    const saveLevelData = async() => {
        try {
            await $fetch(`${mainStore.base_url}api/level/${levelData.value.id}`, { method: 'PATCH', body: levelData.value })
        }catch(error){
            console.error("saveLevelData error :>>>", error)
        }
    }

    /**
     * Clear out the tracking steps
     */
    const clearSteps = () => {
        steps.value.splice(0)
    }

    return {
        levelData,
        assets,
        steps,
        mode,
        tiles,
        selectedTile,
        tileInfo,
        editEventIndex,
        audioAssets,
        layers,
        initEditor,
        storeSteps,
        previousStep,
        clearSteps,
        saveLevelData,
        getEventsonTile,
        getAudioAssets,
        getBattleAudioAsset,
        saveAsset
    }
})