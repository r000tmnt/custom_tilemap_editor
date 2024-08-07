<template>
    <v-dialog
      v-model="createEventDialog"
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
        <v-form>
            <v-container>
                <v-row>
                    <v-col>
                        Position: {{  `${tileInfo.events[tileInfo.events.length - 1].position.x}, ${tileInfo.events[tileInfo.events.length - 1].position.y}`  }}
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-list>
                            <v-list-item 
                                v-for="type in eventType"
                                :key="type"
                                @click="selectType(type)">
                                {{ type }}
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="8">
                        <v-list>
                            <template v-if="selectedType === 'ITEM'">
                                <!-- item -->
                                <v-btn color="secondary" @click="getEventIndex">Add item</v-btn>
                                <v-list-item 
                                    v-for="(item, index) in editContentType"
                                    :key="index">
                                    <div class="d-flex justify-space-between">
                                        <span>
                                            id: {{ item.id }}
                                        </span>
                                        <span>
                                            Quantity: {{ item.amount }}
                                        </span>
                                        <v-icon icon="mdi-trash-can" color="#F44336" @click="removeEventItem(index)"></v-icon>
                                    </div>
                                </v-list-item>
                            </template>

                            <template v-if="selectedType === 'SCENE'">
                                <!-- scene -->
                                <v-btn color="secondary" @click="getEventIndex">Add Scene</v-btn>
                                <v-list-item 
                                    v-for="(item, index) in editContentType"
                                    :key="index">
                                    {{ `${index + 1}. Dialogue: ${ item.dialogue.length?
                                        item.dialogue[0].content.length? item.dialogue[0].content : item.dialogue[0].option[0].response[0].content : ''}` }}

                                        <v-icon class="ml-2" 
                                            color="secondary" 
                                            icon="mdi-note-edit-outline"
                                            @click="editScene(index)"></v-icon>
                                </v-list-item>    
                            </template>

                            <template v-if="!selectedType.length" >
                                <div style="text-align:center">
                                    Chose a type to edit
                                </div>
                            </template>
                        </v-list>
                    </v-col>
                </v-row>

                <v-row>
                    <v-select
                        label="Trigger"
                        :items="triggerType"
                        v-model="levelData.event[latestIndex].trigger">
                    </v-select>
                </v-row>

                <v-row v-if="levelData.event[latestIndex].trigger === 'defeat'">
                    <!-- Decide which enemy is the key to trigger the event -->
                    <v-select 
                        label="Enemy to defeat"
                        :items="optionConditionValue"
                        v-model="levelData.event[latestIndex].requireOption"></v-select>
                </v-row>

                <v-row v-if="levelData.event[latestIndex].trigger === 'option'">
                    <!-- Decide which option is the key to trigger the event -->
                    <v-select
                        label="Require option" 
                        :items="optionList.map(o => o.value)"
                        v-model="levelData.event[latestIndex].requireOption"></v-select>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-btn type="button" @click="cancelEventCreate" block>Cancel</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn type="submit" color="primary" @click="createEvent" block>Submit</v-btn> 
                    </v-col>                 
                </v-row>

            </v-container>
        </v-form>
      </v-card>
    </v-dialog>

    <event-item-list v-if="eventItemDialog"
        :latest-index="latestIndex"/>
    <event-scene-create v-if="eventSceneCreateDialog"
        :latest-index="latestIndex"
        :child-index="childIndex" />
    <event-scene-edit v-if="eventSceneEditDialog"
        :scene="sceneToEdit" />
    <event-option-list 
      @update-event-options="confirmOption"/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

import eventItemList from './eventItemList.vue';
import eventSceneCreate from './eventSceneCreate.vue';
import eventSceneEdit from './eventSceneEdit.vue';
import eventOptionList from './eventOptionList.vue';
import type { eventDialogueModel, dialogueOptionModel } from '~/types/level';

const { createEventDialog, eventSceneCreateDialog, eventSceneEditDialog, eventItemDialog } = storeToRefs(useDialogStore())
const { tileInfo, levelData, triggerType, editSceneIndex, optionConditionValue } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

const eventType = ref<string[]>([
    "ITEM",
    "SCENE"
])

const optionList = ref<dialogueOptionModel[]>([])
const editContentType = ref()
const selectedType = ref<string>("")
const latestIndex = ref<number>(levelData.value.event.length - 1)
const childIndex = ref<number>(-1)
const sceneToEdit = ref()

watch(() => levelData.value.event[latestIndex.value].trigger, (newType, oldType) => {
    if(newType === 'defeat'){
        // Gather enemyList
        optionConditionValue.value = levelData.value.enemy.map((e, index) => `Enemy ${index+1}`)

        // If the enemy is a player character
        optionConditionValue.value.push("class")
    }

    if(newType === 'option'){
        // Gather option list
        levelData.value.event.forEach(e => {
            e.scene.forEach(s => {
                s.dialogue.forEach(d => {
                    if(d.option){
                        d.option.forEach(o => {
                            optionList.value.push(o)
                        })
                    }
                })
            })
        })
    }
})

const getEventIndex = () => {
    if(selectedType.value === "ITEM"){
        toggleDialog('event-item')
    }else{
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
}

const removeEventItem = (index: number) => {
    editContentType.value.splice(index, 1)
}

const selectType = (type:string) => {
    selectedType.value = type

    if(type === 'ITEM'){
        editContentType.value = tileInfo.value.events[tileInfo.value.events.length - 1].item
    }else{
        editContentType.value = tileInfo.value.events[tileInfo.value.events.length - 1].scene
    }

    console.log(editContentType.value)
}

const cancelEventCreate = () => {
    levelData.value.event.splice(levelData.value.event.length - 1, 1)
    toggleDialog("event-create")
}

const editScene = (index: number) => {
    editSceneIndex.value = index
    sceneToEdit.value = editContentType.value[index]
    toggleDialog("scene-edit")
}

const confirmOption = (v: eventDialogueModel) => {
  //newScene.value.dialogue[editSceneIndex.value] = v
}

// 新建關卡事件
const createEvent = () => {
    if(tileInfo.value.events[tileInfo.value.events.length - 1].item.length || tileInfo.value.events[tileInfo.value.events.length - 1].scene.length){
        try{
            const pointer: number[] = []
            levelData.value.event.forEach((e, index) => {
                if(e.position.x === tileInfo.value.events[0].position.x && e.position.y === tileInfo.value.events[0].position.y){
                    pointer.push(index)
                }
            })

            tileInfo.value.events.forEach((e, index) => {
                levelData.value.event[pointer[index]] = e
            })
            saveLevelData()
            toggleDialog("event-create")
        }catch(err){
            console.log(err)
        }         
    }
}

</script>