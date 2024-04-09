<template>
    <v-app-bar id="bar" :elevation="5">
        <template v-slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>{{ levelData.id }}</v-app-bar-title>

        <template v-slot:append>
            <v-btn icon="mdi-navigation" :color="mode === 'nav'? 'primary': 'grey'" @click="mode = 'nav'"></v-btn>

            <v-btn icon="mdi-pencil" :color="mode === 'draw'? 'primary': 'grey'" @click="mode = 'draw'"></v-btn>

            <v-btn icon="mdi-eraser" :color="mode === 'erase'? 'primary': 'grey'" @click="mode = 'erase'"></v-btn>

            <v-btn icon="mdi-layers" :color="mode === 'layer'? 'primary': 'grey'" @click="mode = 'layer'"></v-btn>

            <v-btn icon="mdi-cog" :color="mode === 'config'? 'primary': 'grey'" @click="mode = 'config'"></v-btn>
        </template>
    </v-app-bar>  
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { levelData, mode } = storeToRefs(useEditorStore())
</script>
