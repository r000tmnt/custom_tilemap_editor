<template>
        <v-dialog
      v-model="assetViewer"
      width="auto"
      persistent
    >
      <v-card
        class="pa-2"
        width="500"
        title="View assets"
      >
      <v-file-input
        label="Create asset"
        multiple
        :accept="type !== 'audio'? 'image/png' : 'audio/mp3, audio/wav'"
        :rules="fileRules"
        @update:model-value="getFiles"
        ></v-file-input>
      
        <v-row v-if="props.type !== 'audio'" class="pl-4">
          <v-col v-for="(img, index) in props.asset"
            :key="String(index)"
            class="d-flex child-flex m-2"
            :cols="type === 'bg'? 4 : 1"
            >
            <v-img 
                :src="String(img)"
                aspect-ratio="1"
                cover></v-img>
          </v-col>
        </v-row>

        <div v-else
          class="d-flex flex-wrap">
          <vuetify-audio
            v-for="(audio, index) in props.asset"
            :file="audio"
            color="success"
          ></vuetify-audio>
        </div>

        <v-card-actions>
            <v-btn @click="toggleDialog('asset-viewer')">CLOSE</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import vuetifyAudio from "vuetify3-audio-player"

const { assetViewer } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveAsset } = useEditorStore()
const { fileRules } = useRuleStore()

const props = defineProps({
    asset: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: "env"
    }
})

const emit = defineEmits([
  "getNewAssets"
])

const getFiles = (files: File[]) => {
    console.log("files :>>>", files)

    let pass: boolean | null = null

    // Check image width & height
    for(let i=0; i < files.length; i++){
        if(pass === false){
            break
        }

        const reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onloadend = (e) => {
            const tempImg = new Image()
            tempImg.src = e.target?.result as string

            tempImg.onload = () => {
                const height = tempImg.naturalHeight
                const width = tempImg.naturalWidth

                console.log('w: ',width, 'h: ', height)

                switch(props.type){
                  case 'bg':
                    if(width > 720 || width < 576 && height < 1024 || height > 1280){
                        pass = false
                    }else{
                      if((width / height) == (9/16)){
                        pass = true
                      }else{
                        pass = false
                      }  
                    }
                  break;
                  case 'env': case 'class': case 'mob':
                    if(width > 64 || width < 8 && height < 8 || height > 64){
                        pass = false
                    }else{
                      if((width / height) == 1){
                        pass = true
                      }else{
                        pass = false
                      }  
                    }
                  break;
                  case 'audio':
                  break;
                }

                if(i === (files.length - 1) && pass === true){
                    // Call action
                    saveAsset(files, props.type).then((res) => {
                      console.log("res:>>> ", res)

                      if(res.status === 200){
                        emit("getNewAssets", props.type)
                      }
                    })
                }
            }
        }
    }
    // files.forEach(f => {
    //     levelData.value.assets.push()
    // })
}
</script>
