<template>
    <v-dialog
      v-model="eventSceneCreateDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Create new event"
      >
        <v-form @submit.prevent>
            <v-container>
                <!-- Background image file -->
                <v-select label="Background image"></v-select>

                <!-- Aduio file -->
                <v-select label="Background audio"></v-select>

                <!-- Max people on the screen, default to 1 -->
                <v-text-field 
                  type="number" 
                  v-model="newScene.people"
                  @input="(e:any) => updatePeopleInScene(e)"></v-text-field>

                <!-- Scene -->
                <v-card-actions>
                    <v-btn>New dialogue</v-btn>
                </v-card-actions>
                <v-expansion-panels v-for="(scene, index) in tileInfo.events[tileInfo.events.length - 1].scene" :key="index">
                    <v-expansion-panel>
                        <v-expansion-panel-title>{{ `SCENE ${index + 1}` }}</v-expansion-panel-title>
                        <!-- Dialogue -->
                        <v-list v-for="(dialogue, index) in scene.dialogue">
                            {{ dialogue.content }}
                        </v-list>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-container>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import type { eventSceneModel } from '~/types/level'

const { toggleDialog } = useDialogStore()
const { eventSceneCreateDialog } = storeToRefs(useDialogStore())
const { tileInfo, editEventIndex } = storeToRefs(useEditorStore())

const newScene = ref<eventSceneModel>({
  background: "",
  audio: "",
  people: 1,
  dialogue: []
})

const updatePeopleInScene = (e: any) => {
  if(Number(e.target.value) <= 0){
    newScene.value.people = 1
  }else{
    newScene.value.people = Number(e.target.value) 
  }
}
</script>
