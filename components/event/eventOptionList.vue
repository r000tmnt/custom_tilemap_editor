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
      >
        <v-btn prepend-icon="mdi-plus-box" color="primary" @click="toggleDialog('dialogue-option-create')">
              CREATE OPTION
          </v-btn>
        <v-list>
          <v-list-item v-for="(option, index) in options"
              :key="option.value"
              @click.stop="editOption(option, index)">
              {{ option.value }}

              <v-icon icon="mdi-trash-can" color="danger" @click.stop="deleteOption(index)"></v-icon>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-btn @click="toggleDialog('dialogue-option-list')">Cancel</v-btn>
          <v-btn color="primary" @click="updateDialogueOptions">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <event-option-create @create-option="createOption" />
    <event-option-edit :option="optionToEdit"
      @edit-option="confirmOption" />
</template>

<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { dialogueOptionModel, eventDialogueModel } from '~/types/level'

import eventOptionCreate from './eventOptionCreate.vue';
import eventOptionEdit from './eventOptionEdit.vue';

const props = defineProps({
    dialogue: {
        type: Object as PropType<eventDialogueModel>,
        default: {}
    }
})

const emit = defineEmits(["updateEventOptions"])

// const { editEventIndex, tileInfo } = storeToRefs(useEditorStore())
const { optionListDialog } = useDialogStore()
const { toggleDialog } = useDialogStore()

const options = ref<dialogueOptionModel[] | undefined>([])

const optionToEdit = ref<dialogueOptionModel>()

const editIndex = ref<number>(-1)

const editOption = (option: dialogueOptionModel, index: number) => {
    console.log("option :>>>", option)
    optionToEdit.value = option
    editIndex.value = index
    toggleDialog("dialouge-option-edit")
}

const deleteOption = (index: number) => {
    options.value?.splice(index, 1)
}

const createOption = (v: dialogueOptionModel) => {
  props.dialogue.option?.push(v)
}

const confirmOption = (v: dialogueOptionModel) => {
  if(props.dialogue.option){
    props.dialogue.option[editIndex.value] = v
    toggleDialog("dialogue-event-list")
  }
}

const updateDialogueOptions = () => {
  emit("updateEventOptions", props.dialogue)
}

onMounted(() => {
    if(props.dialogue.option !== undefined){
        options.value = JSON.parse(JSON.stringify(props.dialogue.option))
    }
})
</script>
