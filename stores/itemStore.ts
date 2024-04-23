import { defineStore } from "pinia";
import { ref } from "vue";
import type { materialResponseModel, otherResponseModel, potionResponseModel, typeResponseModel, itemState, armorResponseModel, weaponResponseModel, keyResponseModel, itemTypeModel } from "~/types/item";
import $api from "~/composables/useCustomFetch";

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

            const { data } = await $api(`${mainStore.base_url}api/item/${type.value[i].category}`)

            switch(type.value[i].type){
                case 0:{
                    const requestItem : potionResponseModel = data.value as potionResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.potion = requestItem.data
                    }
                }
                break;
                case 1:{
                    const requestItem : otherResponseModel = data.value as otherResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.other = requestItem.data
                    }
                } 
                break;
                case 2:{
                    const requestItem : materialResponseModel  = data.value as materialResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.material = requestItem.data
                    }
                }
                case 3:{
                    const requestItem : weaponResponseModel  = data.value as weaponResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.weapon = requestItem.data
                    }
                }
                break;
                case 4:{
                    const requestItem: armorResponseModel = data.value as armorResponseModel
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
                    const requestItem: keyResponseModel = data.value as keyResponseModel
                    console.log(requestItem)
                    if(requestItem.status === 200){
                        item.value.key = requestItem.data
                    }
                }
                break;
            }
        }
    }

    return {
        item,
        getItemType,
        getItemData
    }
})