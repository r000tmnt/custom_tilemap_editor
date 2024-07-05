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
                        <v-icon icon="mdi-trash-can" color="danger" @click.stop="setNodeToDelete(`Conversation event ${index + 1}`, index)"></v-icon>
                      </v-list-item> 
                  </template>
                  <v-btn color="secondary" variant="outlined" @click="prepareIndex">Add Scene</v-btn>
                  
                  <v-list-item v-for="(content, subIndex) in item.scene" >
                    {{ `Event-${index + 1}-Scene-${subIndex + 1}` }}
                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editScene(index, subIndex)"></v-icon> 
                    <v-icon class="ml-2" icon="mdi-trash-can" color="danger" @click="setNodeToDelete( `Event-${index + 1}-Scene-${subIndex + 1}`, index, subIndex)"></v-icon>
                  </v-list-item>
                </v-list-group>
            </v-list> 
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="toggleDialog('level-conversation-edit')">CANCEL</v-btn>
            <v-btn color="primary" @click="createEvent">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

    <event-scene-create v-if="eventSceneCreateDialog" 
      :latest-index="latestIndex"
      :child-index="childIndex" />
    <event-scene-edit v-if="eventSceneEditDialog" 
      :scene="sceneToEdit"
      @edit-scene="editConversationScene" />
    <asset-delete-warning v-if="assetsDelete"
      :name="nodeToDelete.name"
      @delete-asset="proceedToDelete" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { levelEventModel, eventSceneModel, eventPositionModel } from '~/types/level';

import eventSceneCreate from './event/eventSceneCreate.vue';
import eventSceneEdit from './event/eventSceneEdit.vue';
import assetDeleteWarning from './assetDeleteWarning.vue';

const { levelData } = storeToRefs(useEditorStore())
const { levelConversationEventEdit, eventSceneEditDialog, eventSceneCreateDialog,assetsDelete } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

// const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()
const nodeToDelete = ref({
  name: "",
  index: -1,
  subIndex: -1
})
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
    if(battlePhaseIndex >= 0){
      levelData.value.event.splice(battlePhaseIndex, 0, newEvent) 
    }else{
      levelData.value.event.push(newEvent)
    }

    // Update array
    eventBeforeBattle.value.push(newEvent)
}

const editConversationScene = (v: any) => {
    console.log(v)
    // Insert the event before battlephase
    levelData.value.event[latestIndex.value].scene[editIndex.value] = v
}

const editScene = (index: number, subIndex: number) => {
  latestIndex.value = index
  editIndex.value = subIndex
  sceneToEdit.value = levelData.value.event[index].scene[subIndex]
  toggleDialog("scene-edit")
}

const setNodeToDelete = (name: string, index: number, subIndex?: number) => {
  nodeToDelete.value.name = name
  nodeToDelete.value.index = index
  if(subIndex) { nodeToDelete.value.subIndex = subIndex }
  toggleDialog("assets-delete")
}

const proceedToDelete = () => {
  if(nodeToDelete.value.name.includes("Scene")){
    removeScene(nodeToDelete.value.index, nodeToDelete.value.subIndex)
  }else{
    removeEvent(nodeToDelete.value.index)
  }
}

const removeEvent = (index: number) => {
  eventBeforeBattle.value.splice(index, 1)
  levelData.value.event.splice(index, 1)
}

const removeScene = (index: number, subIndex: number) => {
  eventBeforeBattle.value[index].scene.splice(subIndex, 1)
  levelData.value.event[index].scene.splice(subIndex, 1)
}

const prepareIndex = () => {
  latestIndex.value = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length) - 1
  levelData.value.event[latestIndex.value].scene.push(
      {
          background: "",
          audio: "",
          people: 1,
          dialogue: []
      }
  )

  childIndex.value = levelData.value.event[latestIndex.value].scene.length - 1
  toggleDialog('scene-create') 
}

const createEvent = () => {
    saveLevelData()
    toggleDialog('level-conversation-edit')
}
</script>
