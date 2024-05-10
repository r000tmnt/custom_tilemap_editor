<template>
    <v-theme-provider :theme="editorTheme" with-background>
        <v-app>
            <slot />   

        </v-app>
    </v-theme-provider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const { editorTheme } = storeToRefs(useEditorStore())
</script>

<style scoped>
#theme{
    height: 100vh;
}
</style>
