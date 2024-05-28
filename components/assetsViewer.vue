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
      
        <v-row v-if="!props.type.includes('audio')" class="pl-4">
          <v-col v-for="(img, index) in props.asset"
            :key="String(index)"
            class="d-flex child-flex m-2"
            :cols="type === 'bg'? 4 : 1"
            >
            <v-img 
                :src="String(img)"
                aspect-ratio="1"
                cover
                @click="getAssetsToDelete(String(img))"></v-img>
          </v-col>
        </v-row>

        <div v-else>
          <template v-for="(audio, index) in props.asset"
            :key="audio">
            <v-btn 
              icon="mdi-close-circle-outline" 
              style="position: absolute; right: 0; z-index: 10"
              @click="getAssetsToDelete(String(audio))"></v-btn>
            <vuetify-audio
              :file="audio"
              color="success"
            ></vuetify-audio>
          </template>
        </div>

        <v-card-actions>
            <v-btn @click="toggleDialog('asset-viewer')">CLOSE</v-btn>
        </v-card-actions>
        </v-card>

        <asset-delete-warning 
          v-if="assetsDelete" 
          :name="assetToDelete"
          @delete-asset="deleteLocalAsset" />
    </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import vuetifyAudio from "vuetify3-audio-player"

import assetDeleteWarning from './assetDeleteWarning.vue';

const { assetViewer, assetsDelete } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveAsset, deleteAssets } = useEditorStore()
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

const emit = defineEmits(["getNewAssets"])

const assetToDelete = ref<string>("")

const getAssetsToDelete = (asset: string) => {
  console.log("asset:>>> ", asset)
  const assetPathArray = asset.split("/")
  assetToDelete.value = assetPathArray[assetPathArray.length - 1]
  console.log(assetToDelete.value)
  toggleDialog("assets-delete")
}

const deleteLocalAsset = () => {
  // Call store action
  let assetPath = ""
  switch(props.type){
      case 'audio-general':
          assetPath = "audio"
      break;
      case 'audio-battle':
          assetPath = "audio/battle"
      break;
      case 'animation':
      break;
      default:
          assetPath = `images/${props.type}`
      break;
    }

  deleteAssets(
    `assets/${assetPath}/${assetToDelete.value}`,
    props.type
  ).then((res) => {
    if(res?.status === 200){
      emit("getNewAssets", props.type)
    }
  })
}

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
