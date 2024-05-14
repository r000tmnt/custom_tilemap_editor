<template>
    <v-list 
        id="contextMenu"
        border="md"
        rounded
        elevation="12"
        :style="`top: ${props.y}px; left: ${props.x}px`"
        v-if="contextMenu"
        style="z-index: 10">
        <v-list-group value="Set starting point"
            @click.stop>
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">Set starting point</v-list-item>
            </template>
            <v-list-item @click="setStartingPoint(2)">Player</v-list-item>
            <v-list-item @click="setStartingPoint(3)">Enemy</v-list-item>
        </v-list-group>
        <v-list-item 
            :class="{'disabled': pointType < 2}"
            @click="removeStartingPoint">Remove starting point</v-list-item>
        <v-list-item @click="clearMap">Clear tiles on the map</v-list-item>
        <v-list-item @click="toggleDialog('map-expander')">Expand map</v-list-item>
    </v-list>

    <event-enemy-selector v-if="enemySelector" @set-mob="setMobStartingPoint" />
    <editor-map-expander v-if="mapExpander" @expand-map="emit('expandMap')"/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import type { mobDataModel } from '~/types/character';

// Components
import eventEnemySelector from './editorEnemySelector.vue'
import editorMapExpander from './editorMapExpander.vue'

const { contextMenu, mapExpander, enemySelector } = storeToRefs(useDialogStore())
const { levelData } = storeToRefs(useEditorStore())
const { saveLevelData, storeSteps } = useEditorStore()
const { getMobData } = useCharacterStore()
const { toggleDialog } = useDialogStore()

const pointType = ref<number>(-1)
const pointer = ref<number>(-1)

const props = defineProps({
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    row: {
        type: Number,
        default: 0
    },
    col: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits([
    "setStartingPoint",
    "removeStartingPoint",
    "clearAll",
    "expandMap"
])

watch(() => [ props.x, props.y ], (newPosition) => {
    // console.log(newPosition)
    if(newPosition.length){

        levelData.value.player.find((p, index) => {
            const { x, y } = p.startingPoint
            if(x === props.col && y === props.row){
                pointType.value = 2
                pointer.value = index
            }
        })

        levelData.value.enemy.find((p, index) => {
            const { x, y } = p.startingPoint
            if(x === props.col && y === props.row){
                pointType.value = 3
                pointer.value = index
            }
        })

        console.log(pointType.value)
    }
})

const setStartingPoint = (type: number) => {
    if(type === 2){
        levelData.value.player.push({ startingPoint: { x: props.col, y: props.row } })
        emit("setStartingPoint", { x: props.col, y: props.row, type })
        saveLevelData()
        toggleDialog("context-menu")
    }else{
        //TODO - Select enemy
        getMobData()
        toggleDialog("enemy-starting-point")
        emit("setStartingPoint", { x: props.col, y: props.row, type })
    }
}

const setMobStartingPoint = (mob: mobDataModel) => {
    levelData.value.enemy[levelData.value.enemy.length - 1].job = mob.id
    levelData.value.enemy[levelData.value.enemy.length - 1].name = mob.name
    emit("setStartingPoint", { x: props.col, y: props.row, type: 3 })
    saveLevelData()
    toggleDialog("context-menu")
}

const removeStartingPoint = (e: any) => {
    if(pointType.value > 1){
        if(pointType.value === 2){
            levelData.value.player.splice(pointer.value, 1)
        }else{
            levelData.value.enemy.splice(pointer.value, 1)
        }        
        emit("removeStartingPoint", { x: props.col, y: props.row, type: pointer.value })
    }else{
        e.stopPropagation()
    }
}

const clearMap = () => {
    for(let i=0, row = levelData.value.map.length; i < row; i ++){
        for(let j=0, col = levelData.value.map[i].length; j < col; j++){
            levelData.value.map[i][j] = 0

            if(i === (levelData.value.map.length - 1) && j === (levelData.value.map[0].length - 1)){
                console.log(levelData.value.map)
                storeSteps(levelData.value.map)
                emit("clearAll")
            }
        }
    }
}

</script>

<style>
#contextMenu{
    position: absolute;
}

.disabled{
    background: lightgray;
    color: white;
}
</style>
