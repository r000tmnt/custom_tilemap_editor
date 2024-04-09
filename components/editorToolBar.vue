<template>
    <v-app-bar id="bar" :elevation="5" style="position:relative">
        <!-- <template v-slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template> -->

        <v-app-bar-title>{{ levelData.id }}</v-app-bar-title>

        <div>
            <v-toolbar style="position: absolute; width:fit-content; margin: auto; top: 0;left: 50%; transform: translateX(-50%)">
                <v-btn icon="mdi-navigation" :color="mode === 'nav'? 'primary': 'grey'" @click="mode = 'nav'"></v-btn>

                <v-btn icon="mdi-pencil" :color="mode === 'draw'? 'primary': 'grey'" @click="mode = 'draw'"></v-btn>

                <v-btn icon="mdi-eraser" :color="mode === 'erase'? 'primary': 'grey'" @click="mode = 'erase'"></v-btn>

                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-layers" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                        v-for="(item, index) in layers"
                        :key="index"
                        :value="index"
                        >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                 </v-menu>
            </v-toolbar>
        </div>

        <template v-slot:append>
            <v-btn icon="mdi-export"></v-btn>
            <v-btn icon="mdi-cog"></v-btn>
        </template>
    </v-app-bar>  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'

const layers = ref<string[]>(['map', 'character', 'event'])

const { levelData, mode } = storeToRefs(useEditorStore())
</script>
