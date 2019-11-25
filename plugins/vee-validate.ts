import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

Vue.use(VeeValidate)

export default function({ app }: { app: any }) {
  Validator.localize('ja', ja)
  Validator.localize(app.i18n.loadedLanguages[0])
  app.i18n.beforeLanguageSwitch = (_oldLocale: string, newLocale: string) => {
    Validator.localize(newLocale)
  }
}
