<template>
        <v-dialog
      v-model="optionEffectDialog"
      width="auto"
      persistent
    >
        <v-card
            class="pa-2"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Create new event"
        >
            <v-form ref="formRef">
                <v-row>
                    <v-col>
                        <v-select :items="optionEffectTarget"
                            v-model="effectTargetType"></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="effectTargetType === 'player'">
                    <v-col>
                        <v-select :items="players" 
                            label="Target(player)"
                            v-model="newEffect.target"
                            :rules="selectRules">
                        </v-select>                        
                    </v-col>
                </v-row>
                <v-row v-if="effectTargetType === 'enemy'">
                    <v-col>
                        <v-select :items="enemies" 
                            label="Target(enemy)"
                            v-model="newEffect.target"
                            :rules="selectRules">
                        </v-select>
                    </v-col>
                </v-row>
                <template v-if="effectTargetType === 'player' || effectTargetType === 'enemy'">
                    <v-row>
                        <v-col>
                            <!-- attribute -->
                            <v-select label="Effected attribute" 
                                :items="attribute"
                                v-model="newEffect.attribute"
                                :rules="selectRules"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <!-- value -->
                            <template v-if="newEffect.attribute === 'equip'">
                                <v-select label="Effect value (equipment)"
                                    v-model="newEffect.value"
                                    :items="items"
                                    :rules="selectRules"
                                    @update:model-value="effectValueUpdate">
                                    <template v-slot:item="{props, item}">
                                        <v-list-item v-bind="props">
                                            {{ item.raw.id }}
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </template>

                            <template v-else-if="newEffect.attribute === 'itme'">
                                <v-select label="Effect value (item)"
                                    v-model="newEffect.value"
                                    :items="equipment"
                                    :rules="selectRules"
                                    @update:model-value="effectValueUpdate">
                                    <template v-slot:item="{props, item}">
                                        <v-list-item v-bind="props">
                                            {{ item.raw.id }}
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </template>

                            <template v-else>
                                <v-text-field type="number"
                                    label="Effect value (attribute)"
                                    v-model="newEffect.value"
                                    :rules="inputRules"
                                    :disabled="newEffect.attribute.length > 0 ? false : true"></v-text-field>
                            </template>
                        </v-col>
                    </v-row>                    
                </template>
                <!-- <template v-if="effectTargetType === 'event'">
                    <span>Select a position on the map</span>
                    <v-row v-for="i in levelData.map.length">
                        <v-col v-for="j in levelData.map[i-1].length">
                            <div style="width: 32px; height: 32px;"></div>
                        </v-col>
                    </v-row>
                </template> -->
                <v-row>
                    <v-col class="d-flex justify-end">
                        <v-btn color="grey" class="mr-2" @click="toggleDialog('option-effect-create')">CANCEL</v-btn>
                        <v-btn color="primary" @click="createEffect">CONFIRM</v-btn>
                    </v-col>
                </v-row>                
            </v-form>

        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue'
import type { optionEffectModel, effectItemReferenceModel } from '~/types/level'

const { optionEffectDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { levelData, optionEffectTarget } = storeToRefs(useEditorStore())
const { item } = storeToRefs(useItemStore())
const { selectRules, inputRules } = useRuleStore()

const emit = defineEmits(["createOptionEffect"])

const formRef = ref()

const effectTargetType = ref<string>("")
const players = computed(() => levelData.value.player.map((p,index) => `player_${index + 1}`))
const enemies = computed(() => levelData.value.enemy.map((e,index) => `enemy_${index + 1}`))
const attribute = ref<string[]>([
    "hp", 
    "mp", 
    "ap", 
    "str", 
    "spd", 
    "spi", 
    "def", 
    "int", 
    "lck", 
    "moveSpeed", 
    "sight", 
    "equip", 
    "item"
])
const items = computed(() => {
    const notEquipment = [] as effectItemReferenceModel[]
    
    item.value.key.forEach(k => notEquipment.push({ id: k.id, type: k.type }))
    item.value.material.forEach(k => notEquipment.push({ id: k.id, type: k.type }))
    item.value.potion.forEach(k => notEquipment.push({ id: k.id, type: k.type }))
    item.value.other.forEach(k => notEquipment.push({ id: k.id, type: k.type }))
    
    return notEquipment
})

const equipment = computed(() => {
    const allEquipment = [] as effectItemReferenceModel[]

    // item.value.accessory.forEach(a => notEquipment.push(a.id))
    item.value.armor.forEach(a => allEquipment.push({ id: a.id, type: a.type }))
    item.value.weapon.forEach(a => allEquipment.push({ id: a.id, type: a.type }))

    return allEquipment
})

const newEffect = ref<optionEffectModel>({
    target: "",
    attribute: "",
    value: ""
})

const effectValueUpdate = (v: any) => {
    console.log(v)
}

const createEffect = () => {
    formRef.value?.validate().then((result: any) => {
        console.log(result)

        if(result.valid){
            emit("createOptionEffect", newEffect)
            toggleDialog("option-effect-create")
        }
    })
}
</script>
