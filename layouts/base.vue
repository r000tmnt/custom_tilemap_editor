<template>
    <v-app>
        <v-theme-provider id="theme" class="pa-10" theme="dark" with-background>
            <!-- <v-navigation-drawer v-if="!hide">
                <v-list-item link title="List Item 1"></v-list-item>
                <v-list-item link title="List Item 2"></v-list-item>
                <v-list-item link title="List Item 3"></v-list-item>
            </v-navigation-drawer> -->

            <v-app-bar id="bar" :elevation="5">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>
                </template>

                <v-app-bar-title>Application Bar</v-app-bar-title>

                <!-- <template v-slot:append>
                    <v-btn icon="mdi-heart"></v-btn>

                    <v-btn icon="mdi-magnify"></v-btn>

                    <v-btn icon="mdi-dots-vertical"></v-btn>
                </template> -->
            </v-app-bar>   
            
            <slot />            
        </v-theme-provider>

    </v-app>

</template>

<script setup lang="ts">
// import { ref } from 'vue'

// const hide = ref(false)

</script>

<style scoped>
#theme{
    height: 100vh;
}
</style>
