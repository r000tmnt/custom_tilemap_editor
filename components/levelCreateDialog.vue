<template>
    <v-dialog
      v-model="createLevelDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="Create new level"
      >
        <v-form ref="formRef">
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="formState.id"
                        :rules="inputRules"
                        label="Level id"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.name"
                        :rules="inputRules"
                        label="Level name"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.width"
                        :rules="numberRules"
                        type="number"
                        label="Width of the map"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.height"
                        :rules="numberRules"
                        type="number"
                        label="Height of the map"
                    ></v-text-field>                    
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-btn type="button" @click="resetFormState" block>Cancel</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn color="primary" @click="createLevel" block>Submit</v-btn> 
                    </v-col>                 
                </v-row>

            </v-container>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia'
import type responseModel from '~/types/serverResponse'

const { base_url } = storeToRefs(useMainStore())
const { createLevelDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { inputRules, numberRules } = useRuleStore()

const formState = reactive({
    id: "",
    name: "",
    width: 9,
    height: 16
})

const formRef = ref()

const emit = defineEmits(["triggerReload"])

// 重設建立表單
const resetFormState = () => {
    formState.id = ""
    formState.name = ""
    formState.width = 9
    formState.height = 16
    toggleDialog('level-create')
}

// 新建關卡檔案
const createLevel = async() => {
    try{
        const result = await formRef.value?.validate()
        console.log('validation :>>>', result)

        if(result.valid){
            const request : responseModel = await $fetch(`${base_url.value}api/data`, { method: "POST", body: formState })

            if(request.status === 200){
                emit("triggerReload")
                resetFormState()
            }  
        }
    }catch(err){
        console.log(err)
    }
}

</script>