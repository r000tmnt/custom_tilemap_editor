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
                                <v-btn color="secondary" @click="toggleDialog('event-item')">Add item</v-btn>
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
                                <v-btn color="secondary" @click="toggleDialog('scene-create')">Add Scene</v-btn>
                                <v-list-item 
                                    v-for="(item, index) in editContentType"
                                    :key="index">
                                    {{ `${index + 1}. Dialogue: ${item.dialogue[0].content}` }}
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
                        :items="triggerType">
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

    <event-item-list @event-item-update="updateEvent"/>
    <event-scene-create @create-scene="updateEvent" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import eventItemList from './eventItemList.vue';
import eventSceneCreate from './eventSceneCreate.vue';

const { createEventDialog } = storeToRefs(useDialogStore())
const { tileInfo, levelData } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

const eventType = ref<string[]>([
    "ITEM",
    "SCENE"
])

const triggerType = ref<string[]>([
    "stepOn",
    "beside",
    "defeat",
])

const editContentType = ref()
const selectedType = ref<string>("")

const rules = [
    (value: String | Number) => {
        if (value) return true

        return 'You must type something.'
    },
]

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

const updateEvent = (v: any) => {
    console.log(v)

    if(selectedType.value === 'ITEM'){
        tileInfo.value.events[tileInfo.value.events.length - 1].item = tileInfo.value.events[tileInfo.value.events.length - 1].item.concat(v)
    }else{
        tileInfo.value.events[tileInfo.value.events.length - 1].scene = tileInfo.value.events[tileInfo.value.events.length - 1].scene.concat(v)
    }

    editContentType.value = editContentType.value.concat(v)
}

// const emit = defineEmits(["triggerReload"])

// 重設表單
const resetFormState = () => {
    toggleDialog("event-create")
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
            resetFormState()
        }catch(err){
            console.log(err)
        }         
    }
}

</script>