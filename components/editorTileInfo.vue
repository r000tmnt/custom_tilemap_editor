<template>
    <v-card class="info" subtitle="Tile info" :text="`Width:${props.width}\nHeight:${props.height}\nX:${tileInfo.x}\nY:${tileInfo.y}\nEvents:${tileInfo.events.length}`">
        <v-card-actions>
            <v-btn color="primary" @click="createEvent(tileInfo.x, tileInfo.y)">Add event</v-btn>
            <!-- <v-btn :color="(tileInfo.events.length)? 'secondary' : 'grey'" :disabled="tileInfo.events.length === 0">Manage events</v-btn> -->
        </v-card-actions>

        <v-list>
            <v-list-item v-for="(event, index) in tileInfo.events" :key="index">
                <v-card :text="`Item: ${event.item.length} Scene: ${event.scene.length} Trigger: ${event.trigger}`"></v-card>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const props = defineProps(
    {
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
    }
)

const { tileInfo, levelData } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()

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
</script>
