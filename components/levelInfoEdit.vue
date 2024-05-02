<template>
    <v-dialog
      v-model="levelNameEdit"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="Edit level info"
      >
        <v-form ref="formRef">
            <v-text-field label="Level name"
                :rules="inputRules"
                v-model="newName"></v-text-field>

            <v-select label="Battle phase BGM"></v-select>

            <p>Level objectives</p>
            <v-list>
                <v-list-item title="Victory">
                  <tmplate v-if="editObjective !== 'victory'">
                    <span>
                      {{ `Target: ${levelData.objective.victory.target}\nValue: ${levelData.objective.victory.value}` }}
                    </span>
                    
                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'victory'"></v-icon>
                  </tmplate>

                  <template v-else>
                    <v-select label="Target"></v-select>
                    <v-text-field label="value" type="numer"></v-text-field>
                    <v-select label="Prize"></v-select>

                    <v-btn icon="mdi-check" @click="editObjective = ''"></v-btn>
                  </template>
                </v-list-item>
                <v-list-item title="Fail">
                  <tmplate v-if="editObjective !== 'fail'">
                    <span>
                      {{ `Target: ${levelData.objective.victory.target}\nValue: ${levelData.objective.victory.value}` }}
                    </span>

                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'fail'"></v-icon>
                  </tmplate>

                  <template v-else>
                    <v-select label="Target"></v-select>
                    <v-text-field label="value" type="numer"></v-text-field>

                    <v-btn icon="mdi-check" @click="editObjective = ''"></v-btn>
                  </template>
                </v-list-item>
                <v-list-item title="Optional">
                  <tmplate v-if="editObjective !== 'optional'">
                      <v-list-group v-for="option in levelData.objective.optional" 
                        :key="option.target" 
                        value="Prize">
                        <template v-slot:activator="{ props }">
                          <v-list-item v-bind="props">
                            <span>
                              {{ `Target: ${option.target}\nValue: ${option.value}` }}
                            </span>
                          </v-list-item>                        
                        </template>

                        {{ `Prize: ` }}
                        <v-list-item v-for="bonus in option.prize">
                          {{ `Id: ${bonus.id}\nAmount: ${bonus.amount}` }}
                          <v-icon color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'optional'"></v-icon>
                        </v-list-item>
                      </v-list-group>
                  </tmplate>

                  <template v-else>
                    <v-list-group v-for="option in levelData.objective.optional" 
                        :key="option.target" 
                        value="Prize">
                        <template v-slot:activator="{ props }">
                          <v-list-item v-bind="props">
                            <v-select label="Target"></v-select>
                            <v-text-field label="Value" type="number"></v-text-field>
                          </v-list-item>                        
                        </template>
                        
                        {{ `Prize: ` }}
                        <v-list-item v-for="bonus in option.prize">
                          <v-select label="prize"></v-select>
                          <v-text-field label="Value" type="number"></v-text-field>
                          <v-icon color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'optional'"></v-icon>
                        </v-list-item>
                      </v-list-group>

                    <v-btn icon="mdi-check" @click="editObjective = ''"></v-btn>
                  </template>
                </v-list-item>
            </v-list>
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
const editObjective = ref<string>("")

const changeLevelName = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.vaild){
            levelData.value.name = newName.value
            toggleDialog("level-name-edit")            
        }
    })
}
</script>

<style scoped>
/* span{
  white-space: pre-line;
} */
</style>
