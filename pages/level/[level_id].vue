<template>
    <v-container v-if="levelData === undefined">
        <v-row>
            <v-col cols="12" class="text-center">
                Loading...
            </v-col>
            <v-col cols="12">
                <v-progress-linear
                    color="deep-purple-accent-4"
                    height="6"
                    indeterminate
                    rounded
                ></v-progress-linear>
            </v-col>
        </v-row>
    </v-container>

    <section v-else>
        <!-- paint brushes and other tools -->
        <editor-tool-bar />

        <v-container>
            <v-row class="editor">
                <!-- tile assets -->
                <v-col cols="4">
                    <editor-assets />
                </v-col>

                <!-- tilemap editor -->
                <v-col cols="4">
                    <v-container id="canvasContainer">
                        <canvas 
                            ref="canvasRef"
                            @mousedown="canvasEvent"
                            @keydown="canvasKeyPressEvent"
                        ></canvas>
                    </v-container>
                </v-col>

                <!-- tile info -->
                <v-col cols="4">
                    <v-card subtitle="Tile info" :text="`X:${tileInfo.x}\nY:${tileInfo.y}\nEvents:${tileInfo.events.length}`">
                        <v-card-actions>
                            <v-btn>Add event</v-btn>
                            <v-btn>Manage events</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>     
        </v-container>
    </section> 
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

// Components
import editorToolBar from '../../components/editorToolBar.vue'
import editorAssets from '../../components/editorAssets.vue'

const route = useRoute()
const { levelData, steps, tiles, selectedTile, mode } = storeToRefs(useEditorStore())
const { initEditor, storeSteps, saveLevelData } = useEditorStore()
const { tileSize } = storeToRefs(useMainStore())

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()
const tileInfo = ref({
    x: 0,
    y: 0,
    events: []
})

const canvasEvent = (e: any) => {
    console.log('canvas mousedown event:>>> ', e)
    // Get the clicked position
    const y = e.clientY - canvasPosition.value.top
    const x = e.clientX - canvasPosition.value.left

    const row = Math.floor( y / tileSize.value)
    const col = Math.floor( x / tileSize.value)

    const mouseButton = e.button

    switch(mouseButton){
        case 0:
            // Left button
            switch(mode.value){
                case "nav":
                break;
                case "draw":
                    // Draw a tile on the canvas if selected
                    if(selectedTile.value !== null){
                        context.value.drawImage(selectedTile.value, col * tileSize.value, row * tileSize.value, tileSize.value, tileSize.value)
                        // Store the map before update
                        storeSteps(levelData.value.map)
                        // Update the map
                        let assetIndex = -1
                        for(let i=0; i < levelData.value.assets.length; i++){
                            if(levelData.value.assets[i].length){
                                if(selectedTile.value.src.includes(levelData.value.assets[i])){
                                    assetIndex = i
                                    break;
                                }
                            }
                        }

                        if(assetIndex >= 0){
                            console.log(assetIndex)
                            levelData.value.map[row][col] = assetIndex
                            // Save the changes
                            saveLevelData()
                        }
                    }                    
                break;
                case "erase":
                break;
            }
        break;
        case 2:
            // Right button
            // Open a context menu
        break;
        default:
            // Other
        break;
    }
}

const canvasKeyPressEvent = (e: any) => {
    // If the combination is ctrl + z
    if(e.keyCode === 90 && e.ctrlKey){
        // Take one step back
        levelData.value.map = steps.value[steps.value.length - 1]
        // Remove the step
        steps.value.splice(steps.value.length - 1, 1)
    }
}

onMounted(() => {
    console.log(route.params)
    if(route?.params?.level_id){
        initEditor(String(route.params.level_id)).then(() => {
            if(levelData.value !== undefined){
                console.log(canvasRef.value)
                if(canvasRef.value !== null){
                    canvasRef.value.width = levelData.value.map[0].length * tileSize.value
                    canvasRef.value.height = levelData.value.map.length * tileSize.value
                    context.value = canvasRef.value.getContext("2d")
                    canvasPosition.value = canvasRef.value.getBoundingClientRect()
                    
                    context.value.fillStyle = '#000000'
                    context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

                    for(let i=0, map = levelData.value.map; i < map.length; i++){
                        for(let j=0; j < map[i].length; j++){
                            const tile = levelData.value.assets[map[i][j]]
                            if(tile.length){
                                console.log("tile :>>", tile)
                                const img = document.createElement('img')
                                img.src = `/assets/images/env/${tile}`
                                // console.log(img)
                                tiles.value.push(img)
                                img.onload = () => {
                                    context.value.drawImage(img, tileSize.value * j, tileSize.value * i, tileSize.value, tileSize.value)
                                }
                            }
                        }
                    }
                }
            }
        })
    }
})
</script>

<style scoped>
.editor{
    margin-top: 64px;
}

#canvasContainer{
    position: relative;
}

canvas{
    border: 1px solid gray;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
</style>
