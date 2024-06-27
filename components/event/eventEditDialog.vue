<template>
    <v-dialog
      v-model="editEventDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Edit event"
      >
        <v-form @submit.prevent>
            <v-container>
                <v-row>
                    <v-col>
                        Position: {{  `${tileInfo.events[editEventIndex].position.x}, ${tileInfo.events[editEventIndex].position.y}`  }}
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
                                        item.dialogue[0].content.length? item.dialogue[0].content : item.dialogue[0].option[0].content : ''}` }}

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
                        v-model="tileInfo.events[editEventIndex].trigger">
                    </v-select>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-btn type="button" @click="resetFormState" block>Cancel</v-btn>
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
        :latest-index="eventIndex" />
    <event-scene-create v-if="eventSceneCreateDialog"
        :latest-index="eventIndex"
        :child-index="childIndex" />
    <event-scene-edit v-if="eventSceneEditDialog" :scene="sceneToEdit" @edit-scene="editEvent" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import eventItemList from './eventItemList.vue';
import eventSceneCreate from './eventSceneCreate.vue';
import eventSceneEdit from './eventSceneEdit.vue';

const { editEventDialog, eventItemDialog, eventSceneCreateDialog, eventSceneEditDialog } = storeToRefs(useDialogStore())
const { tileInfo, levelData, editEventIndex, triggerType } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

const eventType = ref<string[]>([
    "ITEM",
    "SCENE"
])

const editContentType = ref()
const selectedType = ref<string>("")
const sceneToEdit = ref()
const eventIndex = ref<number>(tileInfo.value.indexes[editEventIndex.value])
const editIndex = ref<number>(0)
const childIndex = ref<number>(0)

const editScene = (index: number) => {
    editIndex.value = index
    sceneToEdit.value = editContentType.value[index]
    toggleDialog("scene-edit")
}

const selectType = (type:string) => {
    selectedType.value = type

    if(type === 'ITEM'){
        editContentType.value = tileInfo.value.events[editEventIndex.value].item
    }else{
        editContentType.value = tileInfo.value.events[editEventIndex.value].scene
    }

    console.log(editContentType.value)
}

const getEventIndex = () => {
    if(selectedType.value === "ITEM"){
        toggleDialog('event-item')
    }else{
        levelData.value.event[eventIndex.value].scene.push(
            {
                background: "",
                audio: "",
                people: 1,
                dialogue: []
            }
        )

        childIndex.value = levelData.value.event[eventIndex.value].scene.length - 1

        toggleDialog('scene-create')        
    }
}


const removeEventItem = (index: number) => {
    editContentType.value.splice(index, 1)
}


const editEvent = (v: any) => {
    console.log(v)

    if(selectedType.value === 'ITEM'){
        tileInfo.value.events[editEventIndex.value].item[editIndex.value] = v
    }else{
        tileInfo.value.events[editEventIndex.value].scene[editIndex.value] = v
    }

    editContentType.value[editIndex.value] = v
}

// const emit = defineEmits(["triggerReload"])

// 重設表單
const resetFormState = () => {
    toggleDialog("event-edit")
    //if(tileInfo.value.events.length){
      //  tileInfo.value.events.splice(editEventIndex.value, 1)
    //}
}

// 編輯關卡事件
const createEvent = () => {
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
        resetFormState()
    }catch(err){
        console.log(err)
    }
}

</script>