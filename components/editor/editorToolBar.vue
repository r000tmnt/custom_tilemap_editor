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
            <v-menu :close-on-content-click="false" width="200">
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
                                {{ item }}
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

const { levelData, mode } = storeToRefs(useEditorStore())
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
</script>
