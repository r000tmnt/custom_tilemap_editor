<template>
    <v-dialog
      v-model="eventSceneEditDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Edit event scene"
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
                  {{ `Background image ${newScene.background.length? newScene.background: ''}` }}
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
                  v-model="newScene.people"
                  @input="(e:any) => updatePeopleInScene(e)"
                  :rules="inputRules"></v-text-field>

                <!-- Scene -->
                <v-card-actions>
                    <v-btn @click="toggleDialog('scene-dialogue-create')">New dialogue</v-btn>

                    <v-btn @click="prepareNewOptions">Create option</v-btn>
                </v-card-actions>

                <!-- Dialogue -->
                <v-list v-for="(dialogue, index) in newScene.dialogue">
                    {{ `${index + 1}. ${dialogue.option?.length? dialogue.option[0].content[0] : dialogue.content }` }}
                    <v-icon class="ml-2" 
                        color="secondary" 
                        icon="mdi-note-edit-outline"
                        @click="editDialogue(index)"></v-icon>

                    <v-icon icon="mdi-trash-can" 
                      color="danger"
                      class="ml-2" 
                      @click.stop="deleteDialogue(index)"></v-icon>
                </v-list>  
            </v-container>
        </v-form>

        <v-row>
          <v-col class="d-flex justify-end">
                <v-btn color="grey" 
                  @click="toggleDialog('scene-edit')"
                  class="mr-2">CANCEL</v-btn>
                <v-btn color="primary" @click="editScene">CONFIRM</v-btn>            
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
      @update-event-options="confirmOption" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, computed, onMounted} from 'vue'
import type { eventSceneModel, dialogueOptionModel, eventDialogueModel } from '~/types/level'

import eventSceneBgGallery from './eventSceneBgGallery.vue';
import eventDialogueCreate from './eventDialogueCreate.vue';
import eventDialogueEdit from './eventDialogueEdit.vue';
import eventOptionList from './eventOptionList.vue';

const { toggleDialog } = useDialogStore()
const { eventSceneEditDialog } = storeToRefs(useDialogStore())
const { audioAssets, levelData, tileInfo, editDialogueIndex } = storeToRefs(useEditorStore())
const { dialougeCreateDialog, dialogueEditDialog, bgAssetsGalleryDialog, optionCreateDialog, optionListDialog } = storeToRefs(useDialogStore())
const { selectRules, inputRules } = useRuleStore()
const { getAudioAssets, getBattleAudioAsset } = useEditorStore()

const props = defineProps({
    scene: {
        type: Object,
        default: {
                background: "",
                people: 0,
                audio: "",
                dialogue: []
            }
    },
})

const emit = defineEmits(["editScene"])

const formRef = ref()

const newScene = ref<eventSceneModel>(JSON.parse(JSON.stringify(props.scene)))

const dialogueToEdit = ref<eventDialogueModel>()

const prepareNewOptions = () => {
  editDialogueIndex.value = props.scene.dialogue.length
  dialogueToEdit.value = props.scene.dialogue[editDialogueIndex.value] = {
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
    editDialogueIndex.value = index
    dialogueToEdit.value = newScene.value.dialogue[index]
    
    if(dialogueToEdit.value.option){
      
      toggleDialog("dialogue-option-list")
    }else{
      toggleDialog("scene-dialogue-edit")
    }
}

const deleteDialogue = (index: number) => {
  // editDialogueIndex.value = index
  newScene.value.dialogue.splice(index, 1)
}

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
  console.log("comfirmDialogue :>>>", v)
  newScene.value.dialogue.push(v)
}

const updateDialogue = (v: eventDialogueModel) => {
    console.log("updateDialogue :>>>", v)
    newScene.value.dialogue[editDialogueIndex.value] = v
}

const confirmOption = (v: dialogueOptionModel[]) => {
  newScene.value.dialogue[editDialogueIndex.value].option = v
}

const editScene = () => {
  formRef.value?.validate().then((result: any) => {
    if(result.valid){
      emit("editScene", newScene.value)
      toggleDialog("scene-edit")
    }
  })
}

onMounted(() => {
    console.log(props.scene)
})

onBeforeMount(async() => {
  await getAudioAssets()
  await getBattleAudioAsset()
})
</script>
