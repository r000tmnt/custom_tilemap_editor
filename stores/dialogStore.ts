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
    // On and off switch for event dialogue edit
    const dialogueEditDialog = ref<boolean>(false)
    // On and off switch for event dialogue option create
    const optionCreateDialog = ref<boolean>(false)
    // On and off switch for event dialogue option effect
    const optionEffectDialog = ref<boolean>(false)
    // On and off swith for editor context menu
    const contextMenu = ref<boolean>(false)
    // On and off switch for editor enemy selector
    const enemySelector = ref<boolean>(false)
    // On and off switch for editor map expander
    const mapExpander = ref<boolean>(false)
    // On and off switch for level name edit input
    const levelInfoEdit = ref<boolean>(false)
    // On and off switch for level conversation phase
    const levelConversationEventEdit = ref<boolean>(false)
    // On and off switch for item create dialog
    const itemCreateDialog = ref<boolean>(false)
    // On and off switch for item edit dialog
    const itemEditDialog = ref<boolean>(false)
    // On and off switch for skill create dialog
    const skillCreateDialog = ref<boolean>(false)
    // On and off switch for skill edit dialog
    const skillEditDialog = ref<boolean>(false)
    // On and off switch for event delete warning
    const eventDeleteDialog = ref<boolean>(false)
    // On and off switch for asset viewer dialog
    const assetViewer = ref<boolean>(false)
    // On and off switch for tranlation viewer
    const translationListDialog = ref<boolean>(false)
    // On and off switch for asset delete warning
    const assetsDelete = ref<boolean>(false)
    // On and off switch for edit frame
    const editFrameDialog = ref<boolean>(false)
    // On and off switch for create animation
    const createAnimation = ref<boolean>(false)
    // On and off switch for output message dialog
    const outputMessage = ref<boolean>(false)
    
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
            case 'event-delete':
                eventDeleteDialog.value = !eventDeleteDialog.value
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
            case 'scene-dialogue-edit':
                dialogueEditDialog.value = !dialogueEditDialog.value
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
            case 'enemy-starting-point':
                enemySelector.value = !enemySelector.value
            break;
            case 'map-expander':
                mapExpander.value = !mapExpander.value
            break;
            case 'level-name-edit':
                levelInfoEdit.value = !levelInfoEdit.value
            break;
            case 'level-conversation-edit':
                levelConversationEventEdit.value = !levelConversationEventEdit.value
            break;
            case 'item-create':
                itemCreateDialog.value = !itemCreateDialog.value
            break;
            case 'item-edit':
                itemEditDialog.value = !itemEditDialog.value
            break;
            case 'skill-create':
                skillCreateDialog.value = !skillCreateDialog.value
            break;
            case 'skill-edit':
                skillEditDialog.value = !skillEditDialog.value
            break;
            case 'asset-viewer':
                assetViewer.value = !assetViewer.value
            break;
            case 'translation-viewer':
                translationListDialog.value = !translationListDialog.value
            break;
            case 'assets-delete':
                assetsDelete.value = !assetsDelete.value
            break;
            case 'edit-frame':
                editFrameDialog.value = !editFrameDialog.value
            break;
            case 'create-animation':
                createAnimation.value = !createAnimation.value
            break;
            case 'output-message':
                outputMessage.value = !outputMessage.value
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
        dialogueEditDialog,
        optionEffectDialog,
        contextMenu,
        enemySelector,
        mapExpander,
        levelInfoEdit,
        levelConversationEventEdit,
        itemCreateDialog,
        itemEditDialog,
        skillCreateDialog,
        skillEditDialog,
        eventDeleteDialog,
        assetViewer,
        translationListDialog,
        assetsDelete,
        editFrameDialog,
        createAnimation,
        outputMessage,
        toggleDialog
    }
})