<template>
    <section id="wrapper">
        <div class="mr-auto">
            <h3>TRANSLATIONS</h3>
        </div>
        
        <div class="d-flex flex-wrap p-2 w-75 mx-auto mt-4">
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
        
        <translation-list v-if="translationListDialog" :type="selectedType" />
    </section>
</template>

<script setup lang="ts" >
definePageMeta({
    layout: 'base'
})

import { storeToRefs } from 'pinia';
import { ref, onBeforeMount, onMounted } from 'vue'

import translationList from '~/components/translationList.vue'

const { translateTargets } = storeToRefs(useLangStore())
const { translationListDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { getTranslationList } = useLangStore()

const assetToDisplay = ref<any[]>([])
const selectedType = ref<string>("")

// TODO - Get message inside locale directory
const selectType = (type: string) => {    
    selectedType.value = type
    getTranslationList(type)
    toggleDialog('translation-viewer')
}

onMounted(() => {

}) 

onBeforeMount(() => {

})
</script>
