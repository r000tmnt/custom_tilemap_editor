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
        <v-card-text>
          <v-file-input
          v-if="!type.includes('animation')"
          label="Create asset"
          multiple
          :accept="type !== 'audio'? 'image/png' : 'audio/mp3, audio/wav'"
          :rules="fileRules"
          @update:model-value="getFiles"
          ></v-file-input>

          <v-btn v-else prepend-icon="mdi-plus-box" color="primary" >Create animation</v-btn>
        
          <v-row v-if="!props.type.includes('audio')" class="pl-4 mt-2">
            <template v-if="props.type.includes('animation')">
              <v-col v-for="(animation, key, index) in animationGroup"
                cols="12" class="px-0">
                <v-row>
                  <v-col cols="6">
                    <span>{{ key }}</span>
                    <v-img 
                      :src="String(animation? animation[frameCounter[index]] : '')"
                      aspect-ratio="1"
                      width="32"
                      height="32"
                      cover></v-img>
                  </v-col>
                  <v-col cols="6">
                    <v-btn color="secondary" @click="getAnimation(key)">Edit frames</v-btn>
                  </v-col>                     
                </v-row>
              </v-col>

              <editFrame v-if="selectedAnimation.length" 
              :frames="selectedAnimation"
              :type="props.type" 
              @clear-selected-anmimation="selectedAnimation.splice(0)"
              @set-asset-to-delete="setAssetToDelete"
              @send-new-frames="setAnimationFrameName"/>
            </template>

            <template v-else>
              <v-col v-for="(img, index) in props.asset"
                :key="String(index)"
                class="d-flex child-flex m-2"
                :cols="type === 'bg' || type === 'portrait'? 4 : 1"
                >
                <v-img 
                    :src="String(img)"
                    aspect-ratio="1"
                    :width="props.type.includes('bg') || props.type.includes('portrait')? 100 : 32"
                    :height="props.type.includes('bg') || props.type.includes('portrait')? 100 : 32"
                    cover
                    @click="getAssetsToDelete(String(img))"></v-img>
              </v-col>            
            </template>
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
        </v-card-text>
        
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia';
import vuetifyAudio from "vuetify3-audio-player"

import assetDeleteWarning from './assetDeleteWarning.vue';
import editFrame from "./editor/editFrame.vue"

import type { PropType } from 'vue';
import type { animation, animationEditData } from '~/types/animation'

const { assetViewer, assetsDelete } = storeToRefs(useDialogStore())
const { toggleDialog } = useDialogStore()
const { saveAsset, deleteAssets } = useEditorStore()
const { fileRules } = useRuleStore()

const props = defineProps({
    asset: {
        type: Array as PropType<string[]>,
        default: [] as string[]
    },
    type: {
        type: String,
        default: "env"
    }
})

const emit = defineEmits(["getNewAssets"])

const assetToDelete = ref<string>("")
const animationKey = ref<string>("")
const animationGroup = ref<animation>({})
const animationFrames = ref<number[]>([])
const frameCounter = ref<number[]>([])
const animationInterval = ref<any>(null)
const selectedAnimation = ref<string[]>([])

const setAssetToDelete = (asset: string) => {
  assetToDelete.value = asset
  console.log(assetToDelete.value)
}

const getAssetsToDelete = (asset: string) => {
  console.log("asset:>>> ", asset)
  const assetPathArray = asset.split("/")
  setAssetToDelete(assetPathArray[assetPathArray.length - 1])
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
      case 'animation-class': case 'animation-mob':
        const animationType = props.type.split("-")[1]
        assetPath = `images/${animationType}/animation`
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

const getFiles = (files: File[], name?: string) => {
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
                  case 'env': case 'class': case 'mob': case 'animation-class': case 'animation-mob':
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
                    saveAsset(files, props.type, name).then((res) => {
                      console.log("res:>>> ", res)

                      if(res.status === 200){
                        emit("getNewAssets", props.type)
                      }
                    })
                }
            }
        }
    }
}

const setAnimationFrameName = (data: animationEditData) => {
  const { files, name } = data
  getFiles(files, name)
}

const getAnimation = (key: string) => {
  console.log(key)
  animationKey.value = key
  const frames = animationGroup.value[key as keyof animation] 
  if(frames){
    selectedAnimation.value = frames
    console.log(selectedAnimation.value)
    toggleDialog("edit-frame")
  }
}

const setAnimationAssetToDisplay = () => {
    // Divide animations with the same name
    for(let i=0; i < props.asset.length; i++){
      const attribute = props.asset[i].split("_")[3]
      if(animationGroup.value[`${attribute as keyof animation}`] !== undefined){
        animationGroup.value[`${attribute as keyof animation}`]?.push(props.asset[i])
      }else{
        animationGroup.value[`${attribute as keyof animation}`] = [ props.asset[i] ]
      }
    }

    // Gather frame count
    for(let i=0, animations = Object.entries(animationGroup.value); i < animations.length; i++){
      console.log("animations", animations[i][1])
      console.log("animationslength", animations[i][1].length)
      animationFrames.value.push(animations[i][1].length)
      frameCounter.value.push(0)
    }

    if(animationInterval.value) clearInterval(animationInterval.value)

    // Play animation
    animationInterval.value = setInterval(() => {
      for(let i=0, animations = Object.entries(animationGroup.value); i < animations.length; i++){
        // console.log("frameCounter.value[i]", frameCounter.value[i])
        // console.log("animationFrames.value[i]", animationFrames.value[i] - 1)
        if(frameCounter.value[i] === (animationFrames.value[i] - 1)){
          frameCounter.value[i] = 0
        }else{
          frameCounter.value[i] += 1
        }
      }
    }, 1000)

    if(animationKey.value.length){
      const frame = animationGroup.value[animationKey.value as keyof animation]
      
      if(frame){
        selectedAnimation.value = frame
      }
    }
}

watch(() => props.asset, (newAssets, oldAssets) => {
  console.log("newAssets :>>>", newAssets)
  console.log("oldAssets :>>>", oldAssets)
  if(newAssets.length > oldAssets.length){
    // Reset object
    animationGroup.value = {}
    setAnimationAssetToDisplay()
  }
})

onMounted(() => {
  if(props.type.includes("animation")){
    setAnimationAssetToDisplay()
  }
})

onBeforeUnmount(() => {
  if(animationInterval.value !== null){
    clearInterval(animationInterval.value)
    animationInterval.value = null
    animationGroup.value = {}
  }
})
</script>
