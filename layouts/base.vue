<template>
    <v-app>
        <v-theme-provider id="theme" theme="dark" with-background>
            <v-layout>
                <v-app-bar id="bar" :elevation="5">
                    <template v-slot:prepend>
                        <v-app-bar-nav-icon @click="hide = !hide"></v-app-bar-nav-icon>
                    </template>

                    <v-app-bar-title>Application Bar</v-app-bar-title>

                    <!-- <template v-slot:append>
                        <v-btn icon="mdi-heart"></v-btn>

                        <v-btn icon="mdi-magnify"></v-btn>

                        <v-btn icon="mdi-dots-vertical"></v-btn>
                    </template> -->
                </v-app-bar>   

                <v-navigation-drawer v-if="!hide">
                    <v-list-item link prepend-icon="mdi-list-box" title="Level">
                        <Nuxt-link to="/"></Nuxt-link>
                    </v-list-item>
                    <v-list-item link prepend-icon="mdi-treasure-chest-outline" title="ITEM"></v-list-item>
                    <v-list-item link prepend-icon="mdi-magic-staff" title="SKILL"></v-list-item>
                </v-navigation-drawer>

                <v-main>
                    <slot />  
                </v-main>                
            </v-layout>


        </v-theme-provider>

    </v-app>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const hide = ref(false)

</script>

<style scoped>
#theme{
    height: 100vh;
}
</style>
