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
        <v-form ref="formRef" class="pt-4 px-5">
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
                    <v-select label="Target" 
                      v-model="levelData.objective.victory.target"
                      :items="objectiveTarget"
                      @update:model-value="setValueLimit"
                    ></v-select>
                    <v-text-field label="value" type="numer" v-model="levelData.objective.victory.value"></v-text-field>
                    <!-- <v-select label="Prize"></v-select> -->

                    <div class="d-flex justify-end">
                      <v-icon icon="mdi-close" color="grey" class="mr-2" @click="editObjective = ''"></v-icon>
                      <v-icon icon="mdi-check" color="primary" @click="editObjective = ''"></v-icon>
                    </div>
                    
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
                    <v-select label="Target" v-model="levelData.objective.fail.target"></v-select>
                    <v-text-field label="value" type="numer" v-model="levelData.objective.fail.value"></v-text-field>

                    <v-icon icon="mdi-check" color="primary" @click="editObjective = ''"></v-icon>
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
                            <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'optional'"></v-icon>
                          </v-list-item>                        
                        </template>

                        {{ `Prize: ` }}
                        <v-list-item v-for="bonus in option.prize">
                          {{ `Id: ${bonus.id}\nAmount: ${bonus.amount}` }}
                        </v-list-item>
                      </v-list-group>
                  </tmplate>

                  <template v-else>
                    <v-list-group v-for="option in levelData.objective.optional" 
                        :key="option.target" 
                        value="Prize">
                        <template v-slot:activator="{ props }">
                          <v-list-item v-bind="props">
                            <v-select label="Target" v-model="option.target"></v-select>
                            <v-text-field label="Value" type="number" v-model="option.value"></v-text-field>
                          </v-list-item>                        
                        </template>
                        
                        {{ `Prize: ` }}
                        <v-list-item v-for="bonus in option.prize">
                          <v-select label="prize" v-model="bonus.id"></v-select>
                          <v-text-field label="Value" type="number" v-model="bonus.amount"></v-text-field>
                          <v-icon color="secondary" icon="mdi-note-edit-outline" @click="editObjective = 'optional'"></v-icon>
                        </v-list-item>
                        <v-icon icon="mdi-plus"></v-icon>
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
const objectiveTarget = ref<string[]>([
  "player",
  "enemy",
  "turn"
])

const targetLimit = ref<number>(0)

const setValueLimit = (v: any) => {
  console.log(v)
  switch(v){
    case 'player':
      targetLimit.value = levelData.value.player.length - 1
    break;
    case 'enemy':
      targetLimit.value = levelData.value.enemy.length - 1
    break;
    case 'turn':
      targetLimit.value = Infinity
    break;
  }
}

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
