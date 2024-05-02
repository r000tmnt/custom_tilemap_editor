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
                    :key="index">
                    {{ `${index + 1}. Scene: ${item}` }}
                </v-list-item> 
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="toggleDialog('level-conversation-edit')">CANCEL</v-btn>
            <v-btn color="primary" @click="createEvent">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

    <event-scene-create @create-scene="createConversationScene" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { levelEventModel } from '~/types/level';

import eventSceneCreate from './event/eventSceneCreate.vue';

const { levelData } = storeToRefs(useEditorStore())
const { levelConversationEdit } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

// const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()

const createConversationScene = (v: any) => {
    console.log(v)
    const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
    // Insert the event before battlephase
    levelData.value.event.splice(battlePhaseIndex, 0, v)
}

const createEvent = () => {
    saveLevelData()
}
</script>
