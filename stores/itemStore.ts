import { defineStore } from "pinia";
import { ref } from "vue";
import type { materialResponseModel, otherResponseModel, potionResponseModel, typeResponseModel, itemState, armorResponseModel, weaponResponseModel, keyResponseModel, itemTypeModel, potionDataModel, otherDataModel, materialDataModel, weaponDataModel, armorDataModel, accessoryDataModel, keyDataModel } from "~/types/item";
import $api from "~/composables/useCustomFetch";
import type responseModel from "~/types/serverResponse";

// Define mainStore
const mainStore = useMainStore()

export const useItemStore = defineStore('item', () => {
    const item = ref<itemState>({
        armor: [],
        accessory: [],
        key: [],
        material: [],
        other: [],
        potion: [],
        weapon: [],
    })

    const type = ref<itemTypeModel[]>([])

    const conditionList = ref<string[]>([
        "lower", "equal", "greater"
    ])

    const itemRarity = ref<string[]>([
        "N", "R", "SR", "SSR", "USSR"
    ])

    const itemEffectType = ref<string[]>([
        "Solid", "Percentage", "offence", "defence"
    ])

    const itemEquipPosition = ref<string[]>([
        "head", "body", "hand", "leg", "feet", "accessory"
    ])

    const itemDropModify = ref<string[]>([])

    const getItemType = async() => {
        const { data } = await $api(`${mainStore.base_url}api/item/type`)

        const request : typeResponseModel = data.value as typeResponseModel

        request.data.forEach((value, index) => {
            type.value[index] = value
        });
    }

    const getItemData = async() => {
        // Get the data of item for various types
        for(let i=0; i < type.value.length; i++){

            const data = await $fetch(`${mainStore.base_url}api/item/${type.value[i].category}`)

            switch(type.value[i].type){
                case 0:{
                    const requestItem : potionResponseModel = data as potionResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.potion = requestItem.data
                    }
                }
                break;
                case 1:{
                    const requestItem : otherResponseModel = data as otherResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.other = requestItem.data
                    }
                } 
                break;
                case 2:{
                    const requestItem : materialResponseModel  = data as materialResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.material = requestItem.data
                    }
                }
                case 3:{
                    const requestItem : weaponResponseModel  = data as weaponResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.weapon = requestItem.data
                    }
                }
                break;
                case 4:{
                    const requestItem: armorResponseModel = data as armorResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.armor = requestItem.data
                    }
                }
                break;
                case 5:{
                    // accessory
                }
                break;
                case 6:{
                    const requestItem: keyResponseModel = data as keyResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.key = requestItem.data
                    }
                }
                break;
            }
        }
    }

    const updateItemData = async(itemToEdit: any, type: string, index:number) => {
        let tempItemData: any = []

        //Reconstruct the itemData
        if(itemToEdit?.effect?.based_attribute){
            const base_attribute: any = {}

            for(let i=0, attribute = itemToEdit.effect.base_attribute; i < attribute.length; i++){
                base_attribute[`${attribute[i]}`] = itemToEdit.effect.base_attribute_value[i]
            }

            itemToEdit.effect.base_attribute = base_attribute
            delete itemToEdit.effect.base_attribute_value
        }

        //Check if id exist
        if(!itemToEdit.id.length){
            const itemsofTheType : any = item.value[type as keyof itemState]
            let itemTarget = ""
            let targetAmount : any = []
            // TODO - Define item id by item type and the type of effect and the amount of the item of the same type
            switch(type){
                case 'potion':
                    if(itemToEdit.effect.type === 2){
                        switch(itemToEdit.effect.target){
                            case "hp": case "mp":
                                itemTarget = 'damage'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                            case "status":
                                itemTarget = 'status'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                        }
                    }else{
                        switch(itemToEdit.effect.target){
                            case "hp":
                                itemTarget = 'health'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                            case "mp":
                                itemTarget = 'mana'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                            case "status":
                                itemTarget = 'status'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                            case "all":
                                itemTarget = 'revive'
                                targetAmount = itemsofTheType.filter((p: potionDataModel) => p.id.includes(itemTarget))
                            break;
                        }
                    }
                break;
                case 'other':
                    if(itemToEdit.name.inculds("coin")){
                        itemTarget = "currency"
                        targetAmount = itemsofTheType.filter((p: otherDataModel) => p.id.includes(itemTarget))
                    }else{
                        itemTarget = itemToEdit.name.split(" ")[0]
                        targetAmount = itemsofTheType.filter((p: otherDataModel) => p.id.includes(itemTarget))
                    }
                break;
                case 'material':
                    itemTarget = itemToEdit.name.split(" ")[1]
                    switch(itemTarget){
                        case "meat":
                            targetAmount = itemsofTheType.filter((p: materialDataModel) => p.id.includes(itemTarget))
                        break;
                        // case "status":
                        //     itemTarget = 'status'
                        //     targetAmount = itemsofTheType.filter((p: materialDataModel) => p.id.includes(itemTarget))
                        // break;
                    }
                break;
                case 'weapon':
                    itemTarget = itemToEdit.name.split(" ")[1]
                    targetAmount = itemsofTheType.filter((p: weaponDataModel) => p.id.includes(itemTarget))
                break;
                case 'armor':
                    itemTarget = itemToEdit.name.split(" ")[1]
                    targetAmount = itemsofTheType.filter((p: armorDataModel) => p.id.includes(itemTarget))
                break;
                case 'accessory':
                    itemTarget = itemToEdit.name.split(" ")[1]
                    targetAmount = itemsofTheType.filter((p: accessoryDataModel) => p.id.includes(itemTarget))
                break;
                case 'key':
                    itemTarget = itemToEdit.name.split(" ")[2]
                    targetAmount = itemsofTheType.filter((p: keyDataModel) => p.id.includes(itemTarget))
                break;
            }            
            itemToEdit.id = `${type}_${itemTarget}_${targetAmount.length + 1}`

            tempItemData = [...item.value[type as keyof itemState], {...itemToEdit}]
        }else{
            tempItemData = [...item.value[type as keyof itemState]]
            tempItemData[index] = itemToEdit
        }

        const updateRequest: responseModel = await $fetch(`${mainStore.base_url}api/item/${type}`, { method: 'POST', body: { item: JSON.stringify(tempItemData), type } })

        console.log(updateRequest)

        if(updateRequest.status == 200){
            // If edit the existing item
            if(index >= 0){
                item.value[type as keyof itemState][index] = itemToEdit
            }else{
                // Push item to the array if update success
                item.value[type as keyof itemState].push(itemToEdit)
            }
        }
    }

    const deleteItemData = async(type: string, index:number) => {
        const itemforDelete = item.value[type as keyof itemState].splice(index, 1)

        const deleteRequest: responseModel = await $fetch(`${mainStore.base_url}api/item/${type}`, { method: 'POST', body: item.value[type as keyof itemState] })

        console.log(deleteRequest)

        // Put the item back to array of delete failed
        if(deleteRequest.status !== 200){
            item.value[type as keyof itemState].splice(index, 0, itemforDelete[0])
        }
    }

    return {
        item,
        type,
        conditionList,
        itemRarity,
        itemEffectType,
        itemEquipPosition,
        getItemType,
        getItemData,
        updateItemData,
        deleteItemData
    }
})