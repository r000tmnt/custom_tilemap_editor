<template>
    <v-dialog
      v-model="optionListDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Dialogue options"
      ></v-card>
      <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('dialogue-option-create')">
            CREATE OPTION
        </v-btn>
      <v-list>
        <v-list-item v-for="(option, index) in options"
            :key="option.value"
            @click.stop="editOption(option)">
            {{ option.value }}

            <v-icon icon="mdi-trash-can" color="danger" @click.stop="deleteOption(index)"></v-icon>
        </v-list-item>
      </v-list>
    </v-dialog>

    <event-option-create />
    <event-option-edit :option="optionToEdit"
      @edit-option="" />
</template>

<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { dialogueOptionModel, eventDialogueModel } from '~/types/level'

import eventOptionCreate from './eventOptionCreate.vue';
import eventOptionEdit from './eventOptionEdit.vue';

const props = defineProps({
    // options: {
    //     type: Array as PropType<dialogueOptionModel[]>,
    //     default: [] as dialogueOptionModel[]
    // }
    // sceneIndex: {
    //     type: Number,
    //     default: 0
    // },
    // dialogueIndex: {
    //     type: Number, 
    //     default: 0
    // },
    dialogue: {
        type: Object as PropType<eventDialogueModel>,
        default: {}
    }
})

// const { editEventIndex, tileInfo } = storeToRefs(useEditorStore())
const { optionListDialog } = useDialogStore()
const { toggleDialog } = useDialogStore()

const options = ref<dialogueOptionModel[] | undefined>([])

const optionToEdit = ref<dialogueOptionModel>()

const editOption = (option: dialogueOptionModel) => {
    console.log("option :>>>", option)
    optionToEdit.value = option
    toggleDialog("dialouge-option-edit")
}

const deleteOption = (index: number) => {
    options.value?.splice(index, 1)
}

onMounted(() => {
    // if(tileInfo.value.events[editEventIndex.value].scene[props.sceneIndex].dialogue[props.dialogueIndex].option !== undefined){
    //     options.value = tileInfo.value.events[editEventIndex.value].scene[props.sceneIndex].dialogue[props.dialogueIndex].option
    // }

    if(props.dialogue.option !== undefined){
        options.value = JSON.parse(JSON.stringify(props.dialogue.option))
    }
})
</script>
