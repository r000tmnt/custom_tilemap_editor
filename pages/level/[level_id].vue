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

    <section v-else class="">
        <!-- paint brushes and other tools -->
        <editor-tool-bar @toggle-layout="changeLayuout" />

        <div class="editor d-flex">
            <!-- tile assets -->
            <editor-assets />

            <!-- tilemap editor -->
            <main id="right"
                class="pa-2 w-auto mx-auto overflow-x-auto overflow-y-auto"
                @scroll="updateCanvasPosition">
                <!-- map layer -->
                <canvas class="mx-auto"
                    ref="canvasRef"
                    @mousedown="canvasEvent"
                ></canvas>
            </main>

            <!-- tile info -->
            <editor-tile-info 
                :width="canvasRef?.width" 
                :height="canvasRef?.height"
                :multi-select-tiles="multiSelectTiles" />
        </div>  
    </section>         

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
    <event-delete-warning v-if="eventDeleteDialog" @event-delete-all="removeEventOnTile" />
    <event-list v-if="eventListDialog"
        @event-delete="removeEventOnTile" />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, watch, ref, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';

// Components
import editorToolBar from '~/components/editor/editorToolBar.vue'
import editorAssets from '~/components/editor/editorAssets.vue'
import editorTileInfo from '~/components/editor/editorTileInfo.vue'
import editorContextMenu from '~/components/editor/editorContextMenu.vue';
import eventCreateDialog from '~/components/event/eventCreateDialog.vue';
import eventEditDialog from '~/components/event/eventEditDialog.vue';
import eventDeleteWarning from '~/components/event/eventDeleteWarning.vue';
import eventList from '~/components/event/eventList.vue';

