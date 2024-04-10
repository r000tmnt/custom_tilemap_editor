<template>
    <v-dialog
      v-model="createEventDialog"
      width="auto"
    >
      <v-card
        class="pa-2"
        width="500"
        title="Create new event"
      >
        <v-form @submit.prevent>
            <v-container>
                <v-row>
                    Position: {{  `${tileInfo.events[tileInfo.events.length - 1].position.x}, ${tileInfo.events[tileInfo.events.length - 1].position.y}`  }}
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
                            <v-list-item 
                                v-for="(item, index) in selectedType"
                                :key="index">
                                {{ item }}
                            </v-list-item>
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
import type { responseModel } from '~/types/index'

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

const selectedType = ref()

const rules = [
    (value: String | Number) => {
        if (value) return true

        return 'You must type something.'
    },
]

const selectType = (type:string) => {
    if(type === 'ITEM'){
        selectedType.value = tileInfo.value.events[tileInfo.value.events.length - 1].item
    }else{
        selectedType.value = tileInfo.value.events[tileInfo.value.events.length - 1].scene
    }
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