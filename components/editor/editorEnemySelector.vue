<template>
    <v-dialog
      v-model="enemySelector"
      width="auto"
      persistent
    >
        <v-card
            class="pa-4"
            width="800"
            max-height="1000"
            :scrollable="true"
            title="Set an enemy to appear on the tile"
        >
            <v-list>
                <v-list-item v-for="(mob, index) in mobs"
                    :key="mob.id"
                    @click="setMob(mob)">
                    <template v-slot:prepend>
                        <v-img :src="assets.mob[index]"
                            :width="32"
                            class="bg-black ma-2"
                            aspect-ratio="1/1">
                        </v-img>
                    </template>

                    <v-list-item-title>{{ mob.name }}</v-list-item-title>
                </v-list-item>
            </v-list>

            <v-card-actions>
                <v-btn color="gray" @click="cancelSetMobStartingPoint">CANCEL</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- <v-select
        label="Select"
        :items="mobs.map((m: mobDataModel) => m.id)"
    ></v-select> -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { mobDataModel } from '~/types/character';

const { enemySelector } = storeToRefs(useDialogStore())
const { assets, levelData, tileInfo } = storeToRefs(useEditorStore())
const { mobs } = storeToRefs(useCharacterStore())
const { tileSize } = storeToRefs(useMainStore())
const { toggleDialog } = useDialogStore()

const emit = defineEmits(["setMob"])

const setMob = (mob: mobDataModel) => {
    levelData.value.enemy.push({ startingPoint: { x: Math.floor(tileInfo.value.x / tileSize.value), y: Math.floor(tileInfo.value.y / tileSize.value) } })
    emit("setMob", mob)
}

const cancelSetMobStartingPoint = () => {
    // Remove the latest append object
    levelData.value.enemy.pop()
    toggleDialog('enemy-starting-point')
}
</script>
