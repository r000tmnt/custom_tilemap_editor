import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(( nuxtApp ) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        welcome: "Welcome"      
      },
      zh: {
        welcome: "歡迎"
      }
    }
  })

  nuxtApp.vueApp.use(i18n);
  // nuxtApp.provide("i18n", i18n);
  // nuxtApp.vueApp.provide("i18n", i18n);
})