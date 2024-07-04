<template>
    <v-card class="info ml-auto mr-2 pa-2"
        style="width: 15vw" 
        subtitle="Tile info" 
        :text="`Width:${props.width}\nHeight:${props.height}\nX:${tileInfo.x}\nY:${tileInfo.y}\nEvents:${tileInfo.events.length}`">
        <v-list>
            <v-list-item>
                <v-checkbox label="Walkable"
                    v-model="tileDetail.walkable"
                    @update:model-value="checkWalkableValue"></v-checkbox>
                <v-text-field label="Depth" 
                    type="number"
                    v-model="levelData.depth[tileInfo.y][tileInfo.x][1]"
                    @update:model-value="checkDepthValue" ></v-text-field>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import type { PropType } from 'vue';

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
        multiSelectTiles: {
            type: Array as PropType<number[][]>,
            default: []
        }
    }
)

const { tileInfo, levelData } = storeToRefs(useEditorStore())
const { saveLevelData } = useEditorStore()
// const { toggleDialog } = useDialogStore()

const tileDetail = ref({
    walkable: Boolean(levelData.value.depth[tileInfo.value.y][tileInfo.value.x][0]),
    depth: levelData.value.depth[tileInfo.value.y][tileInfo.value.x][1]
})

const checkWalkableValue = (v: boolean | null) => {
    const { x, y } = tileInfo.value
    console.log(Number(v))

    if(props.multiSelectTiles.length){
        props.multiSelectTiles.forEach(tile => {
            levelData.value.depth[tile[0]][tile[1]][0] = Number(v)
        })
    }else{
        levelData.value.depth[y][x][0] = Number(v)
    }
    
    saveLevelData()
}

const checkDepthValue = (v: string) => {
    const { x, y } = tileInfo.value

    if(props.multiSelectTiles.length){
        props.multiSelectTiles.forEach(tile => {
            levelData.value.depth[tile[0]][tile[1]][1] = (Number(v) < 0)? 0 : Number(v)
        })
    }else{
        levelData.value.depth[y][x][1] = (Number(v) < 0)? 0 : Number(v)
    }

    saveLevelData()
}

watch(() => tileInfo.value, (newVal) => {
    if(newVal){
        const { x, y } = newVal
        tileDetail.value.walkable = Boolean(levelData.value.depth[y][x][0])
        tileDetail.value.depth = levelData.value.depth[y][x][1]
    }
}, { deep: true })
</script>
