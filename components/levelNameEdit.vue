<template>
    <v-dialog
      v-model="levelNameEdit"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="Edit level name"
      >
        <v-form ref="formRef">
            <v-text-field label="Level name"
                :rules="inputRules"
                v-model="newName"></v-text-field>
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="toggleDialog('level-name-edit')">CANCEL</v-btn>
            <v-btn color="primary" @click="changeLevelName">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { levelData } = storeToRefs(useEditorStore())
const { levelNameEdit } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { inputRules } = useRuleStore()

const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()

const changeLevelName = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.vaild){
            levelData.value.name = newName.value
            toggleDialog("level-name-edit")            
        }
    })
}
</script>