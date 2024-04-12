<template>
    <v-dialog
      v-model="createEventDialog"
      width="auto"
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
                                <v-btn color="secondary">Add item</v-btn>
                                <v-list-item 
                                    v-for="(item, index) in editContentType"
                                    :key="index">
                                    <div class="d-flex">
                                        <span>
                                            {{ item.name }}
                                        </span>
                                        <span>
                                            {{ item.amount }}
                                        </span>
                                        <span>-</span>
                                        <span>+</span>
                                        <v-icon icon="mdi-trash"></v-icon>
                                    </div>
                                </v-list-item>
                            </template>

                            <template v-if="selectedType === 'SCENE'">
                                <!-- scene -->
                                <v-btn color="secondary">Add Scene</v-btn>
                                <v-list-item 
                                    v-for="(item, index) in editContentType"
                                    :key="index">
                                    {{ item }}
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
                        <v-btn type="submit" color="primary" @click="createLevel" block>Submit</v-btn> 
                    </v-col>                 
                </v-row>

            </v-container>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { responseModel } from '~/types/level'

const { base_url } = storeToRefs(useMainStore())
const { createEventDialog } = storeToRefs(useDialogStore())
const { tileInfo } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()

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

const selectType = (type:string) => {
    selectedType.value = type

    if(type === 'ITEM'){
        editContentType.value = tileInfo.value.events[tileInfo.value.events.length - 1].item
    }else{
        editContentType.value = tileInfo.value.events[tileInfo.value.events.length - 1].scene
    }

    console.log(editContentType.value)
}

// const emit = defineEmits(["triggerReload"])

// 重設建立表單
const resetFormState = () => {
    toggleDialog("event-create")
}

// 新建關卡檔案
const createLevel = async() => {
    try{
        const request : responseModel = await $fetch(`${base_url.value}api/data`, { method: "POST", body: {} })

        console.log(request)

        if(request.status === 200){
            // emit("triggerReload")
        }
        
    }catch(err){
        console.log(err)
    }
    resetFormState()
}

</script>