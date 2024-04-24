<template>
    <v-dialog
      v-model="mapExpander"
      width="auto"
      persistent
    >
        <v-card
            class="pa-4"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Expand the map of the level"
        >
            <v-form ref="formRef"
                class="my-6">
                <v-text-field label="Width" 
                    type="number" 
                    v-model="newWidth"
                    :rules="numberRules"></v-text-field>
                <v-text-field label="Height" 
                    type="number" 
                    v-model="newHeight"
                    :rules="numberRules"></v-text-field>

                <p>Direction</p>
                <div class="d-flex flex-column">
                    <v-btn-toggle
                    v-model="direction"
                    variant="outlined"
                    divided
                    >
                        <v-btn icon="mdi-arrow-left"></v-btn>
                        <v-btn icon="mdi-arrow-up"></v-btn>
                        <v-btn icon="mdi-arrow-right"></v-btn>
                        <v-btn icon="mdi-arrow-down"></v-btn>
                    </v-btn-toggle>
                </div>

            </v-form>

            <v-card-actions class="ml-auto">
                <v-btn color="gray" class="mr-2" @click="toggleDialog('map-expander')">CANCEL</v-btn>
                <v-btn color="primary" @click="expandMap">CONFIRM</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

const { mapExpander } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { levelData } = storeToRefs(useEditorStore())
const { saveLevelData, storeSteps } = useEditorStore()
const { numberRules } = useRuleStore()

const newWidth = ref<number>(levelData.value.map[0].length)
const newHeight = ref<number>(levelData.value.map.length)
const direction = ref<number | null>(null)
const formRef = ref()

const emit = defineEmits(["expandMap"])

const expandMap = () => {
    formRef?.value.validate().then((result: any) => {
        if(result.valid){
            console.log(direction.value)
            // TODO - Expand the map towards the selected direction
            const diffWidth = newWidth.value - levelData.value.map[0].length
            const diffHeigth = newHeight.value - levelData.value.map.length
            
            switch(direction.value){
                case 0:
                    // LEFT
                    if(diffWidth > 0){
                        // Expand the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < diffWidth; j++){
                                map[i].unshift(0)
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                map[i].shift()
                            }
                        }
                    }

                    if(diffHeigth > 0){
                        // Expand the map
                        const newRow = Array.from({length: newWidth.value}, (_, i) => i - i)
                        for(let j=0, map = levelData.value.map; j < diffWidth; j++){
                            if(((j + 1) % 2) === 0){
                                map.push(newRow)
                            }else{
                                map.unshift(newRow)
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map.shift()
                                }else{
                                    map.pop()
                                }
                            }
                        }
                    }
                break;
                case 1:
                    // TOP
                    if(diffWidth > 0){
                        // Expand the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < diffWidth; j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].unshift(0)
                                }else{
                                    map[i].push(0)
                                }
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].shift()
                                }else{
                                    map[i].pop()
                                }
                            }
                        }
                    }

                    if(diffHeigth > 0){
                        // Expand the map
                        for(let j=0, map = levelData.value.map; j < diffWidth; j++){
                            map.unshift(Array.from({length: newWidth.value}, (_, i) => i))
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                map[i].shift()
                            }
                        }
                    }
                break;
                case 2:
                    // RIGHT
                    if(diffWidth > 0){
                        // Expand the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < diffWidth; j++){
                                map[i].push(0)
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                map[i].pop()
                            }
                        }
                    }

                    if(diffHeigth > 0){
                        // Expand the map
                        const newRow = Array.from({length: newWidth.value}, (_, i) => i - i)
                        for(let j=0, map = levelData.value.map; j < diffWidth; j++){
                            if(((j + 1) % 2) === 0){
                                map.push(newRow)
                            }else{
                                map.unshift(newRow)
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map.shift()
                                }else{
                                    map.pop()
                                }
                            }
                        }
                    }
                break;
                case 3:
                    // DOWN
                    if(diffWidth > 0){
                        // Expand the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < diffWidth; j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].unshift(0)
                                }else{
                                    map[i].push(0)
                                }
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].shift()
                                }else{
                                    map[i].pop()
                                }
                            }
                        }
                    }

                    if(diffHeigth > 0){
                        // Expand the map
                        for(let j=0, map = levelData.value.map; j < diffWidth; j++){
                            map.push(Array.from({length: newWidth.value}, (_, i) => i))
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                map[i].pop()
                            }
                        }
                    }
                break;
                default:
                    // CENTER
                    if(diffWidth > 0){
                        // Expand the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < diffWidth; j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].unshift(0)
                                }else{
                                    map[i].push(0)
                                }
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map[i].shift()
                                }else{
                                    map[i].pop()
                                }
                            }
                        }
                    }

                    if(diffHeigth > 0){
                        // Expand the map
                        const newRow = Array.from({length: newWidth.value}, (_, i) => i - i)
                        for(let j=0, map = levelData.value.map; j < diffWidth; j++){
                            if(((j + 1) % 2) === 0){
                                map.push(newRow)
                            }else{
                                map.unshift(newRow)
                            }
                        }
                    }else{
                        // Shrink the map
                        for(let i=0, map = levelData.value.map; i < map.length; i++){
                            for(let j=0; j < Math.abs(diffWidth); j++){
                                if(((j + 1) % 2) === 0){
                                    map.shift()
                                }else{
                                    map.pop()
                                }
                            }
                        }
                    }
                break;
            }

            storeSteps(levelData.value.map)
            emit("expandMap")
            saveLevelData()
            toggleDialog("map-expander")
            toggleDialog("context-menu")
        }
    })
}
</script>
