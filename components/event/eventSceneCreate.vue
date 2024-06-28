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
        <v-form ref="formRef" class="pt-4 px-5">
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
                  {{ `Background image ${levelData.event[props.latestIndex].scene[props.childIndex].background.length? levelData.event[props.latestIndex].scene[props.childIndex].background: ''}` }}
                </v-btn>

                <!-- Aduio file -->
                <v-select label="Background audio"
                  :items="audioAssets.general">
                  <template v-slot:prepend-item>
                      <v-file-input clearable 
                        label="Upload file"
                        accept="audio/*"></v-file-input>
                  </template>
                </v-select>

                <!-- Max people on the screen, default to 1 -->
                <v-text-field 
                  type="number" 
                  v-model="levelData.event[props.latestIndex].scene[props.childIndex].people"
                  @input="(e:any) => updatePeopleInScene(e)"
                  :rules="inputRules"></v-text-field>

                <!-- Scene -->
                <v-card-actions>
                    <v-btn @click="toggleDialog('scene-dialogue-create')">New dialogue</v-btn>

                    <v-btn @click="prepareNewOptions">Create option</v-btn>
                </v-card-actions>

                <!-- Dialogue -->
                <v-list v-for="(dialogue, index) in levelData.event[props.latestIndex].scene[props.childIndex].dialogue">
                    {{ `${index + 1}. ${dialogue.content}` }}
                    <v-icon class="ml-2" 
                        color="secondary" 
                        icon="mdi-note-edit-outline"
                        @click="editDialogue(index)"></v-icon>
                </v-list> 
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

    <event-scene-bg-gallery v-if="bgAssetsGalleryDialog" 
        @set-scene-back-ground="setBackground" />
    <event-dialogue-create v-if="dialougeCreateDialog" 
      @create-dialogue="confirmDialogue" />
    <event-dialogue-edit v-if="dialogueEditDialog" 
      :dialogue="dialogueToEdit" 
      @edit-dialogue="updateDialogue" />
    <event-option-list v-if="optionListDialog"
      :dialogue="dialogueToEdit"
      @update-event-options="updateDialogue" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, computed} from 'vue'
import type { eventSceneModel, dialogueOptionModel, eventDialogueModel } from '~/types/level'

import eventSceneBgGallery from './eventSceneBgGallery.vue';
import eventDialogueCreate from './eventDialogueCreate.vue';
import eventOptionList from './eventOptionList.vue';
import eventDialogueEdit from './eventDialogueEdit.vue';

const { toggleDialog } = useDialogStore()
const { eventSceneCreateDialog } = storeToRefs(useDialogStore())
const { audioAssets, levelData } = storeToRefs(useEditorStore())
const { dialougeCreateDialog, dialogueEditDialog, bgAssetsGalleryDialog, optionListDialog } = storeToRefs(useDialogStore())
const { inputRules } = useRuleStore()
const { getAudioAssets, getBattleAudioAsset, saveLevelData } = useEditorStore()

const props = defineProps({
  latestIndex: {
    type: Number,
    default: 0,
  },
  childIndex: {
    type: Number,
    default: 0,
  }
})

const formRef = ref()

const dialogueToEdit = ref<eventDialogueModel>()
const editIndex = ref<number>(-1)

const prepareNewOptions = () => {
  editIndex.value = levelData.value.event[props.latestIndex].scene[props.childIndex].dialogue.length
  dialogueToEdit.value = levelData.value.event[props.latestIndex].scene[props.childIndex].dialogue[editIndex.value] = {
    person: "",
    style: "#ffffff",
    size: "",
    content: "",
    audio: [],
    option: []
  }
  toggleDialog('dialogue-option-list')
}

const editDialogue = (index: number) => {
    editIndex.value = index
    dialogueToEdit.value = levelData.value.event[props.latestIndex].scene[props.childIndex].dialogue[index]
    toggleDialog("scene-dialogue-edit")
}

const updatePeopleInScene = (e: any) => {
  if(Number(e.target.value) <= 0){
    levelData.value.event[props.latestIndex].scene[props.childIndex].people = 1
  }else{
    levelData.value.event[props.latestIndex].scene[props.childIndex].people = Number(e.target.value) 
  }
}

const setBackground = (path: string) => {
  levelData.value.event[props.latestIndex].scene[props.childIndex].background = path
}

const confirmDialogue = (v: eventDialogueModel) => {
  console.log("comfirmDialogue :>>>", v)
  levelData.value.event[props.latestIndex].scene[props.childIndex].dialogue.push(v)
  console.log(levelData.value.event[props.latestIndex].scene[props.childIndex])
}

const updateDialogue = (v: eventDialogueModel) => {
    console.log("updateDialogue :>>>", v)
    levelData.value.event[props.latestIndex].scene[props.childIndex].dialogue[editIndex.value] = v
}

const createScene = () => {
  formRef.value?.validate().then((result: any) => {
    if(result.valid){
      console.log(levelData.value.event[props.latestIndex].scene[props.childIndex])
      saveLevelData()
      toggleDialog("scene-create")
    }
  })
}

onBeforeMount(async() => {
  await getAudioAssets()
  await getBattleAudioAsset()
})
</script>
