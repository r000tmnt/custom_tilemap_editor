import { defineStore } from "pinia";
import { ref } from "vue";
import type { levelList, translationDataModel, translationResponse, levelEventModel, translationDetailModel } from '~/types/level';
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

    const translationDetail = ref<translationDetailModel>({
        en: {
            title: ""
        },
        zh: {
            title: ""
        }
    })

    console.log(translationData.value)
    console.log(translationDetail.value)

    const getTranslationList = async(type: string) => {
        const translationRequest : levelList = await $fetch(`${mainStore.base_url}api/lang/${type}`)

        console.log(translationRequest)

        if(translationRequest.status === 200){
            translationData.value[`${type as keyof translationDataModel}`] = translationRequest.files
        }
    }

    const getTranslationData = async(target: string, type: string) => {

        if(type === "level"){
            // Need to read the raw data first
            const rawDataRequest: any = await $fetch(`${mainStore.base_url}api/level/${target.split(".")[0]}`)

            const translationRequest : translationResponse = await $fetch(`${mainStore.base_url}api/lang/data?type=${type}&name=${target}`)

            console.log(rawDataRequest)
            console.log(translationRequest)
            console.log(translationDetail.value)

            if(!Array.isArray(rawDataRequest.data)){
                if(translationRequest.data.en.title && translationRequest.data.zh.title){
                    translationDetail.value.en.title = translationRequest.data.en.title
                    translationDetail.value.zh.title = translationRequest.data.zh.title
                }else{
                    translationDetail.value.en.title = rawDataRequest.data.name
                    translationDetail.value.zh.title = ""
                }

                const eventWithConversation = rawDataRequest.data.event.filter((e:levelEventModel) => e.scene.length)

                if(eventWithConversation.length){
                    let dialogueCount = 1, optionCount = 1

                    for(let i=0; i < eventWithConversation.length; i++){
                        for(let j=0, scene = eventWithConversation[i].scene; j < scene.length; j++){
                            for(let k=0, dialogue = scene[j].dialogue; k < dialogue.length; k++){
                                if(dialogue[k].option && dialogue[k].option.length){
                                    for(let l=0, option = dialogue[k].option; l < option.length; l++){
                                        if(translationRequest.data.en[`option_${optionCount}`] !== undefined && translationRequest.data.zh[`option_${optionCount}`] !== undefined){
                                            translationDetail.value.en[`option_${optionCount}`] = translationRequest.data.en[`option_${optionCount}`]
                                            
                                            translationDetail.value.zh[`option_${optionCount}`] = translationRequest.data.zh[`option_${optionCount}`]
                                        }else{
                                            translationDetail.value.en[`option_${optionCount}`] = { 
                                                value: option[l].value,
                                                response: option[l].response.map((o: any) => o.content)
                                             }
                                            
                                            translationDetail.value.zh[`option_${optionCount}`] = {
                                                value: "",
                                                response: option[l].response.map((o: any) => "")
                                            }

                                            console.log(translationDetail.value.en[`option_${optionCount}`])
                                            console.log(translationDetail.value.zh[`option_${optionCount}`])
                                        }

                                        optionCount += 1
                                    }
                                }else{
                                    if(dialogue[k].content !== "demo"){
                                        if(translationRequest.data.en[`dialogue_${dialogueCount}`] !== undefined && translationRequest.data.zh[`dialogue_${dialogueCount}`] !== undefined){
                                            translationDetail.value.en[`dialogue_${dialogueCount}`] = translationRequest.data.en[`dialogue_${dialogueCount}`]
                                            translationDetail.value.zh[`dialogue_${dialogueCount}`] = translationRequest.data.zh[`dialogue_${dialogueCount}`]
                                        }else{
                                            translationDetail.value.en[`dialogue_${dialogueCount}`] = dialogue[k].content
                                            translationDetail.value.zh[`dialogue_${dialogueCount}`] = ""
                                        }

                                        dialogueCount += 1                                        
                                    }
                                }
                            }
                        }
                    }
                }                        
            }

            if(translationRequest.status === 200){
                translationDetail.value.en = { ...translationDetail.value.en, ...translationRequest.data.en }
                translationDetail.value.zh = { ...translationDetail.value.zh, ...translationRequest.data.zh }
            }
        }else{
            const translationRequest : translationResponse = await $fetch(`${mainStore.base_url}api/lang/data?type=${type}&name=${target}`)

            console.log(translationRequest)
    
            if(translationRequest.status === 200){
                translationDetail.value = translationRequest.data
            }else{
                // Need to create a new json file
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