import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const url = useRequestURL()

    const base_url = ref<string>(`${url.protocol}//${url.host}/`)

    const tileSize = ref<number>(32)

    return {
        base_url,
        tileSize
    }
})