<template>
    <section class="pa-2 bg-grey-darken-4">
        <v-item-group class="d-flex mt-2" selected-class="selected">
            <v-item
                v-for="(img, index) in assets.env"
                :key="img" 
                v-slot="{ isSelected, selectedClass, toggle }"
                @group:selected="(v: any) => selectTile(v, index)">
                    <v-card
                    :class="['d-flex align-center bg-grey', selectedClass]"
                    :height="tileSize"
                    :width="tileSize"
                    dark
                    :rounded="0"
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
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { levelData, assets, tiles, selectedTile } = storeToRefs(useEditorStore())
const { tileSize, base_url } = storeToRefs(useMainStore())

// Keep the selected tile
const selectTile = (v:any, index:number) => {
    console.log(v)
    if(v.value){
        const assetUrl = assets.value.env[index]

        const assetIndex = tiles.value.findIndex(a => a.src.includes(assetUrl))

        // If it is a new tile in the map
        if(assetIndex < 0){
            levelData.value.assets.push(assetUrl.split("/")[4])
            const newTile = document.createElement('img')
            newTile.src = `${base_url.value}${assetUrl.substring(1, assetUrl.length)}`
            tiles.value.push(newTile)   
            selectedTile.value = newTile
        }else{
            // If it is an existing tile
            selectedTile.value = tiles.value[assetIndex]
        }
    }
}
</script>

<style scoped>
.selected{
    border: 1px solid yellow;
}
</style>
