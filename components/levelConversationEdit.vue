<template>
    <v-dialog
      v-model="levelConversationEventEdit"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="Edit level conversation phase"
      >
        <v-form v-if="eventBeforeBattle.length" ref="formRef" class="pt-4 px-5">
            <v-btn color="secondary"
            @click="createConversation">Add Conversation</v-btn>
            
            <v-list>
                <v-list-group
                  v-for="(item, index) in eventBeforeBattle"
                  :key="index"
                  :value="`Conversation event ${index + 1}`" @click.stop>
                  <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props">
                        {{ `Conversation event ${index + 1}` }}
                        <v-icon icon="mdi-trash-can" color="danger" @click="removeEvent(index)"></v-icon>
                      </v-list-item> 
                  </template>
                  <v-btn color="secondary" @click="toggleDialog('scene-create')">Add Scene</v-btn>
                  
                  <v-list-item v-for="(content, pointer) in item.scene" >
                    {{ `Event-${index + 1}-Scene-${pointer + 1}` }}
                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editScene(pointer)"></v-icon> 
                    <v-icon icon="mdi-trash-can" color="danger" @click="removeScene(index, pointer)"></v-icon>
                  </v-list-item>
                </v-list-group>
                <!-- <v-icon class="ml-2" icon="mdi-arrow-down" color="secondary"></v-icon> -->
                <!-- <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editScene(index)"></v-icon> -->
                <!-- <v-icon icon="mdi-trash-can" color="danger" @click="eventBeforeBattle.splice(index, 1)"></v-icon> -->
            </v-list> 
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="toggleDialog('level-conversation-edit')">CANCEL</v-btn>
            <v-btn color="primary" @click="createEvent">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

    <event-scene-create v-if="eventSceneCreateDialog" 
       />
    <event-scene-edit v-if="eventSceneEditDialog" 
      :scene="sceneToEdit"
      @edit-scene="editConversationScene" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { levelEventModel, eventSceneModel, eventPositionModel } from '~/types/level';

import eventSceneCreate from './event/eventSceneCreate.vue';
import eventSceneEdit from './event/eventSceneEdit.vue';

const { levelData } = storeToRefs(useEditorStore())
const { levelConversationEventEdit, eventSceneEditDialog, eventSceneCreateDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

// const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()

const sceneToEdit = ref<eventSceneModel>()
const editIndex = ref<number>(-1)
const latestIndex = ref<number>(-1)
const childIndex = ref<number>(-1)

const eventBeforeBattle = ref<levelEventModel[]>(levelData.value.event.filter(e => !Object.entries(e.position).length))

const createConversation = () => {
    // Insert an empty event in to the array
    const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
    const newEvent = {
        position: {} as eventPositionModel,
        item: [],
        scene: [],
        trigger: "auto"
    }
    // Insert the event before battlephase
    levelData.value.event.splice(battlePhaseIndex, 0, newEvent) 

    // Update array
    eventBeforeBattle.value.push(newEvent)
}

const editConversationScene = (v: any) => {
    console.log(v)
    const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
    // Insert the event before battlephase
    levelData.value.event[battlePhaseIndex - 1].scene[editIndex.value] = v
}

const editScene = (index: number) => {
  const battlephaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
  editIndex.value = index
  sceneToEdit.value = levelData.value.event[battlephaseIndex - 1].scene[index]
  toggleDialog("scene-edit")
}

const removeEvent = (index: number) => {
  eventBeforeBattle.value.splice(index, 1)
  levelData.value.event.splice(index, 1)
}

const removeScene = (index: number, pointer: number) => {
  eventBeforeBattle.value[index].scene.splice(pointer, 1)
  levelData.value.event[index].scene.splice(pointer, 1)
}

const prepareIndex = () => {
  latestIndex.value = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)

}

const createEvent = () => {
    saveLevelData()
    toggleDialog('level-conversation-edit')
}
</script>
