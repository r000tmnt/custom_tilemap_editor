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

            <!-- <template v-slot:append>
                <v-btn icon="mdi-heart"></v-btn>

                <v-btn icon="mdi-magnify"></v-btn>

                <v-btn icon="mdi-dots-vertical"></v-btn>
            </template> -->
        </v-app-bar>  
        <v-row class="editor">
            <!-- tile assets -->
            <v-col cols="4">
                <v-item-group class="d-flex" selected-class="selected">
                    <v-item
                        v-for="img in assets.env"
                        class="tile"
                        :key="img" 
                        v-slot="{ isSelected, selectedClass, toggle }
                        ">
                            <v-card
                            :class="['d-flex align-center bg-grey', selectedClass]"
                            height="32"
                            width="32"
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
                    ></canvas>
                </v-container>
            </v-col>
        </v-row>            
    </section> 
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

const route = useRoute()
const { levelData, assets } = storeToRefs(useEditorStore())
const { initEditor } = useEditorStore()
const { tileSize } = storeToRefs(useMainStore())

// console.log(levelData.value)
// console.log(route.params)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()
const tiles = ref<HTMLImageElement[]>([])
const selectedTile = ref<HTMLImageElement|null>(null)

const canvasEvent = (e: any) => {
    console.log('canvas mousedown event:>>> ', e)
    // Get the clicked position
    const y = e.clientY - canvasPosition.value.top
    const x = e.clientX - canvasPosition.value.left

    // const row = Math.floor( y / 32)
    // const col = Math.floor( x / 32)

    if(selectedTile.value !== null){
        context.value.drawImage(selectedTile.value, x, y, tileSize.value, tileSize.value)
    }
}

onMounted(() => {
    console.log(route.params)
    if(Object.entries(route.params).length){
        initEditor(route.params.level_id).then(() => {
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
                                const index = map[i][j]
                                const img = document.createElement('img')
                                img.src = `/assets/images/env/${tile}`
                                tiles.value[index] = img
                                context.value.drawImage(img, tileSize.value * j, tileSize.value * i, tileSize.value, tileSize.value)
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
