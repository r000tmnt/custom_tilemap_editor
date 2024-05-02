<template>
    <v-dialog
      v-model="levelInfoEdit"
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
                  <template v-if="editObjective !== 'victory'">
                    <span>
                      {{ `Target: ${levelData.objective.victory.target}\nValue: ${levelData.objective.victory.value}` }}
                    </span>
                    
                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="changeEditTarget('victory')"></v-icon>
                  </template>

                  <template v-else>
                    <v-select label="Target" 
                      v-model="levelData.objective.victory.target"
                      :items="objectiveTarget"
                      @update:model-value="setValueLimit"
                    ></v-select>
                    <v-text-field label="value" 
                      type="numer" 
                      v-model="levelData.objective.victory.value"
                      @update:model-value="updateValue"></v-text-field>
                    <!-- <v-select label="Prize"></v-select> -->

                    <div class="d-flex justify-end">
                      <v-icon icon="mdi-close" color="grey" class="mr-2" @click="cancelEdit"></v-icon>
                      <v-icon icon="mdi-check" color="primary" @click="editObjective = ''"></v-icon>
                    </div>
                    
                  </template>
                </v-list-item>
                <v-list-item title="Fail">
                  <template v-if="editObjective !== 'fail'">
                    <span>
                      {{ `Target: ${levelData.objective.victory.target}\nValue: ${levelData.objective.victory.value}` }}
                    </span>

                    <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="changeEditTarget('fail')"></v-icon>
                  </template>

                  <template v-else>
                    <v-select label="Target" 
                      v-model="levelData.objective.fail.target"
                      :items="objectiveTarget"
                      @update:model-value="setValueLimit"></v-select>
                    <v-text-field label="value" 
                      type="numer" 
                      v-model="levelData.objective.fail.value"
                      @update:model-value="updateValue"></v-text-field>

                    <div class="d-flex justify-end">
                      <v-icon icon="mdi-close" color="grey" class="mr-2" @click="cancelEdit"></v-icon>
                      <v-icon icon="mdi-check" color="primary" @click="editObjective = ''"></v-icon>
                    </div>
                  </template>
                </v-list-item>
                <v-list-item title="Optional">
                  <template v-if="editObjective !== 'optional'">
                      <v-list-group v-for="option in levelData.objective.optional" 
                        :key="option.target" 
                        value="Prize">
                        <template v-slot:activator="{ props }">
                          <v-list-item v-bind="props">
                            <span>
                              {{ `Target: ${option.target}\nValue: ${option.value}` }}
                            </span>
                            <v-icon class="ml-2" color="secondary" icon="mdi-note-edit-outline" @click="changeEditTarget('optional')"></v-icon>
                          </v-list-item>                        
                        </template>

                        {{ `Prize: ` }}
                        <v-list-item v-for="bonus in option.prize">
                          {{ `Id: ${bonus.id}\nAmount: ${bonus.amount}` }}
                        </v-list-item>
                      </v-list-group>
                  </template>

                  <template v-else>
                    <v-list-group v-for="(option, index) in levelData.objective.optional" 
                        :key="option.target" 
                        value="Prize">
                        <template v-slot:activator="{ props }">
                          <v-list-item v-bind="props">
                            <v-select label="Target" 
                              v-model="option.target"
                              :items="objectiveTarget"
                              @update:model-value="setValueLimit"></v-select>
                            <v-text-field label="Value" 
                              type="number" 
                              v-model="option.value"
                              @update:model-value="updateOption(index)"></v-text-field>
                          </v-list-item>                        
                        </template>
                        
                        {{ `Prize: ` }}
                        <v-list-item v-for="(bonus, pointer) in option.prize">
                          <v-select label="Prize"
                            v-model="bonus.id"
                            :items="prizeList"
                            @update:model-value="setPrize(bonus.id, index, pointer)">
                          </v-select>
                          <v-text-field label="Value" 
                            type="number" 
                            v-model="bonus.amount"
                            @update:model-value="updateOptionValue(bonus.id, index, pointer)"></v-text-field>
                        </v-list-item>
                        <v-icon icon="mdi-plus" 
                          color="secondary"
                          @click="stackUpPrize(index)"></v-icon>
                      </v-list-group>

                      <div class="d-flex justify-end">
                        <v-icon icon="mdi-close" color="grey" class="mr-2" @click="cancelEdit"></v-icon>
                        <v-icon icon="mdi-check" color="primary" @click="editObjective = ''"></v-icon>
                      </div>
                  </template>
                </v-list-item>
            </v-list>
        </v-form>

        <div  class="d-flex justify-end">
            <v-btn color="gray" class="mr-2" @click="toggleDialog('level-name-edit')">CANCEL</v-btn>
            <v-btn color="primary" @click="updateLevelInfo">CONFIRM</v-btn>
        </div>
     </v-card>
    </v-dialog>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, onBeforeMount } from 'vue';
