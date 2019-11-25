import Vue from 'vue-property-decorator'
import VueI18n, { IVueI18n } from 'vue-i18n'
import { Toasted } from 'vue-toasted'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: any
    readonly $i18n: VueI18n & IVueI18n
    $toast: Toasted
    $log: any
  }
}
