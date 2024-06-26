import { defineStore } from "pinia";
import { ref } from "vue";
import type { levelList, translationDataModel, levelDataResponse, levelEventModel } from '~/types/level';
import type responseModel from '~/types/serverResponse'
import type { skillResponseModel } from "~/types/skill";

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
            translationDetail.value = {
                en: {},
                zh: {}
            }
            let rawDataRequest : any = { }

            const targetType = target.split(".")[0]
            switch(type){
                case 'class':
                    rawDataRequest = target.includes('class')? await $fetch(`${mainStore.base_url}api/class?target=${targetType}`) : await $fetch(`${mainStore.base_url}api/mob?target=${targetType}`)

                    if(Array.isArray(rawDataRequest.data))
                        for(let i=0; i < rawDataRequest.data.length; i++){
                            translationDetail.value.en[`${rawDataRequest.data[i].id}`] = rawDataRequest.data[i].name
                            
                            translationDetail.value.zh[`${rawDataRequest.data[i].id}`] = ""
                        }
                        console.log(translationDetail.value)
                break;
                case 'item':
                    rawDataRequest = await $fetch(`${mainStore.base_url}api/item/${targetType}/`)

                    if(Array.isArray(rawDataRequest.data))
                        for(let i=0; i < rawDataRequest.data.length; i++){
                            translationDetail.value.en[`${rawDataRequest.data[i].id}`] = {
                                name: rawDataRequest.data[i].name,
                                desc: rawDataRequest.data[i].effect.desc
                            }   
                            
                            translationDetail.value.zh[`${rawDataRequest.data[i].id}`] = {
                                name: "",
                                desc: ""
                            }
                        }
                        console.log(translationDetail.value)
                break;
                case 'level':
                    rawDataRequest = await $fetch(`${mainStore.base_url}api/level/${targetType}`)

                    if(!Array.isArray(rawDataRequest.data)){
                        translationDetail.value.en.title = rawDataRequest.data.name
                        translationDetail.value.zh.title = ""

                        const eventWithOutConversation = rawDataRequest.data.event.filter((e:levelEventModel) => e.scene.length)

                        if(eventWithOutConversation.length){
                            let dialogueCount = 1, optionCount = 1

                            for(let i=0; i < eventWithOutConversation.length; i++){
                                for(let j=0, scene = eventWithOutConversation[i].scene; j < scene.length; j++){
                                    for(let k=0, dialogue = scene[j].dialogue; k < dialogue.length; k++){
                                        if(dialogue[k].option && dialogue[k].option.length){
                                            for(let l=0, option = dialogue[k].option; l < option.length; l++){
                                                translationDetail.value.en[`option_${optionCount}`].value = option[l].value
                                                translationDetail.value.en[`option_${optionCount}`].content = option[l].contnet
                                                
                                                translationDetail.value.zh[`option_${optionCount}`].value = ""
                                                translationDetail.value.zh[`option_${optionCount}`].content = ""

                                                optionCount += 1
                                            }
                                        }else{
                                            translationDetail.value.en[`dialogue_${dialogueCount}`] = dialogue[k].content
                                            translationDetail.value.zh[`dialogue_${dialogueCount}`] = ""

                                            dialogueCount += 1
                                        }
                                    }
                                }
                            }
                        }                        
                    }

                break;
                case 'skill':
                    rawDataRequest = await $fetch(`${mainStore.base_url}api/skill/${targetType}`)

                    const requestSkill = rawDataRequest as skillResponseModel
        
                    if(requestSkill.status === 200){

                        for(let i=0; i < requestSkill.data.length; i++){
                            translationDetail.value.en[`${requestSkill.data[i].id}`] = {
                                name: requestSkill.data[i].name,
                                desc: requestSkill.data[i].effect.desc
                            }   
                            
                            translationDetail.value.zh[`${requestSkill.data[i].id}`] = {
                                name: "",
                                desc: ""
                            }
                        }
                        console.log(translationDetail.value)
                    }
                break;
            }
        }
    }

    const saveTranslationData = async(type: string, name: string) => {
        const saveRequest : responseModel = await $fetch(`${mainStore.base_url}api/lang/save`, { method: "POST", body: { type, name: name.split(".")[0], ...translationDetail.value } })

        console.log(saveRequest)
        
        if(saveRequest.status === 200){
            console.log("success")
        }else{
            console.log("failed")
        }
    }

    return {
        translateTargets,
        translationData,
        translationDetail,
        getTranslationList,
        getTranslationData,
        saveTranslationData
    }
})