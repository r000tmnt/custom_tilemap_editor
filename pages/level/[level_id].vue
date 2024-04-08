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
        <v-app-bar id="bar" :elevation="5">
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>{{ levelData.id }}</v-app-bar-title>

            <template v-slot:append>
                <v-btn icon="mdi-navigation" :color="mode === 'nav'? 'primary': 'grey'" @click="mode = 'nav'"></v-btn>

                <v-btn icon="mdi-pencil" :color="mode === 'draw'? 'primary': 'grey'" @click="mode = 'draw'"></v-btn>

                <v-btn icon="mdi-eraser" :color="mode === 'erase'? 'primary': 'grey'" @click="mode = 'erase'"></v-btn>

                <v-btn icon="mdi-cog" :color="mode === 'config'? 'primary': 'grey'" @click="mode = 'config'"></v-btn>
            </template>
        </v-app-bar>  

        <v-container>
            <v-row class="editor">
                <!-- tile assets -->
                <v-col cols="4">
                    <v-item-group class="d-flex" selected-class="selected">
                        <v-item
                            v-for="(img, index) in assets.env"
                            class="tile"
                            :key="img" 
                            v-slot="{ isSelected, selectedClass, toggle }"
                            @group:selected="(v) => selectTile(v, index)">
                                <v-card
                                :class="['d-flex align-center bg-grey', selectedClass]"
                                :height="tileSize"
                                :width="tileSize"
                                dark
                                @click="toggle"
                                >
                                    <!-- <div
                                        class="flex-grow-1 text-center"
                                    >
                                        {{ isSelected ? 'Selected' : 'Click Me!' }}
                                    </div> -->
                                    <v-img 
                                        width="32" 
                                        height="32" 
                                        alt="tile"
                                        :src="img">
                                    </v-img>
                                </v-card>
                        </v-item>
                    </v-item-group>
                </v-col>

                <!-- tilemap editor -->
                <v-col cols="8">
                    <v-container id="canvasContainer">
                        <canvas 
                            ref="canvasRef"
                            @mousedown="canvasEvent"
                            @keydown="canvasKeyPressEvent"
                        ></canvas>
                    </v-container>
                </v-col>
            </v-row>     
        </v-container>
    </section> 
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

const route = useRoute()
const { levelData, assets, steps } = storeToRefs(useEditorStore())
const { initEditor, storeSteps, saveLevelData } = useEditorStore()
const { tileSize, base_url } = storeToRefs(useMainStore())

// console.log(levelData.value)
// console.log(route.params)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()

// Tiles in the map
const tiles = ref<HTMLImageElement[]>([])
// Selected tile
const selectedTile = ref<HTMLImageElement|null>(null)
// Current mode
// nav - View tile info on click
const mode = ref<string>('nav')

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

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
    if(v.value){
        const assetUrl = assets.value.env[index]

        const assetIndex = tiles.value.findIndex(a => a.src.includes(assetUrl))

        // If it is a new tile in the map
        if(assetIndex < 0){
            levelData.value.assets.push(assetUrl)
            const newTile = document.createElement('img')
            newTile.src = `${base_url.value}${assetUrl}`
            tiles.value.push(newTile)   
            selectedTile.value = newTile
        }else{
            // If it is an existing tile
            selectedTile.value = tiles.value[index]
        }
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
                                
                                for(let [key, value] of Object.entries(assets)){
                                    if(value.find((a: string) => a.includes((tile)))){
                                        const img = document.createElement('img')
                                        img.src = `/assets/images/${key}/${tile}`
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

.tile{
    padding: 0;
}

.selected{
    border: 1px solid yellow;
}
</style>
