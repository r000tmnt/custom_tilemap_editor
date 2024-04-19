<template>
    <v-list v-if="contextMenu" id="contextMenu" ref="contextRef">
        <v-list-group value="Set starting point">
            <v-list-item>Player</v-list-item>
            <v-list-item>Enemy</v-list-item>
        </v-list-group>
        <v-list-item>Remove starting point</v-list-item>
        <v-list-item>Clear tiles on the map</v-list-item>
        <v-list-item>Expand map</v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';

const { contextMenu } = storeToRefs(useDialogStore())

const props = defineProps({
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
})

const contextRef = ref()

watch(() => [ props.x, props.y ], (newPosition) => {
    // console.log(newPosition)
    if(contextRef.value){
        const contextMenuElement = contextRef.value.$el
        contextMenuElement.style.top = newPosition[1] + 'px'
        contextMenuElement.style.left = newPosition[0] + 'px'
        console.log(contextMenuElement)
    }
})
</script>

<style>
#contextMenu{
    position: absolute;
}
</style>
