import { defineStore } from "pinia";
import { ref } from "vue";
import type { materialResponseModel, otherResponseModel, potionResponseModel, typeResponseModel, itemState, armorResponseModel, weaponResponseModel, keyResponseModel, itemTypeModel } from "~/types/item";
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

    const updateItemData = async(item: any, type: string, index:number) => {
        const tempItemData = [...item.value[type as keyof itemState], {...item}]

        const updateRequest: responseModel = await $fetch(`${mainStore.base_url}api/item/${type}`, { method: 'POST', body: tempItemData })

        console.log(updateRequest)

        // Push item to the array if update success
        if(updateRequest.status == 200){
            item.value[type as keyof itemState].push(item)
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
        getItemType,
        getItemData,
        updateItemData,
        deleteItemData
    }
})