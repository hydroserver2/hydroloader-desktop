import { boot } from 'quasar/wrappers'
import VuePapaParse from 'vue-papa-parse'

export default boot(async (app) => {
  app.app.use(VuePapaParse)
  app.app.provide('$papa', app.app.config.globalProperties.$papa)
})
