import { defineStore } from "pinia";
import { ref } from "vue";

export const useDialogStore = defineStore('dialog', () => {
    const createLevelDialog = ref<boolean>(false)

    const toggleDialog = (type: string) => {
        switch(type){
            case 'level':
                createLevelDialog.value = !createLevelDialog.value
            break;
            // and more...
        }
    }

    return {
        createLevelDialog,
        toggleDialog
    }
})