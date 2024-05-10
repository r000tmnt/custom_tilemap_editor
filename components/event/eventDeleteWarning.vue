<template>
        <v-dialog
      v-model="eventDeleteDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="400"
        max-height="1000"
        :scrollable="true"
        title="Delete all events"
        text="Sure you want to delete all of them?"
      >
        <v-card-actions class="d-flex justify-end">
            <v-btn color="grey" @click="toggleDialog('event-delete')">NO</v-btn>
            <v-btn color="primary" @click="deleteAllEvent">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const { levelData, tileInfo } = storeToRefs(useEditorStore())
const { eventDeleteDialog } = storeToRefs(useDialogStore())
const { saveLevelData } = useEditorStore()
const { toggleDialog } = useDialogStore()

const emit = defineEmits(["eventDeleteAll"])

const deleteAllEvent = () => {
    const eventIndex = levelData.value.event.findIndex(e => e.position.x === tileInfo.value.x && e.position.y === tileInfo.value.y)
    levelData.value.event.splice(eventIndex, 1)
    saveLevelData()
    emit("eventDeleteAll")
}
</script>
