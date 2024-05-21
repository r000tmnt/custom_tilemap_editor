<template>
    <section id="wrapper">
        <div class="mr-auto">
            <h3>TRANSLATIONS</h3>
        </div>
        
        <div class="d-flex flex-wrap p-2 w-75 mx-auto">
            <v-row>
                <v-col v-for="type in translateTargets"
                    :key="type"
                    cols="4">
                    <v-card :title="type">
                        <template v-slot:actions>
                            <v-btn color="secondary" 
                                text="VIEW"
                                @click="selectType(type)"></v-btn>
                        </template>
                    </v-card>
                </v-col>                
            </v-row>
        </div> 
        
    </section>
</template>

<script setup lang="ts" >
definePageMeta({
    layout: 'base'
})

import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, onMounted } from 'vue'

const { translateTargets } = storeToRefs(useLangStore())
const { toggleDialog } = useDialogStore()

const assetToDisplay = ref<any[]>([])
const selectedType = ref<string>("")

const selectType = (type: string) => {
    const translationPath = `../locale/${selectedType.value}`
    // TODO - Get message inside locale directory
}

onMounted(() => {

}) 

onBeforeMount(() => {

})
</script>