const route = useRoute()
const { levelData, steps, tiles, selectedTile, mode, tileInfo, layers } = storeToRefs(useEditorStore())
const { initEditor, storeSteps, saveLevelData, getEventsonTile } = useEditorStore()
const { tileSize } = storeToRefs(useMainStore())
const { contextMenu, createEventDialog, editEventDialog, eventDeleteDialog, eventListDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()
const pointedSpot = ref({ x: 0, y: 0, row: 0, col: 0 })
const holdShift = ref<boolean>(false)
const holdCtrl = ref<boolean>(false)
const multiSelectTiles = ref<number[][]>([])

const drawBorderOnTile = (col: number, row: number) => {
    context.value.strokeStyle = "yellow"
    context.value.strokeRect(col * tileSize.value, row * tileSize.value, tileSize.value, tileSize.value) 
}

const redrawContentOnTile = (originalX: number, originalY: number, x: number, y: number) => {
    const index = levelData.value.map[y][x]
    const asset = levelData.value.assets[index]

    context.value.fillStyle = "#000000"
    context.value.clearRect(originalX - 1, originalY - 1, tileSize.value + 2, tileSize.value + 2)
    context.value.fillRect(originalX, originalY, tileSize.value, tileSize.value)

    if(asset && asset.length){
        const tile = tiles.value.find(t => t.src.includes(asset))

        if(tile){
            context.value.drawImage(tile, originalX, originalY, tileSize.value, tileSize.value)
        }
    }

    const event = getEventsonTile(x, y)

    if(event.events.length){
        const eventIndex = levelData.value.event.findIndex(e => e.position.x === x && e.position.y === y)
        drawPoint({ x, y, type: 4 }, eventIndex)
    }

    const player = levelData.value.player.find(p => p.startingPoint.x === x && p.startingPoint.y === y)
    const enemy = levelData.value.enemy.find(p => p.startingPoint.x === x && p.startingPoint.y === y)

    if(player){
        drawPoint({ x, y, type: 2 })
        // drawCharacterIcon({ x: originalX, y: originalY, type: 2 })
    }

    if(enemy){
        drawPoint({ x, y, type: 3 })
        // drawCharacterIcon({ x: originalX, y: originalY, type: 3 })
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

    // Change tile info desc
    tileInfo.value.x = col
    tileInfo.value.y = row
    const { events, indexes } = getEventsonTile(col, row)
    tileInfo.value.events = events
    tileInfo.value.indexes = indexes

    switch(mouseButton){
        case 0:
            // Left button
            if(contextMenu.value){
                toggleDialog("context-menu")
            }

            if(!holdShift.value && !holdCtrl.value){
                // Remove border
                multiSelectTiles.value.forEach(tile => {
                    redrawContentOnTile(tile[1] * tileSize.value, tile[0] * tileSize.value, tile[1], tile[0])
                })
                // Clear the array
                multiSelectTiles.value.splice(0)
            }

            switch(mode.value){
                case "nav":
                    if(holdCtrl.value){
                        // [ y, x ]
                        multiSelectTiles.value.push([row, col])
                    }

                    if(holdShift.value){
                        console.log("Holding shift")
                        console.log(multiSelectTiles.value)
                        if(multiSelectTiles.value.length){
                            console.log("end :>>>", `${row}, ${col}`)
                            // Get end position
                            // Fill the rest
                            const latest = multiSelectTiles.value.length - 1
                            // If the destination is at the upper row 
                            if(row < multiSelectTiles.value[latest][0]){
                                console.log("The destination is at the upper row")
                                // Select tiles
                                // first
                                for(let i=multiSelectTiles.value[latest][1]; i >= 0; i--){
                                    multiSelectTiles.value.push([multiSelectTiles.value[latest][0], i])
                                    drawBorderOnTile(i, multiSelectTiles.value[latest][0])
                                }

                                // middle
                                for(let i=multiSelectTiles.value[latest][0] - 1; i > row; i--){
                                    for(let j=(levelData.value.map[0].length - 1); j >=0; j--){
                                        multiSelectTiles.value.push([i, j])
                                        drawBorderOnTile(j, i)
                                    }
                                }

                                // last
                                for(let i=col; i < (levelData.value.map[0].length - 1); i--){
                                    multiSelectTiles.value.push([row, i])
                                    drawBorderOnTile(i, row)
                                }
                            }

                            // If the destination is at the deeper row
                            if(row > multiSelectTiles.value[latest][0]){
                                console.log("The destination is at the deeper row")
                                // Select tiles
                                // first
                                for(let i=multiSelectTiles.value[latest][1]; i <= (levelData.value.map[0].length - 1); i++){
                                    multiSelectTiles.value.push([multiSelectTiles.value[latest][0], i])
                                    drawBorderOnTile(i, multiSelectTiles.value[latest][0])
                                }

                                // middle
                                for(let i=multiSelectTiles.value[latest][0] + 1; i < row; i++){
                                    for(let j=0; j < levelData.value.map[0].length; j++){
                                        multiSelectTiles.value.push([i, j])
                                        drawBorderOnTile(j, i)
                                    }
                                }

                                // last
                                for(let i=0; i <= col; i++){
                                    multiSelectTiles.value.push([row, i])
                                    drawBorderOnTile(i, row)
                                }
                            }else{
                                // If the destination is on the same x axis
                                console.log("The destination is on the same x axis")
                                if(col < multiSelectTiles.value[latest][1]){
                                    console.log("To left")
                                    for(let i=multiSelectTiles.value[latest][1]-1; i >= col; i--){
                                        console.log(i)
                                        multiSelectTiles.value.push([row, i])
                                        drawBorderOnTile(i, row)
                                    }
                                }else{
                                    console.log("To right")
                                    for(let i=col; i <= multiSelectTiles.value[latest][1]; i++){
                                        multiSelectTiles.value.push([row, i])
                                        drawBorderOnTile(i, row)
                                    }
                                }
                            }
                        }else{
                            // Get starting position
                            console.log("start :>>>", `${row}, ${col}`)
                            multiSelectTiles.value.push([row, col])
                            console.log(multiSelectTiles.value)
                        }
                    }
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
            // Check if y is deeper then 60% of the window height
            const windowHeight = window.innerHeight
            const percentage = windowHeight / 100

            console.log("window height :>>>", windowHeight)
            console.log("percentage :>>>", percentage)

            if(e.clientY >= (percentage * 60)){
                pointedSpot.value.y = e.clientY - (percentage * 25)
            }else{
                pointedSpot.value.y = e.clientY
            }

            pointedSpot.value.x = e.clientX
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
        if(!holdShift.value && !holdCtrl.value){
            if(multiSelectTiles.value.length){
                redrawContentOnTile(multiSelectTiles.value[0][1] * tileSize.value, multiSelectTiles.value[0][0] * tileSize.value, multiSelectTiles.value[0][1], multiSelectTiles.value[0][0])
                multiSelectTiles.value.splice(0)
            }

            multiSelectTiles.value.push([row, col])
            drawBorderOnTile(multiSelectTiles.value[0][1], multiSelectTiles.value[0][0])            
        }else{
            drawBorderOnTile(col, row)
        }

    }
}

const canvasKeyPressEvent = (e: any) => {
    if(e.shiftKey){
        holdShift.value = true
    }

    if(e.ctrlKey){
        holdCtrl.value = true
    }

    // If the combination is ctrl + z
    if(e.keyCode === 90 && e.ctrlKey){
        // If there are steps for back tracking
        if(steps.value.length){
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
                    // context.value.drawImage(asset, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
                    drawPoint({ x, y, type: 2 })
                }

                for(let i=0, enemy = levelData.value.enemy; i < enemy.length; i++){
                    const { job } = enemy[i]
                    const { x, y } = enemy[i].startingPoint
                    const asset = tiles.value.find(t => t.src.includes(job? job : 'zombie'))
                    // context.value.drawImage(asset, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
                    drawPoint({ x, y, type: 3 })
                }
            }
            break;
            case 'event':{
                for(let i=0, event = levelData.value.event; i < event.length; i++){
                    if(Object.entries(event[i].position).length){
                        const { x, y } = event[i].position
                        drawPoint({ x, y, type: 4 }, i)
                    }
                }
            }
            break;
        }
    }
}


const drawPoint = (v: any, index?: number) => {    
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
    drawCharacterIcon(v, index)
}

const drawCharacterIcon = (v:any, index?: number) => {
    const { x, y, type } = v

    let icon = ""

    switch(type){
        case 2:
            icon = "class/class_fighter_1" 
        break;
        case 3:
            icon = "mob/mob_zombie_1"
        break;
        case 4:
            if(index){
                if(levelData.value.event[index].item.length)
                    icon = "env/item"
            }else{
                icon = ""
            }
        break
    }

    console.log(type)
    console.log(icon)

    const tile = tiles.value.find(t => t.src.includes(icon))

    console.log(tile)

    if(tile && icon.length){
        context.value.drawImage(tile, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
    }else{
        const img = document.createElement('img')
        img.src = `/assets/images/${icon}.png`
        // console.log(img)
        
        img.onload = () => {
            context.value.drawImage(img, x * tileSize.value, y * tileSize.value, tileSize.value, tileSize.value)
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
            }
        }

        for(let i=0, event = levelData.value.event; i < event.length; i++){
            drawPoint({ type: 4, ...event[i].position }, i)
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

const openContextMenu = () => { 
    if(contextMenu.value)  toggleDialog("context-menu")
 }

 const releaseKey = (e: KeyboardEvent) => {
    console.log('keyup event')
    console.log(e)
    if(e.key === "Shift"){
        holdShift.value = false
    }

    if(e.key === "Control"){
        holdCtrl.value = false
    }
}

const updateCanvasPosition = () => {
    canvasPosition.value = canvasRef.value?.getBoundingClientRect()
}

watch(() => canvasRef.value, (newVal) => {
    console.log("newVal :>>>", newVal)
    if(newVal !== null){
        console.log(canvasRef.value)
        drawCanvas()
    }

    // Hide the default browser context menu when right click on the canvas
    canvasRef.value?.addEventListener("contextmenu", (e: any) => { e.preventDefault() })
    document.addEventListener("click", openContextMenu)
})

onBeforeMount(() => {
    console.log(route.params)
    if(route?.params?.level_id){
        initEditor(String(route.params.level_id))
    }
})

onMounted(() => {
    document.addEventListener("keydown", canvasKeyPressEvent)
    document.addEventListener("keyup", releaseKey)
})

// Reset canvas when leaving the page
onBeforeUnmount(() => {
    canvasRef.value = null
    levelData.value.map.splice(0)
    document.removeEventListener("click", openContextMenu)
    document.removeEventListener("keydown", canvasKeyPressEvent)
    document.removeEventListener("keyup", releaseKey)
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
    /* height: max-content; */
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
</style>
