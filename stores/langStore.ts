import { defineStore } from "pinia";
import { ref } from "vue";

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

    return {
        translateTargets
    }
})