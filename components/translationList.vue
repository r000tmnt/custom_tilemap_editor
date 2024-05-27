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
                  <div class="px-2" style="white-space: pre-line;">{{ String(key).includes("option")? `${key}: ${value.value}\nrespond: ${value.content}` : `${key}: ${value}` }}</div>
                  <v-btn variant="outlined" color="secondary" class="ml-auto">EDIT</v-btn>
                </div>
            </div>

            <div class="w-50">
                <p>ZH</p>
                <div v-for="(value, key, index) in translationDetail.zh"
                  class="d-flex my-2 pa-2"
                  :key="key">
                  <div class="px-2" style="white-space: pre-line;">{{ String(key).includes("option")? `${key}: ${value.value}\nrespond: ${value.content}` : `${key}: ${value}` }}</div>
                  <v-btn variant="outlined" color="secondary" class="ml-auto">EDIT</v-btn>
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
          <v-btn v-if="Object.entries(translationDetail).length" color="primary">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeUnmount } from 'vue';
import type { translationDataModel } from '~/types/level';

const { translationData, translationDetail } = storeToRefs(useLangStore())
const { translationListDialog } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { getTranslationData } = useLangStore()

const props = defineProps({
    type: {
        type: String,
        default: "class"
    }
})

const getTranslation = (item: string) => {
  // Get the tanslated string from locale
  getTranslationData(item, props.type)
}

// Reset translation detail
onBeforeUnmount(() => {
  translationDetail.value = {}
})
</script>
