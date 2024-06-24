<template>
    <v-dialog
  v-model="assetsDelete"
  width="auto"
  persistent
>
  <v-card
    class="pa-2"
    width="400"
    max-height="1000"
    :scrollable="true"
    title="Delete all events"
    :text="`Sure you want to delete ${props.name}?`"
  >
    <v-card-actions class="d-flex justify-end">
        <v-btn color="grey" @click="toggleDialog('assets-delete')">NO</v-btn>
        <v-btn color="primary" @click="deleteAsset">YES</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const { assetsDelete } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()

const props = defineProps({
    name: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["deleteAsset"])

const deleteAsset = () => {
    emit("deleteAsset")
    toggleDialog("assets-delete")
}
</script>
