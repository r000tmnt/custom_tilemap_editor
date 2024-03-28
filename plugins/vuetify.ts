import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    components,
    directives,
    ssr: true,
    theme: {
      themes: {
        dark: {
          colors: {
            primary: "#2196F3",
            secondary: "#009688",
            danger: "#F44336",
            warning: "#FF9800"
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})
