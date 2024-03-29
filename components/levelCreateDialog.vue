<template>
        <v-dialog
      v-model="createLevelDialog"
      width="auto"
    >
      <v-card
        class="pa-2"
        width="500"
        title="Create new level"
      >
        <v-form @submit.prevent>
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="formState.codeName"
                        :rules="rules"
                        label="Level id"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.name"
                        :rules="rules"
                        label="Level name"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.width"
                        :rules="rules"
                        type="number"
                        label="Width of the map"
                    ></v-text-field>                    
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="formState.height"
                        :rules="rules"
                        type="number"
                        label="Height of the map"
                    ></v-text-field>                    
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-btn type="button" @click="resetFormState" block>Cancel</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn type="submit" color="primary" @click="createLevel" block>Submit</v-btn> 
                    </v-col>                 
                </v-row>

            </v-container>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia'

const { base_url } = storeToRefs(useMainStore())
const { createLevelDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()


const formState = reactive({
    codeName: "",
    name: "",
    width: 9,
    height: 16,
    folder: "database/level"
})
const rules = [
    (value: String | Number) => {
        if (value) return true

        return 'You must enter a first name.'
    },
]

// 重設建立表單
const resetFormState = () => {
    formState.codeName = ""
    formState.name = ""
    formState.width = 9
    formState.height = 16
    toggleDialog('level')
}

// 新建關卡檔案
const createLevel = () => {
    try{
        const request = $fetch(`${base_url.value}api/data`, { method: "POST", body: formState })

        console.log(request)
    }catch(err){
        console.log(err)
    }
    resetFormState()
}

</script>