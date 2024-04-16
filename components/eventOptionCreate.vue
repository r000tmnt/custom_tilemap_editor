<template>
    <v-dialog
      v-model="eventSceneCreateDialog"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="800"
        max-height="1000"
        :scrollable="true"
        title="Create event option"
      ></v-card>
        <v-row>
            <v-col>
                <!-- Value -->
                <v-text-field label="Value"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- Content -->
                <v-textarea label="Content"></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- audio (optional) -->
                <v-select title="click audio"
                        :items="audioAssets.general"></v-select>
            </v-col>
        </v-row>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
const { audioAssets } = storeToRefs(useEditorStore())
</script>
