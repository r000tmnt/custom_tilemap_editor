<template>
    <v-container v-if="levelData.map.length === 0">
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
            <editor-tool-bar @toggle-layout="changeLayuout" />

            <v-row class="editor">
                    <!-- tile assets -->
                    <v-col id="left" 
                        :cols="column[0]"
                        class="col pa-2">
                        <editor-assets />
                        <div class="draggable border"
                            @mouseover="highlightColumn"
                            @mouseleave="leaveColumn">
                            <div class="control flex hide">
                                <div class="customChip"
                                    @click.stop="narrowColumn(0)"
                                    @mouseover.stop="highlightControl"
                                    @mouseleave.stop="leaveControl">
                                    &#8249;
                                </div>
                                <div class="customChip"
                                    @click.stop="expandColumn(0)"
                                    @mouseover.stop="highlightControl"
                                    @mouseleave.stop="leaveControl">
                                    &#8250;
                                </div>
                            </div>
                        </div>
                    </v-col>

                    <!-- tilemap editor -->
                    <v-col id="right" 
                        :cols="column[1]"
                        class="col pa-2">
                        <!-- map layer -->
                        <canvas 
                            ref="canvasRef"
                            @mousedown="canvasEvent"
                        ></canvas>
                        <div class="draggable border"
                            @mouseover="highlightColumn"
                            @mouseleave="leaveColumn">
                            <div class="control flex hide">
                                <div class="customChip"
                                    @click.stop="narrowColumn(1)"
                                    @mouseover.stop="highlightControl"
                                    @mouseleave.stop="leaveControl">
                                    &#8249;
                                </div>
                                <div class="customChip"
                                    @click.stop="expandColumn(1)"
                                    @mouseover.stop="highlightControl"
                                    @mouseleave.stop="leaveControl">
                                    &#8250;
                                </div>
                            </div>                   
                        </div>
                        
                    </v-col>

                    <!-- tile info -->
                    <v-col :cols="column[2]" 
                        class="col pa-2">
                        <editor-tile-info 
                            :width="canvasRef?.width" 
                            :height="canvasRef?.height"/>
                        <!-- <div class="draggable border" 
                        ref="draggableRefs"
                        @mousemove="highlightColumn(2)"></div> -->
                    </v-col>
                </v-row>  
                
                <event-create-dialog v-if="createEventDialog" />
                <event-edit-dialog v-if="editEventDialog" />
                <editor-context-menu 
                    :x="pointedSpot.x" 
                    :y="pointedSpot.y"
                    :row="pointedSpot.row"
                    :col="pointedSpot.col"
                    @set-starting-point="drawPoint"
                    @remove-starting-point="clearPoint"
                    @clear-all="clearMap"
                    @expand-map="drawCanvas"/>
                <event-delete-warning @event-delete-all="removeEventOnTile" />
        </section>         

</template>

