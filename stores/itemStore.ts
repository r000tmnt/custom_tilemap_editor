import { defineStore } from "pinia";
import { ref } from "vue";
import type { materialResponseModel, otherResponseModel, potionResponseModel, typeResponseModel, itemState, armorResponseModel, weaponResponseModel, keyResponseModel } from "~/types/item";

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

    const type = ref([])

    const getItemData = async() => {
        // Define mainStore
        const mainStore = useMainStore()

        // Get types first
        const requestType: typeResponseModel = await $fetch(`${mainStore.base_url}api/item/type`)
        // console.log(requestType)
        if(requestType.status === 200){
            // Get the data of item for various types
            for(let i=0, data = requestType.data; i < data.length; i++){
                const type = data[i].type
                switch(type){
                    case 0:{
                        const requestItem : potionResponseModel = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
                        console.log(requestItem)
                        if(requestItem.status === 200){
                            item.value.potion = requestItem.data
                        }
                    }
                    break;
                    case 1:{
                        const requestItem : otherResponseModel = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
                        console.log(requestItem)
                        if(requestItem.status === 200){
                            item.value.other = requestItem.data
                        }
                    } 
                    break;
                    case 2:{
                        const requestItem : materialResponseModel  = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
                        console.log(requestItem)
                        if(requestItem.status === 200){
                            item.value.material = requestItem.data
                        }
                    }
                    case 3:{
                        const requestItem : weaponResponseModel  = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
                        console.log(requestItem)
                        if(requestItem.status === 200){
                            item.value.weapon = requestItem.data
                        }
                    }
                    break;
                    case 4:{
                        const requestItem: armorResponseModel = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
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
                        const requestItem: keyResponseModel = await $fetch(`${mainStore.base_url}api/item/${data[i].category}`)
                        console.log(requestItem)
                        if(requestItem.status === 200){
                            item.value.key = requestItem.data
                        }
                    }
                    break;
                }
            }
        }
    }

    return {
        item,
        type,
        getItemData
    }
})