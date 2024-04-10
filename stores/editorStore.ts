import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { levleDataModle, levelDataResponse, levelAssetModle, levelAssetResponseModel, tileInfoModel } from '~/types/index'

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

    // ALL assets
    const assets = ref<levelAssetModle>({
        env: [],
        class: [],
        mob: []
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
    
    /**
     * Get all the events asigned to the tile
     * @param x - The x axis of the tile
     * @param y - The y axis of the tile
     * @returns The array of events
     */
    const getEventsonTile = (x: number, y: number) => {
        const events = []
    
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
        const mainStore = useMainStore()
        const request : levelDataResponse = await $fetch(`${mainStore.base_url}api/${id}`)

        // Get all assets
        for(let [key, value] of Object.entries(assets.value)){
            const request_assets : levelAssetResponseModel = await $fetch(`${mainStore.base_url}api/asset?type=${key}`)
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
     * Save the latest changes of levelData
     */
    const saveLevelData = async() => {
        try {
            const mainStore = useMainStore()
            await $fetch(`${mainStore.base_url}api/${levelData.value}`, { method: 'PATCH', body: levelData.value })
        } catch (error) {
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
        initEditor,
        storeSteps,
        previousStep,
        clearSteps,
        saveLevelData,
        getEventsonTile
    }
})