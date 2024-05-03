<tempalte>
    <v-dialog
        v-model="createLevelDialog"
        width="auto"
        persistent>
        <v-card
            class="pa-2"
            width="500"
            title="Create new level">
            <v-form ref="formRef" class="pt-4 px-5">
                <v-text-field label="Name"></v-text-field>
                <v-select label="Type"></v-select>
                <v-select label="Position"></v-select>
                <v-text-field type="number"></v-text-field>
            </v-form>
        </v-card>
    </v-dialog>
</tempalte>

<script setup lang="ts">
import { ref } from 'vue'
</script>