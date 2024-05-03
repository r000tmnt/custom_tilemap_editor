<template>
    <v-app-bar id="bar" :elevation="5" style="position:relative">
        <template v-slot:prepend>
            <Nuxt-link to="/">
                <v-icon icon="mdi-arrow-left"></v-icon>
            </Nuxt-link>
        </template>

        <v-app-bar-title>{{ levelData.id }}</v-app-bar-title>

        <div>
            <v-toolbar style="position: absolute; width:fit-content; margin: auto; top: 0;left: 50%; transform: translateX(-50%)">
                <v-btn icon="mdi-navigation" :color="mode === 'nav'? 'primary': 'grey'" @click="mode = 'nav'"></v-btn>

                <v-btn icon="mdi-pencil" :color="mode === 'draw'? 'primary': 'grey'" @click="mode = 'draw'"></v-btn>

                <v-btn icon="mdi-eraser" :color="mode === 'erase'? 'primary': 'grey'" @click="mode = 'erase'"></v-btn>

                <v-menu :close-on-content-click="false" width="200">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-layers" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                        v-for="(item, index) in layers"
                        :key="index"
                        :value="index"
                        >
                            <v-list-item-title class="d-flex justify-space-between">
                                {{ item.name }}
                                <v-icon :icon="(item.active)? 'mdi-eye' : 'mdi-eye-closed'" @click="toggleLayout(index)"></v-icon>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                 </v-menu>
            </v-toolbar>
        </div>

        <template v-slot:append>
            <v-btn icon="mdi-export"></v-btn>
            <!-- <v-btn icon="mdi-cog"></v-btn> -->
            <v-menu :close-on-content-click="false" 
                width="200"
                @update:model-value="setConfigState">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-cog" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                        v-for="(item, index) in configOptions"
                        :key="index"
                        :value="index"
                        @click="toggleOptions(item)"
                        >
                            <v-list-item-title>
                                <template v-if="item.includes('theme')">
                                    <v-switch :label="editorTheme"
                                        @update:model-value="switchTheme"></v-switch>
                                </template>

                                <template v-else>
                                    {{ item }}
                                </template>
                                <!-- <v-icon :icon="(item.active)? 'mdi-eye' : 'mdi-eye-closed'" @click="toggleLayout(index)"></v-icon> -->
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                 </v-menu>
        </template>
    </v-app-bar>  

    <level-info-edit />
    <level-conversation-edit />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import levelInfoEdit from '../levelInfoEdit.vue';
import levelConversationEdit from '../levelConversationEdit.vue';
import type { eventPositionModel, levelEventModel } from '~/types/level'

const { levelData, mode, editorTheme, configState } = storeToRefs(useEditorStore())
const { layers, configOptions } = storeToRefs(useEditorStore())
const { toggleDialog } = useDialogStore()

const emit = defineEmits(['toggleLayout'])

const toggleOptions = (option: string) => {
    console.log(option)
    switch(option){
        case "Edit level info":
            toggleDialog("level-name-edit")
        break;
        case "Edit conversation phase":
            // Insert an empty event in to the array
            const battlePhaseIndex = levelData.value.event.findIndex((e: levelEventModel) => Object.entries(e.position).length)
            const newEvent = {
                position: {} as eventPositionModel,
                item: [],
                scene: [],
                trigger: "auto"
            }
            // Insert the event before battlephase
            levelData.value.event.splice(battlePhaseIndex, 0, newEvent) 
            toggleDialog("level-conversation-edit")
        break;
        case "Edit battle phase BGM":
        break;
        case "Edit level objective":
        break;
        case "Edit theme":
        break;
        case "Language":
        break;
    }
}

const toggleLayout = (index: number) => {
    layers.value[index].active = !layers.value[index].active
    emit("toggleLayout", layers.value[index])
}

const switchTheme = (v: any) => {
    console.log(v)

    if(v){
        editorTheme.value = 'dark'
    }else{
        editorTheme.value = 'light'
    }
}

const setConfigState = (v:any) => {
    configState.value = v
}
</script>
