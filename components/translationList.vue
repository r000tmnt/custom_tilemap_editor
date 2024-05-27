<template>
    <v-dialog
  v-model="translationListDialog"
  width="auto"
  persistent
>
  <v-card
    class="pa-2"
    width="1000"
    :title="`${props.type} translation`"
  >
    <template v-slot:text>
      <template v-if="Object.entries(translationDetail).length">
        <v-form class="d-flex">
            <!-- en message & zh message  -->
            <div class="w-50">
                <p>EN</p>
                <div v-for="(value, key, index) in translationDetail.en"
                  class="d-flex my-2 pa-2"
                  :key="key">
                  <template v-if="type === 'level' || type === 'class'">
                    <template v-if="targetToEdit.lang === 'EN' && targetToEdit.index === index">
                      <div v-if="String(key).includes('option')">
                        <v-text-field :label="String(key)" v-model="value.value"></v-text-field>  
                        <v-text-field label="response" v-model="value.content"></v-text-field>  
                      </div>

                      <v-text-field v-else :label="String(key)" v-model="translationDetail.en[String(key)]"></v-text-field>
                      <v-btn 
                        variant="outlined" 
                        color="grey" 
                        class="ml-auto"
                        @click="cancelEdit">CANCEL</v-btn>   
                    </template>
                  
                    <template v-else>
                      <div class="px-2" style="white-space: pre-line;">{{ String(key).includes("option")? `${key}: ${value.value}\nrespond: ${value.content}` : `${key}: ${value}` }}</div>   
                      <v-btn 
                        variant="outlined" 
                        color="secondary" 
                        class="ml-auto"
                        @click="switchToEdit('EN', index)">EDIT</v-btn>                      
                    </template>            
                  </template>

                  <template v-if="type === 'skill' || type === 'item'">
                    <template v-if="targetToEdit.lang === 'EN' && targetToEdit.index === index">
                      <v-text-field label="name" v-model="value.name"></v-text-field>  
                      <v-text-field label="desc" v-model="value.desc"></v-text-field>  

                      <v-btn 
                        variant="outlined" 
                        color="grey" 
                        class="ml-auto"
                        @click="cancelEdit">CANCEL</v-btn>  
                    </template>

                    <template v-else>
                      <div class="px-2" style="white-space: pre-line;">{{ `${key}: name: ${value.name}\ndesc: ${value.desc}` }}</div>   
                      <v-btn 
                        variant="outlined" 
                        color="secondary" 
                        class="ml-auto"
                        @click="switchToEdit('EN', index)">EDIT</v-btn>  
                    </template>                    
                  </template>
                </div>
            </div>

            <div class="w-50">
                <p>ZH</p>
                <div v-for="(value, key, index) in translationDetail.zh"
                  class="d-flex my-2 pa-2"
                  :key="key">
                  <template v-if="type === 'level' || type === 'class'">
                    <template v-if="targetToEdit.lang === 'ZH' && targetToEdit.index === index">
                      <div v-if="String(key).includes('option')">
                        <v-text-field :label="String(key)" v-model="value.value"></v-text-field>  
                        <v-text-field label="response" v-model="value.content"></v-text-field>  
                      </div>

                      <v-text-field v-else :label="String(key)" v-model="translationDetail.en[String(key)]"></v-text-field>
                      <v-btn 
                        variant="outlined" 
                        color="grey" 
                        class="ml-auto"
                        @click="cancelEdit">CANCEL</v-btn>  
                    </template>
                  
                    <template v-else>
                      <div class="px-2" style="white-space: pre-line;">{{ String(key).includes("option")? `${key}: ${value.value}\nrespond: ${value.content}` : `${key}: ${value}` }}</div>        
                      <v-btn 
                        variant="outlined" 
                        color="secondary" 
                        class="ml-auto"
                        @click="switchToEdit('ZH', index)">EDIT</v-btn>                  
                    </template>            
                  </template>

                  <template v-if="type === 'skill' || type === 'item'">
                    <template v-if="targetToEdit.lang === 'ZH' && targetToEdit.index === index">
                      <v-text-field label="name" v-model="value.name"></v-text-field>  
                      <v-text-field label="desc" v-model="value.desc"></v-text-field>  

                      <v-btn 
                        variant="outlined" 
                        color="grey" 
                        class="ml-auto"
                        @click="cancelEdit">CANCEL</v-btn>  
                    </template>

                    <template v-else>
                      <div class="px-2" style="white-space: pre-line;">{{ `${key}: name: ${value.name}\ndesc: ${value.desc}` }}</div>   
                      <v-btn 
                        variant="outlined" 
                        color="secondary" 
                        class="ml-auto"
                        @click="switchToEdit('ZH', index)">EDIT</v-btn>  
                    </template>                    
                  </template>
                </div>
            </div>
        </v-form>
      </template>

      <template v-else>
        <v-list-item v-for="item in translationData[props.type as keyof translationDataModel]"
          :key="item"
          @click="getTranslation(item)">
            {{ item.split(".")[0] }}
        </v-list-item>           
      </template>
    </template>

      <v-card-actions>
          <v-btn @click="toggleDialog('translation-viewer')">CLOSE</v-btn>
          <v-btn v-if="Object.entries(translationDetail).length" color="primary" @click="saveChanges">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, ref } from 'vue';
import type { translationDataModel } from '~/types/level';

const { translationData, translationDetail } = storeToRefs(useLangStore())
const { translationListDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { getTranslationData, saveTranslationData } = useLangStore()

const props = defineProps({
    type: {
        type: String,
        default: "class"
    }
})

const viewingTranslation = ref<string>("")

const targetToEdit = ref({
  lang: "",
  index: 0,
})

const switchToEdit = (lang: string, index: number) => {
  targetToEdit.value.lang = lang
  targetToEdit.value.index = index
}

const cancelEdit = () => {
  targetToEdit.value = {
    lang: "",
    index: 0
  }
}

const getTranslation = (item: string) => {
  viewingTranslation.value = item
  // Get the tanslated string from locale
  getTranslationData(item, props.type)
}

const saveChanges = () => {
  saveTranslationData(props.type, viewingTranslation.value).then(() => {
    cancelEdit()
  })
}

// Reset translation detail
onBeforeUnmount(() => {
  translationDetail.value = {}
})
</script>
