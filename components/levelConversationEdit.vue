<template>
    <v-dialog
      v-model="levelConversationEdit"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="Edit level conversation phase"
      >
        <v-form ref="formRef">
            <!-- <v-text-field label="Level name"
                :rules="inputRules"
                v-model="newName"></v-text-field> -->
                <v-btn color="secondary" @click="toggleDialog('scene-create')">Add Scene</v-btn>
                <v-list-item 
                    v-for="(item, index) in levelData.event.filter((e: levelEventModel) => Object.entries(e.position).length === 0)"
                    :key="index"
                    @click="editScene">
                    {{ `${index + 1}. Scene: ${item.scene.length}` }}
                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline"></v-icon>
                </v-list-item> 
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="cancelEvent">CANCEL</v-btn>
            <v-btn color="primary" @click="createEvent">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

    <event-scene-create v-if="eventSceneCreateDialog" 
      @create-scene="createConversationScene" />
    <event-scene-edit v-if="eventSceneEditDialog" 
      :scene="sceneToEdit" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { levelEventModel, eventSceneModel } from '~/types/level';

import eventSceneCreate from './event/eventSceneCreate.vue';
import eventSceneEdit from './event/eventSceneEdit.vue';

const { levelData } = storeToRefs(useEditorStore())
const { levelConversationEdit, eventSceneEditDialog, eventSceneCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

// const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()

const sceneToEdit = ref<eventSceneModel[]>()

const createConversationScene = (v: any) => {
    console.log(v)
    const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
    // Insert the event before battlephase
    levelData.value.event[battlePhaseIndex - 1].scene = v
}

const editScene = () => {
  const battlephaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
  
  sceneToEdit.value = levelData.value.event[battlephaseIndex - 1].scene
  toggleDialog("scene-edit")
}

const cancelEvent = () => {
    const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)

    levelData.value.event.splice(battlePhaseIndex - 1, 1)
    toggleDialog('level-conversation-edit')
}

const createEvent = () => {
    saveLevelData()
    toggleDialog('level-conversation-edit')
}
</script>
