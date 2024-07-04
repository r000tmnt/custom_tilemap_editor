<template>
    <v-dialog
      v-model="eventListDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        :title="`Manage events on tile ${tileInfo.x},${tileInfo.y}`"
      >
      <v-card-actions>
            <v-btn color="primary" 
                @click="createEvent(tileInfo.x, tileInfo.y)">Add event</v-btn>
            <v-btn :color="(tileInfo.events.length)? 'secondary' : 'grey'" 
                :disabled="tileInfo.events.length === 0"
                @click="toggleDialog('event-delete')">Remove events</v-btn>
        </v-card-actions>

        <v-list>
            <v-list-item v-for="(event, index) in tileInfo.events" :key="index">
                <v-card hover>
                    {{ `Item: ${event.item.length} Scene: ${event.scene.length} Trigger: ${event.trigger}` }}
                    <br/>
                    <v-btn size="x-small" variant="outlined" color="secondary" class="ml-auto" @click="editEvent(index)">EDIT</v-btn>
                    <v-btn size="x-small" variant="outlined" color="warning" class="ml-2" @click="deleteEvent(index)">DELETE</v-btn>
                </v-card>
            </v-list-item>
        </v-list>

        <v-card-actions>
            <v-btn class="ml-auto" color="primary" @click="toggleDialog('event-list')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { levelData, tileInfo, editEventIndex } = storeToRefs(useEditorStore())
const { eventListDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveLevelData } = useEditorStore()

const emit = defineEmits(["event-delete"])

const createEvent = (x: number, y: number) => {
    const newEvent = {
        position: { x, y },
        item: [],
        scene: [],
        trigger: 'auto'
    }
    levelData.value.event.push(newEvent)
    tileInfo.value.events.push(newEvent)

    toggleDialog("event-create")
}

const editEvent = (index: number) => {
    editEventIndex.value = index
    toggleDialog("event-edit")
}

const deleteEvent = (index: number) => {
    // Get each index of the event on the same position
    const pointer: number[] = []
    levelData.value.event.forEach((e, index) => {
        if(e.position.x === tileInfo.value.events[0].position.x && e.position.y === tileInfo.value.events[0].position.y){
            pointer.push(index)
        }
    })

    // Delete the event in levelData
    levelData.value.event.splice(pointer[index], 1)

    // Delete the event in tileInfo
    tileInfo.value.events.splice(index, 1)

    saveLevelData()
    emit("event-delete")
}
</script>
