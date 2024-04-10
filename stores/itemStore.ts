import { defineStore } from "pinia";
import { ref } from "vue";
import type { typeResponseModel } from "~/types/item";

export const useItemStore = defineStore('item', () => {
    const item = ref({
        armor: [],
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
        const requestType: typeResponseModel = await $fetch(`${mainStore.base_url}api/type`)
        
        if(requestType.status === 200){}
    }

    return {
        item,
        type
    }
})