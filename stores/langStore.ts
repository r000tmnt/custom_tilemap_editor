import { defineStore } from "pinia";
import { ref } from "vue";
import type { levelList, translationDataModel, levelDataResponse, levelEventModel } from '~/types/level';

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
        }else{
            // Need to create a new json file
            let rawDataRequest : any = {}
            switch(type){
                case 'class':
                    rawDataRequest = target.includes('class')? await $fetch(`${mainStore.base_url}api/class?target=${target}`) : await $fetch(`${mainStore.base_url}api/mob?target=${target}`)
                break;
                case 'item':
                    rawDataRequest = await $fetch(`${mainStore.base_url}api/item/${type}/`)

                    translationDetail.value.en = { name: rawDataRequest.data.name }
                    translationDetail.value.zh = { name: "" } 
                break;
                case 'level':
                    rawDataRequest = await $fetch(`${mainStore.base_url}api/level/${target}`)

                    translationDetail.value.en.title = rawDataRequest.data.tile

                    const eventWithOutPosition = rawDataRequest.data.event.filter((e:levelEventModel) => !Object.entries(e.position).length)

                    if(eventWithOutPosition.length){
                        let dialogueCount = 1, optionCount = 1
                        for(let i=0; i < eventWithOutPosition.length; i++){
                            for(let j=0, scene = eventWithOutPosition[i].scene; j < scene.length; j++){
                                for(let k=0, dialogue = scene[j].dialogue; k < dialogue.length; k++){
                                    if(dialogue[k].option && dialogue[k].option.length){
                                        for(let l=0, option = dialogue[k].option; l < option.length; l++){
                                            translationDetail.value.en[`option_${optionCount}`].value = option[l].value
                                            translationDetail.value.en[`option_${optionCount}`].content = option[l].contnet

                                            optionCount += 1
                                        }
                                    }else{
                                        translationDetail.value.en[`dialogue_${dialogueCount}`] = dialogue[k].content

                                        dialogueCount += 1
                                    }
                                }
                            }
                        }
                    }
                break;
                case 'skill':

                break;
            }
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