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
                <v-item-group class="d-flex" selected-class="bg-primary">
                    <v-item
                        v-for="img in assets.env"
                        class="tile"
                        :key="n" 
                        v-slot="{ isSelected, selectedClass, toggle }
                        ">
                            <v-card
                            :class="['d-flex align-center', selectedClass]"
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
                                <img :src="img" alt="tile" />
                            </v-card>
                    </v-item>
                </v-item-group>
            </v-col>

            <!-- tilemap editor -->
            <v-col cols="8">
                <v-container id="canvasContainer">
                    <canvas ref="canvasRef"></canvas>
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

// console.log(levelData.value)
// console.log(route.params)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const context = ref()
const canvasPosition = ref()

onMounted(() => {
    if(route.params?.level_id){
        initEditor(route.params?.level_id).then(() => {
            if(levelData.value !== undefined){
                console.log(canvasRef.value)
                if(canvasRef.value !== null){
                    canvasRef.value.width = levelData.value.map[0].length * 32
                    canvasRef.value.height = levelData.value.map.length * 32
                    context.value = canvasRef.value.getContext("2d")
                    canvasPosition.value = canvasRef.value.getBoundingClientRect()
                    
                    context.value.fillStyle = '#000000'
                    context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
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
</style>
