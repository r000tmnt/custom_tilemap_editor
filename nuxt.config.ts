// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    "@pinia/nuxt",
    '@nuxtjs/i18n'
    //...
  ],
  routeRules: {
    "/": { prerender: true },
    "/item": { swr: true },
    "/skill": { swr: true },
    "/[level_id]": { ssr: false }
  },
  // 設定 pinia store auto import
  pinia: {
    storesDirs: ['./stores/**']
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})
