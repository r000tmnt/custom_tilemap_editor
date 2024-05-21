import en from './locale/en.js'
import zh from './locale/zh.js'

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
      en,
      zh
    }
  }))
  