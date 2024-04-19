import { defineStore } from "pinia";
import { ref } from "vue";

export const useDialogStore = defineStore('dialog', () => {
    const createLevelDialog = ref<boolean>(false)
    // On and off switch for event create dialog
    const createEventDialog = ref<boolean>(false)
    // On and off switch for event edit dialog
    const editEventDialog = ref<boolean>(false)
    // On and off switch for event item selection
    const eventItemDialog = ref<boolean>(false)
    // On and off switch for event scene create
    const eventSceneCreateDialog = ref<boolean>(false)
    // On and off switch for event scene edit
    const eventSceneEditDialog = ref<boolean>(false)
    // On and off switch for background images
    const bgAssetsGalleryDialog = ref<boolean>(false)
    // On and off switch for event dialogue create
    const dialougeCreateDialog = ref<boolean>(false)
    // On and off switch for event dialogue option create
    const optionCreateDialog = ref<boolean>(false)
    // On and off switch for event dialogue option effect
    const optionEffectDialog = ref<boolean>(false)
    // On and off swith for editor context menu
    const contextMenu = ref<boolean>(false)
    
    const toggleDialog = (type: string) => {
        switch(type){
            case 'level-create':
                createLevelDialog.value = !createLevelDialog.value
            break;
            case 'event-create':
                createEventDialog.value = !createEventDialog.value
            break;
            case 'event-edit':
                editEventDialog.value = !editEventDialog.value
            break;
            case 'event-item':
                eventItemDialog.value = !eventItemDialog.value
            break;
            case 'scene-create':
                eventSceneCreateDialog.value = !eventSceneCreateDialog.value
            break;
            case 'scene-edit':
                eventSceneEditDialog.value = !eventSceneEditDialog.value
            break;
            case 'scene-bg':
                bgAssetsGalleryDialog.value = !bgAssetsGalleryDialog.value
            break;
            case 'scene-dialogue-create':
                dialougeCreateDialog.value = !dialougeCreateDialog.value
            break;
            case 'dialogue-option-create':
                optionCreateDialog.value = !optionCreateDialog.value
            break;
            case 'option-effect-create':
                optionEffectDialog.value = !optionEffectDialog.value
            break;
            case 'context-menu':
                contextMenu.value = !contextMenu.value
            break;
            // and more...
        }
    }

    return {
        createLevelDialog,
        createEventDialog,
        editEventDialog,
        eventItemDialog,
        eventSceneCreateDialog,
        eventSceneEditDialog,
        bgAssetsGalleryDialog,
        dialougeCreateDialog,
        optionCreateDialog,
        optionEffectDialog,
        contextMenu,
        toggleDialog
    }
})