<script setup lang="ts">
import { onBeforeMount, watch, ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import type { eventPositionModel } from '~/types/level'

// Components
import editorToolBar from '~/components/editor/editorToolBar.vue'
import editorAssets from '~/components/editor/editorAssets.vue'
import editorTileInfo from '~/components/editor/editorTileInfo.vue'
import editorContextMenu from '~/components/editor/editorContextMenu.vue';
import eventCreateDialog from '~/components/event/eventCreateDialog.vue';
import eventEditDialog from '~/components/event/eventEditDialog.vue';
import eventDeleteWarning from '~/components/event/eventDeleteWarning.vue';

const route = useRoute()
const { levelData, steps, tiles, selectedTile, mode, tileInfo, layers, editorTheme } = storeToRefs(useEditorStore())
const { initEditor, storeSteps, saveLevelData, getEventsonTile } = useEditorStore()
const { tileSize } = storeToRefs(useMainStore())
const { contextMenu, createEventDialog, editEventDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()
const pointedSpot = ref({ x: 0, y: 0, row: 0, col: 0 })
const column = ref<number[]>([3, 6, 3])
const mouseTraker = ref<eventPositionModel[]>([])

const redrawContentOnTile = (originalX: number, originalY: number, x: number, y: number) => {
    const index = levelData.value.map[y][x]
    const asset = levelData.value.assets[index]

    context.value.fillStyle = "#000000"
    context.value.clearRect(originalX - 1, originalY - 1, tileSize.value + 2, tileSize.value + 2)
    context.value.fillRect(originalX, originalY, tileSize.value, tileSize.value)

    if(asset.length){
        const tile = tiles.value.find(t => t.src.includes(asset))

        if(tile){
            context.value.drawImage(tile, originalX, originalY, tileSize.value, tileSize.value)
        }
    }

    const event = getEventsonTile(x, y)

    if(event.length){
        drawPoint({ x, y, type: 4 })
    }

    const player = levelData.value.player.find(p => p.startingPoint.x === y && p.startingPoint.y === x)
    const enemy = levelData.value.enemy.find(p => p.startingPoint.x === y && p.startingPoint.y === x)

    if(player){
        drawPoint({ x, y, type: 2 })
        drawCharacterIcon({ x: originalX, y: originalY, type: 2 })
    }

    if(enemy){
        drawPoint({ x, y, type: 3 })
        drawCharacterIcon({ x: originalX, y: originalY, type: 3 })
    }

    context.value.strokeStyle = "rgb(211, 211, 211)"
    context.value.strokeRect(originalX, originalY, tileSize.value, tileSize.value)
}

const removeEventOnTile = () => {
    const { x, y } = tileInfo.value
    redrawContentOnTile(x * tileSize.value, y * tileSize.value, x, y)
}

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
            if(contextMenu.value){
                toggleDialog("context-menu")
            }

            switch(mode.value){
                case "nav":
                    // Change tile info desc
                    tileInfo.value.x = col
                    tileInfo.value.y = row
                    tileInfo.value.events = getEventsonTile(col, row)
                break;
                case "draw":
                    // Draw a tile on the canvas if selected
                    if(selectedTile.value !== null){
                        // Cleat the old tile first
                        context.value.fillStyle = '#000000'
                        context.value.fillRect(col * tileSize.value, row * tileSize.value, tileSize.value, tileSize.value)
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
                    context.value.fillStyle = '#000000'
                    context.value.fillRect(col * tileSize.value, row * tileSize.value, tileSize.value, tileSize.value)
                    // Store the map before update
                    storeSteps(levelData.value.map)
                    // Update the map
                    levelData.value.map[row][col] = 0
                    // Save the changes
                    saveLevelData()
                break;
            }
        break;
        case 2:
            // Right button
            // Open a context menu
            if(!contextMenu.value){
                toggleDialog("context-menu")
            }
            pointedSpot.value.x = e.clientX
            pointedSpot.value.y = e.clientY
            pointedSpot.value.row = row
            pointedSpot.value.col = col
        break;
        default:
            // Other
        break;
    }

    if(layers.value[1].active){
        // Draw border on pointed tile
        // Redraw border on the tile clicked before
        if(mouseTraker.value.length){
            const oldRow = Math.floor(mouseTraker.value[0].y / tileSize.value)
            const oldCol = Math.floor(mouseTraker.value[0].x / tileSize.value)
            redrawContentOnTile(mouseTraker.value[0].x, mouseTraker.value[0].y, oldCol, oldRow)
            mouseTraker.value.splice(0)
        }

        mouseTraker.value.push({ x: col * tileSize.value, y: row * tileSize.value })
        context.value.strokeStyle = "yellow"
        context.value.strokeRect(mouseTraker.value[0].x, mouseTraker.value[0].y, tileSize.value, tileSize.value)
    }
}

const canvasKeyPressEvent = (e: any) => {
    // If there are steps for back tracking
    if(steps.value.length){
        // If the combination is ctrl + z
        if(e.keyCode === 90 && e.ctrlKey){
            // Take one step back
            levelData.value.map = steps.value[steps.value.length - 1]
            // Remove the step
            steps.value.splice(steps.value.length - 1, 1)
        }        
    }
}

// Check the other layers
const checkLayers = (layers: any[]) => {
    for(let i=0; i < layers.length; i++){
        const { name, active } = layers[i]

        if(active){
            switch(name){
                case "map":
                    changeLayuout({ name: "map", active: true })
                break;
                case "grid":
                    drawGrid()
                break;
                case "player":
                    changeLayuout({ name: "player", active: true })
                break;
                case "event":
                    changeLayuout({ name: "event", active: true })
                break;
            }
        }
    }
}

const changeLayuout = (v: any) => {
    if(!v.active){
        // Hide the layer
        switch(v.name){
            case 'map': case 'grid': 
                context.value.clearRect(0, 0, canvasRef?.value?.width, canvasRef?.value?.height)

                const tempLayer = layers.value.filter(l => l.name !== v.name)
                checkLayers(tempLayer)
            break
            case 'player':{
                for(let i=0, player = levelData.value.player; i < player.length; i++){
                    const { x, y } = player[i].startingPoint
                    clearPoint({ x, y })
                }

                for(let i=0, enemy = levelData.value.enemy; i < enemy.length; i++){
                    const { x, y } = enemy[i].startingPoint
                    clearPoint({ x, y })
                }
            }
            break;
            case 'event':{
                for(let i=0, event = levelData.value.event; i < event.length; i++){
                    if(Object.entries(event[i].position).length){
                        const { x, y } = event[i].position
                        clearPoint({ x, y })
                    }
                }
            }
            break;
        }
    }else{
        // Display the layer
        switch(v.name){
            case 'map':{
                context.value.fillStyle = '#000000'
                context.value.fillRect(0, 0, canvasRef?.value?.width, canvasRef?.value?.height)
                for(let i=0, map = levelData.value.map; i < map.length; i++){
                    for(let j=0; j < map[i].length; j++){
                        const x = j * tileSize.value
                        const y = i * tileSize.value
                        const tile = levelData.value.assets[map[i][j]]

                        if(tile.length){
                            console.log("tile :>>", tile)

                            const asset = tiles.value.find(t => t.src.includes(tile))

                            if(asset !== undefined){
                                context.value.drawImage(asset, x, y, tileSize.value, tileSize.value)
                            }else{
                                const img = document.createElement('img')
                                img.src = `/assets/images/env/${tile}`
                                // console.log(img)
                                tiles.value.push(img)
                                img.onload = () => {
                                    context.value.drawImage(img, x, y, tileSize.value, tileSize.value)
                                }
                            }
                        }
                    }
                }

                const tempLayer = layers.value.filter(l => l.name !== v.name)
                checkLayers(tempLayer)
            }
            break;
            case 'grid':
                drawCanvas()
            break;
            case 'player':{
                for(let i=0, player = levelData.value.player; i < player.length; i++){
                    const { x, y } = player[i].startingPoint
                    const asset = tiles.value.find(t => t.src.includes("fighter"))
                    context.value.drawImage(asset, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
                    drawPoint({ x, y, type: 2 })
                }

                for(let i=0, enemy = levelData.value.enemy; i < enemy.length; i++){
                    const { job } = enemy[i]
                    const { x, y } = enemy[i].startingPoint
                    const asset = tiles.value.find(t => t.src.includes(job? job : 'zombie'))
                    context.value.drawImage(asset, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
                    drawPoint({ x, y, type: 3 })
                }
            }
            break;
            case 'event':{
                for(let i=0, event = levelData.value.event; i < event.length; i++){
                    if(Object.entries(event[i].position).length){
                        const { x, y } = event[i].position
                        drawPoint({ x, y, type: 4 })
                    }
                }
            }
            break;
        }
    }
}

const highlightColumn = (e: any) => {
    console.log(e)
    if(e.target.children[0]){
        // e.target.classList.add('highlight')
        // e.target.style.cursor = "col-resize"
        e.target.children[0].classList.remove("hide")
    }
}

const highlightControl = (e: any) => {
    if(e.target){
        e.target.style.background = "skyBlue"
        e.target.style.color = "white"
    }
}

const leaveColumn = (e: any) => {
    // console.log(e)
    if(e.target.children[0]){
        // e.target.classList.remove('highlight')
        // e.target.style.cursor = "default"
        e.target.children[0].classList.add("hide")
    }
}

const leaveControl = (e: any) => {
    if(e.target){
        e.target.style.background = "lightgray"
        e.target.style.color = "black"
    }
}

const narrowColumn = (index: number) => {
    if(column.value[index] > 1){
        column.value[index] -= 1
        column.value[index + 1] += 1
    }
}

const expandColumn = (index: number) => {
    if(column.value[index] < 10){
        column.value[index] += 1
        column.value[index + 1] -= 1
    }
}

const drawPoint = (v: any) => {    
    const { type, x, y } = v

    context.value.save()
    // context.value.globalCompositeOperation = 'source-over'
    context.value.globalAlpha = 0.5

    switch(type){
        case 2:
            context.value.fillStyle = "#add8e6"
        break;
        case 3:
            context.value.fillStyle = "#ff2f9a"
        break;
        case 4:
            context.value.fillStyle = "yellow"
        break;
    }

    context.value.fillRect(x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
    context.value.restore()
}

const drawCharacterIcon = (v:any) => {
    const { x, y, type } = v

    const icon = (type === 2)? "class/class_fighter_1" : "mob/mob_zombie_1"

    const tile = tiles.value.find(t => t.src.includes(icon))

    if(tile){
        context.value.drawImage(tile, x, y, tileSize.value, tileSize.value)
    }else{
        const img = document.createElement('img')
        img.src = `/assets/images/${icon}.png`
        // console.log(img)
        
        img.onload = () => {
            context.value.drawImage(img, x, y, tileSize.value, tileSize.value)
        }

        tiles.value.push(img)
    }
}

const clearPoint = (v:any) => {
    const { x, y } = v

    context.value.fillStyle = "#000000"

    const xAxist = x * tileSize.value
    const yAxist = y * tileSize.value
    const index = levelData.value.map[y][x]
    const asset = levelData.value.assets[index]

    if(asset.length){
        const tile = tiles.value.find(t => t.src.includes(asset))

        if(tile){
            context.value.fillRect(xAxist, yAxist, tileSize.value, tileSize.value)
            context.value.drawImage(tile, xAxist, yAxist, tileSize.value, tileSize.value)
        }else{
            context.value.fillRect(xAxist, yAxist, tileSize.value, tileSize.value)
        }        
    }else{
        context.value.fillRect(xAxist, yAxist, tileSize.value, tileSize.value)
    }   
    
    if(layers.value[1].active){
        context.value.strokeStyle = "rgb(211, 211, 211)"
        context.value.strokeRect(xAxist, yAxist, tileSize.value, tileSize.value)
    }
}

const clearMap = () => {
    context.value.fillStyle = '#000000'
    context.value.fillRect(0, 0, canvasRef?.value?.width, canvasRef?.value?.height)
    saveLevelData()
}

const drawGrid = () => {
    context.value.strokeStyle = "rgb(211, 211, 211)"

    for(let i=0, map = levelData.value.map; i < map.length; i++){
        for(let j=0; j < map[i].length; j++){
            context.value.strokeRect(j * tileSize.value, i * tileSize.value, tileSize.value, tileSize.value)
        }
    }
}

const drawCanvas = () => {
    if(canvasRef.value !== null){
        const map = levelData.value.map
        canvasRef.value.width = map[0].length * tileSize.value
        canvasRef.value.height = map.length * tileSize.value
        context.value = canvasRef.value.getContext("2d")
        canvasPosition.value = canvasRef.value.getBoundingClientRect()
        context.value.fillStyle = '#000000'
        context.value.fillRect(0, 0, canvasRef?.value?.width, canvasRef?.value?.height)

        for(let i=0; i < map.length; i++){
            for(let j=0; j < map[i].length; j++){
                const tile = levelData.value.assets[map[i][j]]
                const x = j * tileSize.value
                const y = i * tileSize.value
                if(tile.length){
                    console.log("tile :>>", tile)
                    const img = document.createElement('img')
                    img.src = `/assets/images/env/${tile}`
                    // console.log(img)
                    if(!tiles.value.find(t => t.src === img.src)){
                        tiles.value.push(img)
                    }
                    img.onload = () => {
                        context.value.drawImage(img, x, y, tileSize.value, tileSize.value)
                    }
                }

                if(levelData.value.player.find(p => p.startingPoint.x === j && p.startingPoint.y === i)){
                    drawCharacterIcon({ x, y, type: 2 })
                }

                if(levelData.value.enemy.find(e => e.startingPoint.x === j && e.startingPoint.y === i)){
                    drawCharacterIcon({ x, y, type: 3 })
                }
            }
        }

        for(let i=0, event = levelData.value.event; i < event.length; i++){
            const { x, y } = event[i].position
            drawPoint({ type: 4, x, y })
        }

        for(let i=0, player = levelData.value.player; i < player.length; i++){
            drawPoint({ type: 2, ...player[i].startingPoint })
        }

        for(let i=0, enemy = levelData.value.enemy; i < enemy.length; i++){
            drawPoint({ type: 3, ...enemy[i].startingPoint })
        }  
        
        drawGrid()
    }
}

watch(() => canvasRef.value, (newVal) => {
    console.log("newVal :>>>", newVal)
    if(newVal){
        console.log(canvasRef.value)
        drawCanvas()
    }

    // Hide the default browser context menu when right click on the canvas
    canvasRef.value?.addEventListener("contextmenu", (e: any) => { e.preventDefault() })
    document.addEventListener("click", () => { if(contextMenu.value)  toggleDialog("context-menu") })
    document.addEventListener("keydown", canvasKeyPressEvent)
})

onBeforeMount(() => {
    console.log(route.params)
    if(route?.params?.level_id){
        initEditor(String(route.params.level_id))
    }
})
</script>

<style scoped>
section{
    height: 100vh;
}

.editor{
    margin-top: 10px;
    margin-left: 6px;
    width: 100vw;
    /* height: 100%; */
}

/* #canvasContainer{
    position: relative;
} */

.col{
    position: relative;
    transition: all .3s ease-in-out;
}

.draggable{
    position: absolute;
    border: 3px solid grey;
    width: 3px;
    height: 100%;
    top: 0;
    right: 0;
    /* overflow: visible; */
}

/* .highlight{
    border: none;
    background-color: blue;
} */

canvas{
    border: 1px solid gray;
    background: rgba(128, 128, 128, 0.5);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.info{
    white-space: pre-line;
}

.flex{
    display: flex;
}

.hide{
    display: none;
}

.control{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
}

.customChip{
    background: lightgray;
    color: black;
    border-radius: 20%;
    width: 30px;
    height: 30px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 30px;
}
</style>..../../components/editor/editorTileInfo.vue../../components/editor/editorToolBar.vue/../components/editor/editorAssets.vue
