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
        <v-form ref="formRef">
            <v-container>
                <!-- Background image file -->
                <!-- <v-select label="Background image"
                  :items="assets.bg"
                  >
                  <template v-slot:prepend-item>
                    <v-file-input clearable 
                      label="Upload file"
                      accept="image/*"></v-file-input>
                  </template>

                  <template v-slot:item="{props, item}">
                    <div class="d-flex">
                      <v-img 
                        v-bind="props"
                        :src="item.raw"
                        :width="56"
                        :max-height="100"
                        aspect-ratio="9/16"
                        cover></v-img>
                        <span>
                          {{ item.raw.split("/")[4] }}
                        </span>
                    </div>
                    

                  </template>
                </v-select> -->
                <v-btn @click="toggleDialog('scene-bg')">
                  {{ `Background image ${newScene.background.length? newScene.background: ''}` }}
                </v-btn>

                <!-- Aduio file -->
                <v-select label="Background audio"
                  :items="audioAssets.general"
                  :rules="selectRules">
                  <template v-slot:prepend-item>
                      <v-file-input clearable 
                        label="Upload file"
                        accept="audio/*"></v-file-input>
                  </template>
                </v-select>

                <!-- Max people on the screen, default to 1 -->
                <v-text-field 
                  type="number" 
                  v-model="newScene.people"
                  @input="(e:any) => updatePeopleInScene(e)"
                  :rules="inputRules"></v-text-field>

                <!-- Scene -->
                <v-card-actions>
                    <v-btn @click="toggleDialog('scene-dialogue-create')">New dialogue</v-btn>

                    <v-btn @click="toggleDialog('dialogue-option-create')">Create option</v-btn>
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
        <v-row>
          <v-col class="d-flex justify-end">
                <v-btn color="grey" 
                  @click="toggleDialog('scene-create')"
                  class="mr-2">CANCEL</v-btn>
                <v-btn color="primary" @click="createScene">CONFIRM</v-btn>            
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <event-scene-bg-gallery @set-scene-back-ground="setBackground" />
    <event-dialogue-create @create-dialogue="confirmDialogue" />
    <event-option-create @create-option="confirmOption" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onBeforeMount } from 'vue'
import type { eventSceneModel, dialogueOptionModle, eventDialogueModel } from '~/types/level'

import eventSceneBgGallery from './eventSceneBgGallery.vue';
import eventDialogueCreate from './eventDialogueCreate.vue';
import eventOptionCreate from './eventOptionCreate.vue';

const { toggleDialog } = useDialogStore()
const { eventSceneCreateDialog } = storeToRefs(useDialogStore())
const { tileInfo, editEventIndex, audioAssets, assets } = storeToRefs(useEditorStore())
const { selectRules, inputRules } = useRuleStore()
const { getAudioAssets, getBattleAudioAsset } = useEditorStore()

const emit = defineEmits(["createScene"])

const formRef = ref()

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

const setBackground = (path: string) => {
  newScene.value.background = path
}

const confirmDialogue = (v: eventDialogueModel) => {
  newScene.value.dialogue.push(v)
}

const confirmOption = (v: dialogueOptionModle) => {
  newScene.value.dialogue.push({
    person: "",
    style: "",
    size: "",
    content: "",
    option: [ v ]
  })
}

const createScene = () => {
  formRef.value?.validate((result: any) => {
    if(result.valid){
      emit("createScene", newScene)
      toggleDialog("scene-create")
    }
  })
}

onBeforeMount(async() => {
  await getAudioAssets()
  await getBattleAudioAsset()
})
</script>
