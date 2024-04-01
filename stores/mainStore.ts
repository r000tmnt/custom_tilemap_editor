import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const runtimeConfig = useRuntimeConfig()

    const base_url = ref<string>(runtimeConfig.public.URL)

    const tileSize = ref<Number>(32)

    return {
        base_url,
        tileSize
    }
})