import type { objectiveDataModel, objectiveOptionalModel } from '~/types/level'
import type { itemState } from '~/types/item'

const { levelData } = storeToRefs(useEditorStore())
const { levelInfoEdit } = storeToRefs(useDialogStore())
const { item, type } = storeToRefs(useItemStore())
const { toggleDialog } = useDialogStore()
const { inputRules } = useRuleStore()
const { getItemType, getItemData } = useItemStore()
const { saveLevelData } = useEditorStore()

const newName = ref<string>(`${levelData.value.name}`)
const formRef = ref()
const editObjective = ref<string>("")
const objectiveTarget = ref<string[]>([
  "player",
  "enemy",
  "turn"
])

const prizeList = computed(() => {
  const allItemId: string[] = []
  for(let [key, value] of Object.entries(item.value)){
    console.log(key)
    console.log(item.value[key as keyof itemState])
    item.value[key as keyof itemState].forEach(i => {
      console.log(i)
      allItemId.push(i.id)
    })
  }

  allItemId.push("exp")

  return allItemId
})

console.log(prizeList)

const targetLimit = ref<number>(0)

const objectiveBackUp = ref<objectiveDataModel | objectiveOptionalModel[]>({ target: "", value: 0 })

const changeEditTarget = (target: string) => {
  switch(editObjective.value){
      case 'victory':
        objectiveBackUp.value = levelData.value.objective.victory
      break;
      case 'fail':
        objectiveBackUp.value = levelData.value.objective.fail
      break;
      case 'optional':
        objectiveBackUp.value = levelData.value.objective.optional
      break;
    }

    editObjective.value = target
}

// Revert the data back to the previous state
const cancelEdit = () => {
  switch(editObjective.value){
      case 'victory':
        levelData.value.objective.victory = objectiveBackUp.value as objectiveDataModel
      break;
      case 'fail':
        levelData.value.objective.fail = objectiveBackUp.value as objectiveDataModel
      break;
      case 'optional':
        levelData.value.objective.optional = objectiveBackUp.value as objectiveOptionalModel[]
      break;
    }
}

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

const updateValue = (v: any) => {
  console.log(v)
  if(Number(v) > targetLimit.value){
    switch(editObjective.value){
      case 'victory':
        levelData.value.objective.victory.value = targetLimit.value
      break;
      case 'fail':
        levelData.value.objective.fail.value = targetLimit.value
      break;
    }
  }
}

const updateOption = (index: number) => {
  if(levelData.value.objective.optional[index].value > targetLimit.value){
    levelData.value.objective.optional[index].value = targetLimit.value 
  }
}

const setPrize = (id: string, index: number, pointer: number) => {
  console.log(id)
  console.log(index)
  console.log(pointer)

  const itemType = id.split("_")[0]
  
  const typeValue = type.value.find(t => t.category === itemType)
  if(typeValue)
    levelData.value.objective.optional[index].prize[pointer].type = typeValue.type
}

const updateOptionValue = (id: string, index: number, pointer: number) => {
  const itemType = id.split("_")[0]
  
  const itemData = item.value[itemType as keyof itemState]

  const theItem = itemData.find(i => i.id === id)

  if(theItem){
    if(levelData.value.objective.optional[index].prize[pointer].amount >= theItem.stackLimit){
      levelData.value.objective.optional[index].prize[pointer].amount = theItem.stackLimit
    }
  }
}

const stackUpPrize = (index: number) => {
  levelData.value.objective.optional[index].prize?.push({
    id: "",
    type: 0,
    amount: 0
  })
}

const updateLevelInfo = () => {
    formRef.value?.validate().then((result: any) => {
        if(result.vaild){
            levelData.value.name = newName.value
            saveLevelData()
            toggleDialog("level-name-edit")            
        }
    })
}

onBeforeMount(async() => {
  await getItemType()
  await getItemData()
})
</script>

<style scoped>
/* span{
  white-space: pre-line;
} */
</style>
