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
    const dialougeCreatedialog = ref<boolean>(false)
    
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
                dialougeCreatedialog.value = !dialougeCreatedialog.value
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
        dialougeCreatedialog,
        toggleDialog
    }
})